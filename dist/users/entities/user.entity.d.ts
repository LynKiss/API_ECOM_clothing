import { RefreshTokenEntity } from './refresh-token.entity';
export declare enum UserRole {
    ADMIN = "admin",
    STAFF = "staff",
    CUSTOMER = "customer"
}
export declare enum MembershipTier {
    NONE = "none",
    SILVER = "silver",
    GOLD = "gold",
    DIAMOND = "diamond"
}
export declare class UserEntity {
    userId: string;
    username: string;
    email: string;
    fullName: string | null;
    phoneNumber: string | null;
    avatarUrl: string | null;
    role: UserRole;
    passwordHash: string | null;
    provider: string | null;
    providerId: string | null;
    isActive: boolean;
    isWholesale: boolean;
    resetPasswordCode: string | null;
    resetPasswordExpiresAt: Date | null;
    membershipTier: MembershipTier;
    totalSpent: string;
    createdAt: Date;
    updatedAt: Date;
    refreshTokens?: RefreshTokenEntity[];
}
