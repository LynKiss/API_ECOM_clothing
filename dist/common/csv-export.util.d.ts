export interface CsvColumn<T> {
    key: keyof T | string;
    header: string;
    get?: (row: T) => string | number | null | undefined;
}
export declare function toCsv<T extends Record<string, any>>(rows: T[], columns?: CsvColumn<T>[]): string;
export declare function csvResponseHeaders(filename: string): Record<string, string>;
