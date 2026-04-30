export declare enum DiscountType {
    PERCENT = "percent",
    FIXED = "fixed"
}
export declare enum DiscountApplyTarget {
    ORDER = "order",
    CATEGORY = "category",
    PRODUCT = "product"
}
export declare enum DiscountApprovalStatus {
    NOT_REQUIRED = "not_required",
    PENDING_APPROVAL = "pending_approval",
    APPROVED = "approved",
    REJECTED = "rejected"
}
export declare const DISCOUNT_APPROVAL_THRESHOLD_PCT = 30;
export declare const DISCOUNT_APPROVAL_THRESHOLD_FIXED = 1000000;
export declare class DiscountEntity {
    discountId: string;
    discountCode: string;
    discountName: string;
    discountType: DiscountType;
    appliesTo: DiscountApplyTarget;
    startAt: Date;
    userId: string | null;
    discountDescription: string | null;
    discountValue: string;
    expireDate: Date;
    isActive: boolean;
    usageLimit: number | null;
    usedCount: number;
    minOrderValue: string;
    maxDiscountAmount: string | null;
    approvalStatus: DiscountApprovalStatus;
    approvedBy: string | null;
    approvedAt: Date | null;
    approvalNote: string | null;
    createdAt: Date;
    updatedAt: Date;
}
