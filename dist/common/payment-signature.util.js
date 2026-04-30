"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyMomoSignature = verifyMomoSignature;
exports.verifyVnpaySignature = verifyVnpaySignature;
const node_crypto_1 = require("node:crypto");
function verifyMomoSignature(body, accessKey, secretKey) {
    if (!accessKey || !secretKey)
        return false;
    const incomingSignature = String(body.signature ?? '').trim();
    if (!incomingSignature)
        return false;
    const fields = {
        accessKey,
        amount: String(body.amount ?? ''),
        extraData: String(body.extraData ?? ''),
        message: String(body.message ?? ''),
        orderId: String(body.orderId ?? ''),
        orderInfo: String(body.orderInfo ?? ''),
        orderType: String(body.orderType ?? ''),
        partnerCode: String(body.partnerCode ?? ''),
        payType: String(body.payType ?? ''),
        requestId: String(body.requestId ?? ''),
        responseTime: String(body.responseTime ?? ''),
        resultCode: String(body.resultCode ?? ''),
        transId: String(body.transId ?? ''),
    };
    const rawSignature = Object.entries(fields)
        .map(([k, v]) => `${k}=${v}`)
        .join('&');
    const expected = (0, node_crypto_1.createHmac)('sha256', secretKey)
        .update(rawSignature, 'utf8')
        .digest('hex');
    if (expected.length !== incomingSignature.length)
        return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i += 1) {
        diff |= expected.charCodeAt(i) ^ incomingSignature.charCodeAt(i);
    }
    return diff === 0;
}
function verifyVnpaySignature(query, hashSecret) {
    if (!hashSecret)
        return false;
    const incomingHash = String(query.vnp_SecureHash ?? '').toLowerCase().trim();
    if (!incomingHash)
        return false;
    const filtered = {};
    for (const [k, v] of Object.entries(query)) {
        if (k === 'vnp_SecureHash' || k === 'vnp_SecureHashType')
            continue;
        if (v === null || v === undefined || v === '')
            continue;
        if (k.startsWith('vnp_'))
            filtered[k] = String(v);
    }
    const sortedKeys = Object.keys(filtered).sort();
    const rawData = sortedKeys
        .map((k) => `${k}=${encodeURIComponent(filtered[k]).replace(/%20/g, '+')}`)
        .join('&');
    const expected = (0, node_crypto_1.createHmac)('sha512', hashSecret)
        .update(rawData, 'utf8')
        .digest('hex')
        .toLowerCase();
    if (expected.length !== incomingHash.length)
        return false;
    let diff = 0;
    for (let i = 0; i < expected.length; i += 1) {
        diff |= expected.charCodeAt(i) ^ incomingHash.charCodeAt(i);
    }
    return diff === 0;
}
//# sourceMappingURL=payment-signature.util.js.map