import {
  Injectable,
  Logger,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import ms, { StringValue } from 'ms';
import { Model, Types } from 'mongoose';
import { SuperAdminLoginDto } from './dto/super-admin-login.dto';
import {
  SuperAdmin,
  SuperAdminDocument,
} from './schemas/super-admin.schema';
import {
  SuperAdminRefreshToken,
  SuperAdminRefreshTokenDocument,
} from './schemas/super-admin-refresh-token.schema';
import {
  SuperAdminJwtPayload,
  SuperAdminRequestUser,
} from './super-admin.types';

const REFRESH_COOKIE_NAME = 'super_refresh_token';

@Injectable()
export class SuperAdminService implements OnModuleInit {
  private readonly logger = new Logger(SuperAdminService.name);

  constructor(
    @InjectModel(SuperAdmin.name, 'superAdminConnection')
    private readonly superAdminModel: Model<SuperAdminDocument>,
    @InjectModel(SuperAdminRefreshToken.name, 'superAdminConnection')
    private readonly refreshTokenModel: Model<SuperAdminRefreshTokenDocument>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async onModuleInit() {
    await this.seedInitialSuperAdmin();
  }

  async login(dto: SuperAdminLoginDto, response: Response) {
    const login = dto.username.trim();
    const admin = await this.superAdminModel.findOne({
      $or: [{ email: login.toLowerCase() }, { username: login }],
    });

    if (!admin || !admin.isActive || this.isLocked(admin)) {
      throw new UnauthorizedException('Thong tin dang nhap khong hop le');
    }

    const valid = await bcrypt.compare(dto.password, admin.passwordHash);
    if (!valid) {
      await this.registerFailedLogin(admin);
      throw new UnauthorizedException('Thong tin dang nhap khong hop le');
    }

    admin.failedLoginCount = 0;
    admin.lockedUntil = null;
    admin.lastLoginAt = new Date();
    await admin.save();

    return this.issueTokens(admin, response);
  }

  async refresh(refreshToken: string | undefined, response: Response) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token khong hop le');
    }

    const payload = this.verifyRefreshToken(refreshToken);
    const stored = await this.refreshTokenModel
      .findOne({
        superAdminId: new Types.ObjectId(payload._id),
        isRevoked: false,
      })
      .sort({ createdAt: -1 });

    if (!stored || stored.expiredAt.getTime() <= Date.now()) {
      throw new UnauthorizedException('Refresh token khong hop le');
    }

    const valid = await bcrypt.compare(refreshToken, stored.refreshTokenHash);
    if (!valid) {
      throw new UnauthorizedException('Refresh token khong hop le');
    }

    const admin = await this.superAdminModel.findById(payload._id);
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Tai khoan super admin khong hop le');
    }

    stored.isRevoked = true;
    await stored.save();
    return this.issueTokens(admin, response);
  }

  async logout(user: SuperAdminRequestUser, response: Response) {
    await this.refreshTokenModel.updateMany(
      { superAdminId: new Types.ObjectId(user._id), isRevoked: false },
      { isRevoked: true },
    );
    response.clearCookie(REFRESH_COOKIE_NAME, {
      httpOnly: true,
      sameSite: 'lax',
    });
    return { success: true };
  }

  async validateAccessToken(token: string): Promise<SuperAdminRequestUser> {
    const payload = this.jwtService.verify<SuperAdminJwtPayload>(token, {
      secret: this.getAccessSecret(),
    });

    if (payload.authType !== 'super_admin') {
      throw new UnauthorizedException('Super admin token khong hop le');
    }

    const admin = await this.superAdminModel.findById(payload._id);
    if (!admin || !admin.isActive) {
      throw new UnauthorizedException('Tai khoan super admin khong hop le');
    }

    return {
      _id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      authType: 'super_admin',
    };
  }

  toPublicUser(user: SuperAdminRequestUser) {
    return {
      _id: user._id,
      username: user.username,
      email: user.email,
      role: { _id: 'super_admin', name: 'super_admin' },
      permissions: [{ _id: 'super', key: 'super_admin', name: 'Super Admin' }],
      authType: 'super_admin',
    };
  }

  private async seedInitialSuperAdmin() {
    const email = this.configService.get<string>('SUPER_ADMIN_EMAIL')?.trim();
    const username = this.configService
      .get<string>('SUPER_ADMIN_USERNAME')
      ?.trim();
    const password = this.configService.get<string>('SUPER_ADMIN_PASSWORD');

    if (!email || !username || !password) {
      this.logger.warn(
        'SUPER_ADMIN_EMAIL, SUPER_ADMIN_USERNAME, SUPER_ADMIN_PASSWORD chua duoc cau hinh; bo qua seed super admin',
      );
      return;
    }

    const existing = await this.superAdminModel.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });
    if (existing) return;

    await this.superAdminModel.create({
      email: email.toLowerCase(),
      username,
      passwordHash: await bcrypt.hash(password, 12),
      isActive: true,
      failedLoginCount: 0,
      lockedUntil: null,
      lastLoginAt: null,
    });
    this.logger.log(`Seeded initial super admin: ${email}`);
  }

  private async issueTokens(admin: SuperAdminDocument, response: Response) {
    const payload: SuperAdminJwtPayload = {
      _id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      authType: 'super_admin',
    };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.getAccessSecret(),
      expiresIn: this.getAccessTokenExpires(),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.getRefreshSecret(),
      expiresIn: this.getRefreshTokenExpires(),
    });
    const expiredAt = new Date(Date.now() + ms(this.getRefreshTokenExpires()));

    await this.refreshTokenModel.updateMany(
      { superAdminId: admin._id, isRevoked: false },
      { isRevoked: true },
    );
    await this.refreshTokenModel.create({
      superAdminId: admin._id,
      refreshTokenHash: await bcrypt.hash(refreshToken, 12),
      expiredAt,
      isRevoked: false,
    });

    response.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: ms(this.getRefreshTokenExpires()),
    });

    const user: SuperAdminRequestUser = {
      _id: admin._id.toString(),
      username: admin.username,
      email: admin.email,
      authType: 'super_admin',
    };

    return {
      access_token: accessToken,
      access_token_expires_in: Math.floor(ms(this.getAccessTokenExpires()) / 1000),
      refresh_token: refreshToken,
      refresh_token_expires_in: Math.floor(ms(this.getRefreshTokenExpires()) / 1000),
      user: this.toPublicUser(user),
    };
  }

  private verifyRefreshToken(refreshToken: string) {
    const payload = this.jwtService.verify<SuperAdminJwtPayload>(refreshToken, {
      secret: this.getRefreshSecret(),
    });
    if (payload.authType !== 'super_admin') {
      throw new UnauthorizedException('Refresh token khong hop le');
    }
    return payload;
  }

  private isLocked(admin: SuperAdminDocument) {
    return Boolean(admin.lockedUntil && admin.lockedUntil.getTime() > Date.now());
  }

  private async registerFailedLogin(admin: SuperAdminDocument) {
    admin.failedLoginCount = (admin.failedLoginCount ?? 0) + 1;
    if (admin.failedLoginCount >= 5) {
      admin.lockedUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await admin.save();
  }

  private getAccessSecret() {
    return this.configService.get<string>('JWT__ACCESS_SECRET') ?? 'change-me';
  }

  private getRefreshSecret() {
    return (
      this.configService.get<string>('SUPER_ADMIN_REFRESH_SECRET') ??
      this.configService.get<string>('JWT_REFRESH_TOKEN') ??
      'change-me'
    );
  }

  private getAccessTokenExpires(): StringValue {
    return (
      (this.configService.get<string>('JWT__ACCESS_EXPIRED') as StringValue) ??
      '300s'
    );
  }

  private getRefreshTokenExpires(): StringValue {
    return (
      (this.configService.get<string>('SUPER_ADMIN_REFRESH_EXPIRED') as StringValue) ??
      (this.configService.get<string>('JWT_REFRESH_EXPIRED') as StringValue) ??
      '6000s'
    );
  }
}
