import { Repository } from 'typeorm';
import { OrderEntity } from '../orders/entities/order.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CustomerCreditLimitEntity } from './entities/customer-credit-limit.entity';
import { RecordPaymentDto, UpsertCreditLimitDto } from './dto/upsert-credit-limit.dto';
export declare class CreditLimitsService {
    private readonly repo;
    private readonly userRepo;
    private readonly orderRepo;
    constructor(repo: Repository<CustomerCreditLimitEntity>, userRepo: Repository<UserEntity>, orderRepo: Repository<OrderEntity>);
    findAll(page?: number, limit?: number): Promise<{
        items: {
            username: string | null;
            email: string | null;
            availableCredit: number;
            limitId: string;
            userId: string;
            creditLimit: string;
            currentDebt: string;
            paymentTerms: number;
            isActive: boolean;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        }[];
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    findByUser(userId: string): Promise<{
        username: string | null;
        email: string | null;
        availableCredit: number;
        limitId: string;
        userId: string;
        creditLimit: string;
        currentDebt: string;
        paymentTerms: number;
        isActive: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    upsert(dto: UpsertCreditLimitDto): Promise<{
        username: string | null;
        email: string | null;
        availableCredit: number;
        limitId: string;
        userId: string;
        creditLimit: string;
        currentDebt: string;
        paymentTerms: number;
        isActive: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    syncDebt(userId: string): Promise<{
        username: string | null;
        email: string | null;
        availableCredit: number;
        limitId: string;
        userId: string;
        creditLimit: string;
        currentDebt: string;
        paymentTerms: number;
        isActive: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    recordPayment(dto: RecordPaymentDto): Promise<{
        username: string | null;
        email: string | null;
        availableCredit: number;
        limitId: string;
        userId: string;
        creditLimit: string;
        currentDebt: string;
        paymentTerms: number;
        isActive: boolean;
        notes: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    checkCreditAllowed(userId: string, orderAmount: number): Promise<{
        allowed: boolean;
        message?: string;
    }>;
    remove(userId: string): Promise<{
        message: string;
    }>;
}
