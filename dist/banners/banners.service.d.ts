import { Repository } from 'typeorm';
import { BannerEntity } from './entities/banner.entity';
export declare class BannersService {
    private readonly bannersRepository;
    constructor(bannersRepository: Repository<BannerEntity>);
    findPublic(position?: string): Promise<BannerEntity[]>;
}
