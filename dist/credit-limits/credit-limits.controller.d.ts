import { CreditLimitsService } from './credit-limits.service';
import { RecordPaymentDto, UpsertCreditLimitDto } from './dto/upsert-credit-limit.dto';
export declare class CreditLimitsController {
    private readonly svc;
    constructor(svc: CreditLimitsService);
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
    remove(userId: string): Promise<{
        message: string;
    }>;
}
