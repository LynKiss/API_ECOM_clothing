import { ReturnStatus } from '../entities/return.entity';
export declare class UpdateReturnStatusDto {
    status: ReturnStatus;
    refundAmount?: string;
    note?: string;
}
