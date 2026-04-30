"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const jwt_1 = require("@nestjs/jwt");
const ms_1 = __importDefault(require("ms"));
const roles_service_1 = require("../roles/roles.service");
const users_service_1 = require("../users/users.service");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    rolesService;
    constructor(usersService, jwtService, configService, rolesService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.rolesService = rolesService;
    }
    async validateUser(username, pass) {
        const user = await this.usersService.findOneByUsername(username);
        if (!user || !user.isActive) {
            return null;
        }
        const isPasswordValid = await this.usersService.checkUserPassword(pass, user.passwordHash);
        if (!isPasswordValid) {
            return null;
        }
        return this.toAuthUser(user);
    }
    async login(user, response) {
        const payload = this.buildTokenPayload(user);
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.createRefreshToken(payload);
        const refreshExpiresAt = new Date(Date.now() + (0, ms_1.default)(this.getRefreshTokenExpires()));
        if (response) {
            this.setRefreshTokenCookie(response, refreshToken);
        }
        await this.usersService.updateUserRefreshToken(user._id, refreshToken, refreshExpiresAt);
        const permissions = await this.loadPermissionsForRole(user.role);
        return {
            access_token: accessToken,
            access_token_expires_in: this.toExpiresInSeconds(this.getAccessTokenExpires()),
            refresh_token: refreshToken,
            refresh_token_expires_in: this.toExpiresInSeconds(this.getRefreshTokenExpires()),
            user: {
                ...user,
                permissions,
            },
        };
    }
    async register(registerUserDto) {
        return this.usersService.register(registerUserDto);
    }
    async refreshToken(refreshToken, response) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token không hợp lệ');
        }
        const payload = this.jwtService.verify(refreshToken, {
            secret: this.getRefreshTokenSecret(),
        });
        await this.usersService.validateStoredRefreshToken(payload._id, refreshToken);
        const userEntity = await this.usersService.findOneByIdForAuth(payload._id);
        if (!userEntity || !userEntity.isActive) {
            throw new common_1.UnauthorizedException('Tài khoản không tồn tại hoặc đã bị khóa');
        }
        const user = this.toAuthUser(userEntity);
        const newPayload = this.buildTokenPayload(user);
        const newAccessToken = this.jwtService.sign(newPayload);
        const newRefreshToken = this.createRefreshToken(newPayload);
        const refreshExpiresAt = new Date(Date.now() + (0, ms_1.default)(this.getRefreshTokenExpires()));
        this.setRefreshTokenCookie(response, newRefreshToken);
        await this.usersService.updateUserRefreshToken(user._id, newRefreshToken, refreshExpiresAt);
        return {
            access_token: newAccessToken,
            access_token_expires_in: this.toExpiresInSeconds(this.getAccessTokenExpires()),
            user: {
                ...user,
                permissions: await this.loadPermissionsForRole(user.role),
            },
        };
    }
    async logout(user, response) {
        await this.usersService.updateUserRefreshToken(user._id, null);
        response.clearCookie('refresh_token', {
            httpOnly: true,
            sameSite: 'lax',
        });
        return { success: true };
    }
    createRefreshToken(payload) {
        return this.jwtService.sign(payload, {
            secret: this.getRefreshTokenSecret(),
            expiresIn: this.getRefreshTokenExpires(),
        });
    }
    buildTokenPayload(user) {
        return {
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
        };
    }
    async loadPermissionsForRole(role) {
        if (!role?._id) {
            return [];
        }
        const fullRole = await this.rolesService.findOne(role._id);
        return fullRole.permissions;
    }
    toAuthUser(user) {
        return {
            _id: user.userId,
            username: user.username,
            email: user.email,
            fullName: user.fullName,
            phoneNumber: user.phoneNumber,
            avatarUrl: user.avatarUrl,
            role: {
                _id: user.role,
                name: user.role,
            },
            permissions: [],
        };
    }
    getAccessTokenExpires() {
        return (this.configService.get('JWT__ACCESS_EXPIRED') ??
            '300s');
    }
    getRefreshTokenExpires() {
        return (this.configService.get('JWT_REFRESH_EXPIRED') ??
            '6000s');
    }
    getRefreshTokenSecret() {
        return this.configService.get('JWT_REFRESH_TOKEN') ?? 'change-me';
    }
    toExpiresInSeconds(duration) {
        return Math.floor((0, ms_1.default)(duration) / 1000);
    }
    setRefreshTokenCookie(response, refreshToken) {
        response.cookie('refresh_token', refreshToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: (0, ms_1.default)(this.getRefreshTokenExpires()),
        });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_1.ConfigService,
        roles_service_1.RolesService])
], AuthService);
//# sourceMappingURL=auth.service.js.map