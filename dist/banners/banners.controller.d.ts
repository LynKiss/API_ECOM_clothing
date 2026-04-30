import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    findPublic(position?: string): Promise<import("./entities/banner.entity").BannerEntity[]>;
}
