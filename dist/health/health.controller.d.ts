import { DataSource } from 'typeorm';
export declare class HealthController {
    private readonly dataSource;
    private readonly startTime;
    constructor(dataSource: DataSource);
    check(): Promise<{
        status: string;
        uptime: number;
        timestamp: string;
        memoryMb: number;
    }>;
    ready(): Promise<{
        status: string;
        database: string;
        timestamp: string;
    }>;
}
