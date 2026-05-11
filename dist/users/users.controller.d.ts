import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateAdminUserDto } from './dto/create-admin-user.dto';
import { CreateShippingAddressDto } from './dto/create-shipping-address.dto';
import { QueryAdminUsersDto } from './dto/query-admin-users.dto';
import { ResetAdminUserPasswordDto } from './dto/reset-admin-user-password.dto';
import { UpdateShippingAddressDto } from './dto/update-shipping-address.dto';
import { UpdateAdminUserDto } from './dto/update-admin-user.dto';
import { UpdateAdminUserStatusDto } from './dto/update-admin-user-status.dto';
import type { IUser } from './users.interface';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
type UploadedImageFile = {
    buffer: Buffer;
    mimetype: string;
    size: number;
    originalname: string;
};
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getUsers(query: QueryAdminUsersDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: {
            isActive: boolean;
            isWholesale: boolean;
            createdAt: Date;
            _id: string;
            username: string;
            email: string;
            fullName?: string | null;
            phoneNumber?: string | null;
            avatarUrl?: string | null;
            role: import("./users.interface").IUserRoleSummary;
            permissions: import("./users.interface").IUserPermission[];
        }[];
    }>;
    createCustomer(currentUser: IUser, createAdminUserDto: CreateAdminUserDto): Promise<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        _id: string;
        username: string;
        email: string;
        fullName?: string | null;
        phoneNumber?: string | null;
        avatarUrl?: string | null;
        role: import("./users.interface").IUserRoleSummary;
        permissions: import("./users.interface").IUserPermission[];
    }>;
    getCustomerDetail(id: string): Promise<{
        isActive: boolean;
        isWholesale: boolean;
        createdAt: Date;
        updatedAt: Date;
        statistics: {
            addressesCount: number;
            ordersCount: number;
        };
        _id: string;
        username: string;
        email: string;
        fullName?: string | null;
        phoneNumber?: string | null;
        avatarUrl?: string | null;
        role: import("./users.interface").IUserRoleSummary;
        permissions: import("./users.interface").IUserPermission[];
    }>;
    updateCustomer(currentUser: IUser, id: string, updateAdminUserDto: UpdateAdminUserDto): Promise<{
        isActive: boolean;
        isWholesale: boolean;
        createdAt: Date;
        updatedAt: Date;
        _id: string;
        username: string;
        email: string;
        fullName?: string | null;
        phoneNumber?: string | null;
        avatarUrl?: string | null;
        role: import("./users.interface").IUserRoleSummary;
        permissions: import("./users.interface").IUserPermission[];
    }>;
    uploadCustomerAvatar(currentUser: IUser, id: string, file: UploadedImageFile): Promise<{
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        _id: string;
        username: string;
        email: string;
        fullName?: string | null;
        phoneNumber?: string | null;
        avatarUrl?: string | null;
        role: import("./users.interface").IUserRoleSummary;
        permissions: import("./users.interface").IUserPermission[];
    }>;
    updateCustomerStatus(currentUser: IUser, id: string, updateAdminUserStatusDto: UpdateAdminUserStatusDto): Promise<{
        isActive: boolean;
        _id: string;
        username: string;
        email: string;
        fullName?: string | null;
        phoneNumber?: string | null;
        avatarUrl?: string | null;
        role: import("./users.interface").IUserRoleSummary;
        permissions: import("./users.interface").IUserPermission[];
    }>;
    resetCustomerPassword(currentUser: IUser, id: string, resetAdminUserPasswordDto: ResetAdminUserPasswordDto): Promise<{
        passwordReset: boolean;
        _id: string;
        username: string;
        email: string;
        fullName?: string | null;
        phoneNumber?: string | null;
        avatarUrl?: string | null;
        role: import("./users.interface").IUserRoleSummary;
        permissions: import("./users.interface").IUserPermission[];
    }>;
    deleteCustomer(currentUser: IUser, id: string): Promise<{
        _id: string;
        deleted: boolean;
    }>;
    getMyProfile(currentUser: IUser): Promise<{
        isWholesale: boolean;
        _id: string;
        username: string;
        email: string;
        fullName?: string | null;
        phoneNumber?: string | null;
        avatarUrl?: string | null;
        role: import("./users.interface").IUserRoleSummary;
        permissions: import("./users.interface").IUserPermission[];
    }>;
    updateMyProfile(currentUser: IUser, updateUserDto: UpdateUserDto): Promise<IUser>;
    uploadMyAvatar(currentUser: IUser, file: UploadedImageFile): Promise<IUser>;
    changeMyPassword(currentUser: IUser, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getMyShippingAddresses(currentUser: IUser): Promise<{
        id: string;
        recipientName: string;
        phone: string;
        addressLine: string;
        ward: string | null;
        district: string | null;
        province: string | null;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createMyShippingAddress(currentUser: IUser, createShippingAddressDto: CreateShippingAddressDto): Promise<{
        id: string;
        recipientName: string;
        phone: string;
        addressLine: string;
        ward: string | null;
        district: string | null;
        province: string | null;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMyShippingAddress(currentUser: IUser, id: string, updateShippingAddressDto: UpdateShippingAddressDto): Promise<{
        id: string;
        recipientName: string;
        phone: string;
        addressLine: string;
        ward: string | null;
        district: string | null;
        province: string | null;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteMyShippingAddress(currentUser: IUser, id: string): Promise<{
        id: string;
        deleted: boolean;
    }>;
    setMyDefaultShippingAddress(currentUser: IUser, id: string): Promise<{
        id: string;
        recipientName: string;
        phone: string;
        addressLine: string;
        ward: string | null;
        district: string | null;
        province: string | null;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMyOrders(currentUser: IUser, page?: string, limit?: string, status?: string): Promise<{
        items: {
            id: string;
            status: import("../orders/entities/order.entity").OrderStatus;
            paymentMethod: import("../orders/entities/order.entity").PaymentMethod;
            paymentStatus: import("../orders/entities/order.entity").PaymentStatus;
            totalPayment: string;
            totalQuantity: number;
            createdAt: Date;
            fullName: string;
            phone: string;
            address: string;
        }[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }>;
    getMyOrderDetail(currentUser: IUser, id: string): Promise<{
        shippingAddressId: string | null;
        deliveryId: string | null;
        discountId: string | null;
        subtotalAmount: string;
        discountAmount: string;
        deliveryCost: string;
        note: string | null;
        items: {
            id: string;
            productId: string;
            productName: string;
            quantity: number;
            unitPrice: string;
            lineTotal: string;
        }[];
        id: string;
        status: import("../orders/entities/order.entity").OrderStatus;
        paymentMethod: import("../orders/entities/order.entity").PaymentMethod;
        paymentStatus: import("../orders/entities/order.entity").PaymentStatus;
        totalPayment: string;
        totalQuantity: number;
        createdAt: Date;
        fullName: string;
        phone: string;
        address: string;
    }>;
}
export {};
