import type { IUser } from '../users/users.interface';
import { AdminSearchService } from './admin-search.service';
import { AdminSearchQueryDto } from './dto/admin-search-query.dto';
export declare class AdminSearchController {
    private readonly adminSearchService;
    constructor(adminSearchService: AdminSearchService);
    search(currentUser: IUser, query: AdminSearchQueryDto): Promise<{
        query: string;
        total: number;
        groups: {
            key: string;
            label: string;
            items: {
                id: string;
                type: "customer" | "order" | "product" | "news" | "discount" | "command" | "supplier" | "warehouse";
                title: string;
                subtitle: string;
                badge: string;
                path: string;
            }[];
        }[];
    }>;
}
