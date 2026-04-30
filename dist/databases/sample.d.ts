export declare const ADMIN_ROLE = "ADMIN";
export declare const USER_ROLE = "USER";
export declare const INIT_PERMISSIONS: ({
    name: string;
    apiPath: string;
    method: string;
    module: string;
    key?: undefined;
} | {
    name: string;
    apiPath: string;
    method: string;
    module: string;
    key: string;
})[];
export declare const INIT_USERS: {
    name: string;
    email: string;
    age: number;
    gender: string;
    address: string;
    roleName: string;
}[];
