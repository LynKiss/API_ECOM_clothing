export declare enum RiceDiseaseSeverity {
    LOW = "low",
    MEDIUM = "medium",
    HIGH = "high",
    CRITICAL = "critical"
}
export declare class RiceDiseaseEntity {
    diseaseId: string;
    diseaseKey: string;
    diseaseSlug: string;
    diseaseName: string;
    summary: string | null;
    symptoms: string | null;
    causes: string | null;
    treatmentGuidance: string | null;
    preventionGuidance: string | null;
    severity: RiceDiseaseSeverity;
    recommendedIngredients: string[] | null;
    searchKeywords: string[] | null;
    confidenceThreshold: string;
    coverImageUrl: string | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
