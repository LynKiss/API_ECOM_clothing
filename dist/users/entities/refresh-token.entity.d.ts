import { UserEntity } from './user.entity';
export declare class RefreshTokenEntity {
    tokenId: string;
    userId: string;
    refreshToken: string;
    expiredAt: Date;
    isRevoked: boolean;
    createdAt: Date;
    user: UserEntity;
}
