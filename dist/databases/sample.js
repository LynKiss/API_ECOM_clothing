"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INIT_USERS = exports.INIT_PERMISSIONS = exports.USER_ROLE = exports.ADMIN_ROLE = void 0;
exports.ADMIN_ROLE = 'ADMIN';
exports.USER_ROLE = 'USER';
exports.INIT_PERMISSIONS = [
    {
        name: 'Get Users',
        apiPath: '/api/v1/users',
        method: 'GET',
        module: 'USERS',
    },
    {
        name: 'Create User',
        apiPath: '/api/v1/users',
        method: 'POST',
        module: 'USERS',
    },
    {
        name: 'Get Jobs',
        apiPath: '/api/v1/jobs',
        method: 'GET',
        module: 'JOBS',
    },
    {
        name: 'Create Resume',
        apiPath: '/api/v1/resumes',
        method: 'POST',
        module: 'RESUMES',
    },
    {
        name: 'Get Companies',
        apiPath: '/api/v1/companies',
        method: 'GET',
        module: 'COMPANIES',
    },
    {
        name: 'Quản lý kho hàng',
        apiPath: '/api/v1/inventory',
        method: 'GET',
        module: 'INVENTORY',
        key: 'manage_inventory',
    },
    {
        name: 'Xem báo cáo',
        apiPath: '/api/v1/reports',
        method: 'GET',
        module: 'REPORTS',
        key: 'manage_reports',
    },
    {
        name: 'Cài đặt hệ thống',
        apiPath: '/api/v1/settings',
        method: 'GET',
        module: 'SETTINGS',
        key: 'manage_settings',
    },
    {
        name: 'Quản lý giao diện',
        apiPath: '/api/v1/interface',
        method: 'GET',
        module: 'INTERFACE',
        key: 'manage_interface',
    },
    {
        name: 'Quản lý bài viết',
        apiPath: '/api/v1/news',
        method: 'GET',
        module: 'NEWS',
        key: 'manage_news',
    },
    {
        name: 'Quản lý khuyến mãi',
        apiPath: '/api/v1/discounts',
        method: 'GET',
        module: 'DISCOUNTS',
        key: 'manage_discounts',
    },
    {
        name: 'Xem đơn hàng',
        apiPath: '/api/v1/orders',
        method: 'GET',
        module: 'ORDERS',
        key: 'view_orders',
    },
    {
        name: 'Quản lý vận chuyển',
        apiPath: '/api/v1/delivery-methods',
        method: 'GET',
        module: 'DELIVERY',
        key: 'manage_delivery',
    },
];
exports.INIT_USERS = [
    {
        name: 'System Admin',
        email: 'admin@gmail.com',
        age: 30,
        gender: 'MALE',
        address: 'VietNam',
        roleName: exports.ADMIN_ROLE,
    },
    {
        name: 'Normal User',
        email: 'user@gmail.com',
        age: 25,
        gender: 'MALE',
        address: 'VietNam',
        roleName: exports.USER_ROLE,
    },
];
//# sourceMappingURL=sample.js.map