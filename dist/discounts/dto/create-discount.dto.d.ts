import { DiscountApplyTarget, DiscountType } from '../entities/discount.entity';
export declare class CreateDiscountDto {
    discountCode: string;
    discountName: string;
    discountType: DiscountType;
    appliesTo?: DiscountApplyTarget;
    startAt: string;
    expireDate: string;
    userId?: string;
    discountDescription?: string;
    discountValue: string;
    isActive?: boolean;
    usageLimit?: number;
    minOrderValue?: string;
    maxDiscountAmount?: string;
    categoryIds?: string[];
    productIds?: string[];
}
