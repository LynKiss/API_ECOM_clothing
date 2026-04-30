"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withDeadlockRetry = withDeadlockRetry;
async function withDeadlockRetry(fn, maxRetries = 3) {
    let lastErr;
    for (let attempt = 0; attempt < maxRetries; attempt += 1) {
        try {
            return await fn();
        }
        catch (err) {
            lastErr = err;
            const code = err?.code ?? err?.driverError?.code;
            const errno = err?.errno ?? err?.driverError?.errno;
            const isDeadlock = code === 'ER_LOCK_DEADLOCK' ||
                code === 'ER_LOCK_WAIT_TIMEOUT' ||
                errno === 1213 ||
                errno === 1205;
            if (!isDeadlock || attempt === maxRetries - 1) {
                throw err;
            }
            const delay = 50 * Math.pow(2, attempt) + Math.floor(Math.random() * 25);
            await new Promise((resolve) => setTimeout(resolve, delay));
        }
    }
    throw lastErr;
}
//# sourceMappingURL=transaction.util.js.map