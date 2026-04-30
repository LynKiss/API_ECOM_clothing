export declare enum ReturnStatus {
    REQUESTED = "requested",
    APPROVED = "approved",
    REJECTED = "rejected",
    RECEIVED = "received",
    INSPECTED = "inspected",
    REFUNDED = "refunded"
}
export declare enum ReturnInspectionStatus {
    PENDING = "pending",
    USABLE = "usable",
    DAMAGED = "damaged",
    RETURN_TO_SUPPLIER = "return_to_supplier"
}
export declare class ReturnEntity {
    returnId: string;
    orderId: string;
    orderItemId: string;
    userId: string;
    reason: string;
    description: string | null;
    returnStatus: ReturnStatus;
    refundAmount: string | null;
    inspectionStatus: ReturnInspectionStatus;
    inspectionNote: string | null;
    inspectedBy: string | null;
    inspectedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
