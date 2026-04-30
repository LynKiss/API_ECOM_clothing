import { RiceDiseaseEntity } from './rice-disease.entity';
export declare class RiceDiseaseRecommendationEntity {
    riceDiseaseRecommendationId: string;
    diseaseId: string;
    productId: string;
    note: string | null;
    rationale: string | null;
    isPrimary: boolean;
    sortOrder: number;
    createdAt: Date;
    disease?: RiceDiseaseEntity;
}
