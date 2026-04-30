import { DatabasesService } from './databases.service';
export declare class DatabasesController {
    private readonly databasesService;
    constructor(databasesService: DatabasesService);
    getSummary(): Promise<{
        users: number;
        permissions: number;
        refreshTokens: number;
    }>;
}
