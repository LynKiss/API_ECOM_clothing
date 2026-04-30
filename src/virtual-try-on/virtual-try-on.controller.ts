import {
  Controller,
  Get,
  Post,
  UploadedFile,
  Body,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public, RequirePermissions, ResponseMessage } from '../decorator/customize';
import { CreateVirtualTryOnDto } from './dto/create-virtual-try-on.dto';
import { VirtualTryOnService } from './virtual-try-on.service';

type UploadedImageFile = {
  buffer: Buffer;
  mimetype: string;
  size: number;
  originalname: string;
};

@Controller('virtual-try-on')
export class VirtualTryOnController {
  constructor(private readonly virtualTryOnService: VirtualTryOnService) {}

  @Get('service-status')
  @RequirePermissions('manage_ai_diagnosis')
  @ResponseMessage('Get virtual try-on service status')
  getServiceStatus() {
    return this.virtualTryOnService.getServiceStatus();
  }

  @Public()
  @Post('sessions')
  @UseInterceptors(
    FileInterceptor('personImage', {
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  @ResponseMessage('Create virtual try-on session')
  createSession(
    @Body() createVirtualTryOnDto: CreateVirtualTryOnDto,
    @UploadedFile() personImage: UploadedImageFile,
  ) {
    return this.virtualTryOnService.createSession(
      createVirtualTryOnDto,
      personImage,
    );
  }
}
