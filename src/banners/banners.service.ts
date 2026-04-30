import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BannerEntity } from './entities/banner.entity';

@Injectable()
export class BannersService {
  constructor(
    @InjectRepository(BannerEntity)
    private readonly bannersRepository: Repository<BannerEntity>,
  ) {}

  async findPublic(position = 'homepage') {
    return this.bannersRepository.find({
      where: { position, isActive: true },
      order: { sortOrder: 'ASC', createdAt: 'ASC' },
    });
  }
}
