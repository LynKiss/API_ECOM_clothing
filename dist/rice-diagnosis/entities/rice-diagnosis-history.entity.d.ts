export declare enum RiceDiagnosisRecommendationLevel {
    LOW = "low",
    REVIEW = "review",
    HIGH = "high"
}
export declare class RiceDiagnosisHistoryEntity {
    diagnosisId: string;
    userId: string | null;
    diseaseId: string | null;
    originalFileName: string | null;
    imageMimeType: string | null;
    imageSizeBytes: number | null;
    imageSha256: string | null;
    predictedLabel: string | null;
    predictedDiseaseKey: string | null;
    confidence: string;
    recommendationLevel: RiceDiagnosisRecommendationLevel;
    modelVersion: string | null;
    modelTask: string | null;
    topPredictions: Array<{
        label: string;
        normalizedKey: string;
        confidence: number;
    }> | null;
    rawResponse: Record<string, unknown> | null;
    createdAt: Date;
}
