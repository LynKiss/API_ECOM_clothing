import type { IUser } from '../users/users.interface';
import { CreateReturnDto } from './dto/create-return.dto';
import { InspectReturnDto } from './dto/inspect-return.dto';
import { UpdateReturnStatusDto } from './dto/update-return-status.dto';
import { OrdersService } from './orders.service';
export declare class ReturnsController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    createReturn(currentUser: IUser, createReturnDto: CreateReturnDto): Promise<import("./entities/return.entity").ReturnEntity>;
    getMyReturns(currentUser: IUser): Promise<{
        id: string;
        orderId: string;
        orderItemId: string;
        reason: string;
        description: string | null;
        status: import("./entities/return.entity").ReturnStatus;
        refundAmount: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getAllReturns(): Promise<{
        id: string;
        orderId: string;
        userId: string;
        orderItemId: string;
        reason: string;
        description: string | null;
        status: import("./entities/return.entity").ReturnStatus;
        refundAmount: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    updateReturnStatus(currentUser: IUser, id: string, updateReturnStatusDto: UpdateReturnStatusDto): Promise<import("./entities/return.entity").ReturnEntity>;
    inspectReturn(currentUser: IUser, id: string, dto: InspectReturnDto): Promise<import("./entities/return.entity").ReturnEntity | null>;
}
