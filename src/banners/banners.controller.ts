import { Controller, Get, Query } from '@nestjs/common';
import { BannersService } from './banners.service';

@Controller('banners')
export class BannersController {
  constructor(private readonly bannersService: BannersService) {}

  @Get()
  findPublic(@Query('position') position?: string) {
    return this.bannersService.findPublic(position || 'homepage');
  }
}
