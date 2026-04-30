"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSearchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const discount_entity_1 = require("../discounts/entities/discount.entity");
const news_entity_1 = require("../news/entities/news.entity");
const order_entity_1 = require("../orders/entities/order.entity");
const product_entity_1 = require("../products/entities/product.entity");
const supplier_entity_1 = require("../suppliers/entities/supplier.entity");
const user_entity_1 = require("../users/entities/user.entity");
const warehouse_entity_1 = require("../warehouses/entities/warehouse.entity");
let AdminSearchService = class AdminSearchService {
    productsRepository;
    ordersRepository;
    usersRepository;
    suppliersRepository;
    newsRepository;
    discountsRepository;
    warehousesRepository;
    constructor(productsRepository, ordersRepository, usersRepository, suppliersRepository, newsRepository, discountsRepository, warehousesRepository) {
        this.productsRepository = productsRepository;
        this.ordersRepository = ordersRepository;
        this.usersRepository = usersRepository;
        this.suppliersRepository = suppliersRepository;
        this.newsRepository = newsRepository;
        this.discountsRepository = discountsRepository;
        this.warehousesRepository = warehousesRepository;
    }
    async search(user, query) {
        const q = (query.q ?? '').trim();
        const limit = Math.min(10, Math.max(1, query.limit ?? 5));
        if (q.length < 2) {
            return { query: q, total: 0, groups: [] };
        }
        const permissions = new Set(user.permissions?.map((permission) => permission.key) ?? []);
        const groups = await Promise.all([
            this.searchCommands(q, permissions, limit),
            this.hasAny(permissions, ['manage_products'])
                ? this.searchProducts(q, limit)
                : Promise.resolve([]),
            this.hasAny(permissions, ['manage_orders'])
                ? this.searchOrders(q, limit)
                : Promise.resolve([]),
            this.hasAny(permissions, ['manage_users'])
                ? this.searchCustomers(q, limit)
                : Promise.resolve([]),
            this.hasAny(permissions, ['manage_products'])
                ? this.searchSuppliers(q, limit)
                : Promise.resolve([]),
            this.hasAny(permissions, ['manage_news'])
                ? this.searchNews(q, limit)
                : Promise.resolve([]),
            this.hasAny(permissions, ['manage_discounts'])
                ? this.searchDiscounts(q, limit)
                : Promise.resolve([]),
            this.hasAny(permissions, ['manage_inventory'])
                ? this.searchWarehouses(q, limit)
                : Promise.resolve([]),
        ]);
        const namedGroups = [
            { key: 'commands', label: 'Chuc nang', items: groups[0] },
            { key: 'products', label: 'San pham', items: groups[1] },
            { key: 'orders', label: 'Don hang', items: groups[2] },
            { key: 'customers', label: 'Khach hang', items: groups[3] },
            { key: 'suppliers', label: 'Nha cung cap', items: groups[4] },
            { key: 'news', label: 'Bai viet', items: groups[5] },
            { key: 'discounts', label: 'Ma giam gia', items: groups[6] },
            { key: 'warehouses', label: 'Kho hang', items: groups[7] },
        ].filter((group) => group.items.length > 0);
        return {
            query: q,
            total: namedGroups.reduce((sum, group) => sum + group.items.length, 0),
            groups: namedGroups,
        };
    }
    async searchProducts(q, limit) {
        const search = `%${q}%`;
        const products = await this.productsRepository
            .createQueryBuilder('product')
            .where(`product.product_name LIKE :search
        OR product.product_slug LIKE :search
        OR product.product_id LIKE :search
        OR product.barcode LIKE :search
        OR product.box_barcode LIKE :search`, { search })
            .orderBy('product.updated_at', 'DESC')
            .take(limit)
            .getMany();
        return products.map((product) => ({
            id: product.productId,
            type: 'product',
            title: product.productName,
            subtitle: `Ton ${product.quantityAvailable} ${product.unit ?? ''}`.trim(),
            badge: product.isShow ? 'Dang hien thi' : 'Dang an',
            path: `/admin/products?search=${encodeURIComponent(product.productName)}`,
        }));
    }
    async searchOrders(q, limit) {
        const search = `%${q}%`;
        const orders = await this.ordersRepository
            .createQueryBuilder('order')
            .where(`order.order_id LIKE :search
        OR order.user_id LIKE :search
        OR order.full_name LIKE :search
        OR order.phone LIKE :search`, { search })
            .orderBy('order.created_at', 'DESC')
            .take(limit)
            .getMany();
        return orders.map((order) => ({
            id: order.orderId,
            type: 'order',
            title: `Don ${order.orderId.slice(0, 8)}`,
            subtitle: `${order.fullName} - ${order.phone}`,
            badge: order.orderStatus,
            path: `/admin/orders?search=${encodeURIComponent(order.orderId)}`,
        }));
    }
    async searchCustomers(q, limit) {
        const search = `%${q}%`;
        const users = await this.usersRepository
            .createQueryBuilder('user')
            .where(`user.username LIKE :search
        OR user.email LIKE :search
        OR user.user_id LIKE :search`, { search })
            .orderBy('user.updated_at', 'DESC')
            .take(limit)
            .getMany();
        return users.map((customer) => ({
            id: customer.userId,
            type: 'customer',
            title: customer.username,
            subtitle: customer.email,
            badge: customer.isActive ? customer.role : 'inactive',
            path: `/admin/customers?search=${encodeURIComponent(customer.username)}`,
        }));
    }
    async searchSuppliers(q, limit) {
        const search = `%${q}%`;
        const suppliers = await this.suppliersRepository
            .createQueryBuilder('supplier')
            .where(`supplier.name LIKE :search
        OR supplier.code LIKE :search
        OR supplier.phone LIKE :search
        OR supplier.email LIKE :search
        OR supplier.tax_code LIKE :search`, { search })
            .orderBy('supplier.updated_at', 'DESC')
            .take(limit)
            .getMany();
        return suppliers.map((supplier) => ({
            id: supplier.supplierId,
            type: 'supplier',
            title: supplier.name,
            subtitle: [supplier.code, supplier.phone, supplier.email].filter(Boolean).join(' - '),
            badge: supplier.isActive ? 'active' : 'inactive',
            path: `/admin/suppliers?search=${encodeURIComponent(supplier.name)}`,
        }));
    }
    async searchNews(q, limit) {
        const search = `%${q}%`;
        const articles = await this.newsRepository
            .createQueryBuilder('news')
            .where(`news.title LIKE :search
        OR news.sub_title LIKE :search
        OR news.slug LIKE :search`, { search })
            .orderBy('news.updated_at', 'DESC')
            .take(limit)
            .getMany();
        return articles.map((article) => ({
            id: String(article.newsId),
            type: 'news',
            title: article.title,
            subtitle: article.subTitle ?? article.slug,
            badge: article.isPublished ? 'published' : 'draft',
            path: `/admin/news?search=${encodeURIComponent(article.title)}`,
        }));
    }
    async searchDiscounts(q, limit) {
        const search = `%${q}%`;
        const discounts = await this.discountsRepository
            .createQueryBuilder('discount')
            .where(`discount.discount_code LIKE :search
        OR discount.discount_name LIKE :search
        OR discount.discount_description LIKE :search`, { search })
            .orderBy('discount.updated_at', 'DESC')
            .take(limit)
            .getMany();
        return discounts.map((discount) => ({
            id: String(discount.discountId),
            type: 'discount',
            title: discount.discountName,
            subtitle: discount.discountCode,
            badge: discount.isActive ? discount.discountType : 'inactive',
            path: `/admin/discounts?search=${encodeURIComponent(discount.discountCode)}`,
        }));
    }
    async searchWarehouses(q, limit) {
        const search = `%${q}%`;
        const warehouses = await this.warehousesRepository
            .createQueryBuilder('warehouse')
            .where(`warehouse.name LIKE :search
        OR warehouse.code LIKE :search
        OR warehouse.address LIKE :search
        OR warehouse.manager_name LIKE :search
        OR warehouse.phone LIKE :search`, { search })
            .orderBy('warehouse.updated_at', 'DESC')
            .take(limit)
            .getMany();
        return warehouses.map((warehouse) => ({
            id: warehouse.warehouseId,
            type: 'warehouse',
            title: warehouse.name,
            subtitle: [warehouse.code, warehouse.managerName, warehouse.phone].filter(Boolean).join(' - '),
            badge: warehouse.isDefault ? 'mac dinh' : warehouse.isActive ? 'active' : 'inactive',
            path: `/admin/warehouses?search=${encodeURIComponent(warehouse.name)}`,
        }));
    }
    async searchCommands(q, permissions, limit) {
        const normalized = this.normalize(q);
        return this.commands()
            .filter((command) => this.hasAny(permissions, command.permissions ?? []))
            .filter((command) => [command.title, command.subtitle, command.badge, ...command.keywords]
            .map((value) => this.normalize(value))
            .some((value) => value.includes(normalized)))
            .slice(0, limit);
    }
    commands() {
        return [
            this.command('dashboard', 'Tong quan', 'Dashboard dieu hanh', '/admin', ['dashboard', 'tong quan']),
            this.command('products', 'Tat ca san pham', 'Quan ly catalog, gia, ton kho', '/admin/products', ['san pham', 'catalog'], ['manage_products']),
            this.command('product-new', 'Them san pham', 'Tao san pham moi', '/admin/products/new', ['them san pham', 'tao san pham'], ['manage_products']),
            this.command('low-stock', 'Tong quan ton kho', 'San pham sap het hang', '/admin/products/inventory-lowstock', ['ton kho', 'sap het hang', 'de xuat nhap hang', 'reorder'], ['manage_inventory']),
            this.command('orders', 'Don hang', 'Quan ly trang thai don hang', '/admin/orders', ['don hang', 'dang giao', 'cho xac nhan'], ['manage_orders']),
            this.command('returns', 'Tra hang', 'Xu ly yeu cau tra hang', '/admin/returns', ['tra hang', 'hoan hang'], ['manage_orders']),
            this.command('customers', 'Khach hang', 'Tai khoan va thong tin khach', '/admin/customers', ['khach hang', 'tai khoan', 'user'], ['manage_users']),
            this.command('discounts', 'Ma giam gia', 'Chuong trinh khuyen mai', '/admin/discounts', ['coupon', 'giam gia', 'khuyen mai'], ['manage_discounts']),
            this.command('news', 'Bai viet', 'Tin tuc va noi dung', '/admin/news', ['bai viet', 'tin tuc', 'blog'], ['manage_news']),
            this.command('reviews', 'Danh gia san pham', 'Kiem duyet review', '/admin/reviews', ['review', 'danh gia'], ['manage_reviews']),
            this.command('support', 'Chat ho tro', 'Hoi thoai khach hang', '/admin/support-chats', ['chat', 'ho tro'], ['manage_support']),
            this.command('suppliers', 'Nha cung cap', 'Danh sach nha cung cap', '/admin/suppliers', ['nha cung cap', 'supplier'], ['manage_products']),
            this.command('procurement', 'Mua hang', 'Phieu mua va nhap hang', '/admin/procurement', ['mua hang', 'purchase order'], ['manage_products']),
            this.command('pricing', 'Dinh gia ban', 'Goi y va dieu chinh gia', '/admin/pricing', ['gia ban', 'pricing'], ['manage_products']),
            this.command('warehouses', 'Kho hang', 'Quan ly kho', '/admin/warehouses', ['kho hang', 'warehouse'], ['manage_inventory']),
            this.command('ledger', 'So kho chi tiet', 'Lich su nhap xuat ton', '/admin/inventory-ledger', ['so kho', 'nhap xuat ton'], ['manage_inventory']),
            this.command('valuation', 'Gia tri ton kho', 'Bao cao gia tri hang ton', '/admin/inventory-valuation', ['gia tri ton kho'], ['manage_reports']),
            this.command('reports', 'Bao cao kinh doanh', 'Doanh thu va thong ke', '/admin/reports', ['bao cao', 'doanh thu'], ['manage_reports']),
            this.command('recommendation-ai', 'AI goi y san pham', 'Machine Learning recommendation', '/admin/reports', ['ai', 'ml', 'goi y san pham', 'recommendation'], ['manage_reports']),
            this.command('forecast-ai', 'Du bao nhu cau', 'Demand forecasting', '/admin/products/inventory-lowstock', ['du bao', 'forecast', 'demand'], ['manage_inventory']),
            this.command('rice-ai', 'AI phoi do', 'Tu van size va phoi do', '/admin/rice-diagnosis', ['ai', 'phoi do', 'style', 'size'], ['manage_ai_diagnosis']),
            this.command('settings', 'Cai dat', 'Cau hinh he thong', '/admin/settings', ['cai dat', 'settings']),
            this.command('security', 'Bao mat', 'Doi mat khau va bao mat tai khoan', '/admin/security', ['bao mat', 'mat khau']),
        ];
    }
    command(id, title, subtitle, path, keywords, permissions) {
        return {
            id,
            type: 'command',
            title,
            subtitle,
            badge: 'Dieu huong',
            path,
            keywords,
            permissions,
        };
    }
    hasAny(permissions, required) {
        if (required.length === 0) {
            return true;
        }
        return required.some((permission) => permissions.has(permission));
    }
    normalize(value) {
        return value
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }
};
exports.AdminSearchService = AdminSearchService;
exports.AdminSearchService = AdminSearchService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.OrderEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(supplier_entity_1.SupplierEntity)),
    __param(4, (0, typeorm_1.InjectRepository)(news_entity_1.NewsEntity)),
    __param(5, (0, typeorm_1.InjectRepository)(discount_entity_1.DiscountEntity)),
    __param(6, (0, typeorm_1.InjectRepository)(warehouse_entity_1.WarehouseEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], AdminSearchService);
//# sourceMappingURL=admin-search.service.js.map