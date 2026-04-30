export declare class SimpleCacheService {
    private readonly logger;
    private readonly store;
    constructor();
    get<T>(key: string): T | undefined;
    set<T>(key: string, value: T, ttlSeconds?: number): void;
    del(key: string): void;
    invalidatePrefix(prefix: string): number;
    clear(): void;
    getOrCompute<T>(key: string, ttlSeconds: number, compute: () => Promise<T>): Promise<T>;
    private cleanupExpired;
}
