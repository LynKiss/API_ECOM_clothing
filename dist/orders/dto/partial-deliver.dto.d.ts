export declare class PartialDeliverItemDto {
    orderItemId: string;
    deliveredQty: number;
}
export declare class PartialDeliverDto {
    items: PartialDeliverItemDto[];
    note?: string;
}
