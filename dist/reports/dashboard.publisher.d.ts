import type { Server, Socket } from 'socket.io';
import { ReportsService } from './reports.service';
export declare class DashboardPublisher {
    private readonly reportsService;
    private server;
    private refreshTimer;
    private pendingReasons;
    private readonly logger;
    constructor(reportsService: ReportsService);
    attach(server: Server): void;
    emitSnapshot(client: Socket, reason?: string): Promise<void>;
    notifyChanged(reason?: string): void;
    private flush;
}
