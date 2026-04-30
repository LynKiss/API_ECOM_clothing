export declare function withDeadlockRetry<T>(fn: () => Promise<T>, maxRetries?: number): Promise<T>;
