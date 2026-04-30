import { RiceDiseaseSeverity } from '../entities/rice-disease.entity';
import { RecommendedProductInputDto } from './recommended-product-input.dto';
export declare class CreateRiceDiseaseDto {
    diseaseKey: string;
    diseaseName: string;
    diseaseSlug?: string;
    summary?: string;
    symptoms?: string;
    causes?: string;
    treatmentGuidance?: string;
    preventionGuidance?: string;
    severity?: RiceDiseaseSeverity;
    recommendedIngredients?: string[];
    searchKeywords?: string[];
    confidenceThreshold?: number;
    coverImageUrl?: string;
    isActive?: boolean;
    recommendedProducts?: RecommendedProductInputDto[];
}
