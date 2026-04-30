export declare enum OrderTrackingMode {
    DEMO = "demo",
    LIVE = "live",
    AUTO_FALLBACK = "auto_fallback"
}
export declare class OrderTrackingEntity {
    trackingId: string;
    orderId: string;
    mode: OrderTrackingMode;
    manualLatitude: string | null;
    manualLongitude: string | null;
    manualNote: string | null;
    manualUpdatedBy: string | null;
    manualUpdatedAt: Date | null;
    gpsLatitude: string | null;
    gpsLongitude: string | null;
    gpsHeading: string | null;
    gpsSpeedKph: string | null;
    gpsProvider: string | null;
    gpsUpdatedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
}
