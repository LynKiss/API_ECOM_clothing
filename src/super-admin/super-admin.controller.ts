import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { Public, ResponseMessage } from '../decorator/customize';
import { SuperAdminLoginDto } from './dto/super-admin-login.dto';
import { SuperAdminGuard } from './super-admin.guard';
import type { RequestWithSuperAdmin } from './super-admin.guard';
import { SuperAdminService } from './super-admin.service';

@Controller('super-auth')
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) {}

  @Public()
  @Post('login')
  @ResponseMessage('Super admin login')
  login(
    @Body() dto: SuperAdminLoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.superAdminService.login(dto, response);
  }

  @Public()
  @Get('refresh')
  @ResponseMessage('Refresh super admin access token')
  refresh(@Req() req: Request, @Res({ passthrough: true }) response: Response) {
    const refreshToken = req.cookies?.super_refresh_token as string | undefined;
    return this.superAdminService.refresh(refreshToken, response);
  }

  @Public()
  @UseGuards(SuperAdminGuard)
  @Get('account')
  @ResponseMessage('Get super admin account')
  account(@Req() req: RequestWithSuperAdmin) {
    return { user: this.superAdminService.toPublicUser(req.superAdmin!) };
  }

  @Public()
  @UseGuards(SuperAdminGuard)
  @Post('logout')
  @ResponseMessage('Super admin logout')
  logout(
    @Req() req: RequestWithSuperAdmin,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.superAdminService.logout(req.superAdmin!, response);
  }
}
