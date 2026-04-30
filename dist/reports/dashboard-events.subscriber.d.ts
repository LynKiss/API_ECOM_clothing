import { DataSource, EntitySubscriberInterface, InsertEvent, RemoveEvent, SoftRemoveEvent, UpdateEvent } from 'typeorm';
import { DashboardPublisher } from './dashboard.publisher';
export declare class DashboardEventsSubscriber implements EntitySubscriberInterface {
    private readonly dashboardPublisher;
    private readonly watchedTables;
    constructor(dataSource: DataSource, dashboardPublisher: DashboardPublisher);
    afterInsert(event: InsertEvent<unknown>): void;
    afterUpdate(event: UpdateEvent<unknown>): void;
    afterRemove(event: RemoveEvent<unknown>): void;
    afterSoftRemove(event: SoftRemoveEvent<unknown>): void;
    private notify;
}
