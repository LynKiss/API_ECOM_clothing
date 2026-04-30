"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCsv = toCsv;
exports.csvResponseHeaders = csvResponseHeaders;
function toCsv(rows, columns) {
    if (!rows.length && !columns?.length)
        return '﻿';
    const cols = columns ??
        Object.keys(rows[0] ?? {}).map((k) => ({ key: k, header: k }));
    const headerLine = cols.map((c) => escapeCsvField(c.header)).join(',');
    const dataLines = rows.map((row) => cols
        .map((c) => {
        const raw = c.get ? c.get(row) : row[c.key];
        return escapeCsvField(formatValue(raw));
    })
        .join(','));
    return '﻿' + [headerLine, ...dataLines].join('\r\n');
}
function formatValue(v) {
    if (v === null || v === undefined)
        return '';
    if (v instanceof Date)
        return v.toISOString();
    if (typeof v === 'object')
        return JSON.stringify(v);
    return String(v);
}
function escapeCsvField(value) {
    if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
function csvResponseHeaders(filename) {
    const safeName = filename.replace(/[^a-z0-9._-]+/gi, '_');
    return {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeName}"`,
    };
}
//# sourceMappingURL=csv-export.util.js.map