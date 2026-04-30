import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { ProductsService } from '../products/products.service';
import { ProductEntity } from '../products/entities/product.entity';
import type { IUser } from '../users/users.interface';
import { CreateRiceDiseaseDto } from './dto/create-rice-disease.dto';
import { QueryAdminRiceDiseasesDto } from './dto/query-admin-rice-diseases.dto';
import { UpdateRiceDiseaseDto } from './dto/update-rice-disease.dto';
import { RiceDiagnosisHistoryEntity, RiceDiagnosisRecommendationLevel } from './entities/rice-diagnosis-history.entity';
import { RiceDiseaseRecommendationEntity } from './entities/rice-disease-recommendation.entity';
import { RiceDiseaseEntity, RiceDiseaseSeverity } from './entities/rice-disease.entity';
type UploadedImageFile = {
    buffer: Buffer;
    mimetype: string;
    size: number;
    originalname: string;
};
export declare class RiceDiagnosisService {
    private readonly riceDiseasesRepository;
    private readonly riceDiseaseRecommendationsRepository;
    private readonly riceDiagnosisHistoryRepository;
    private readonly productsRepository;
    private readonly productsService;
    private readonly configService;
    constructor(riceDiseasesRepository: Repository<RiceDiseaseEntity>, riceDiseaseRecommendationsRepository: Repository<RiceDiseaseRecommendationEntity>, riceDiagnosisHistoryRepository: Repository<RiceDiagnosisHistoryEntity>, productsRepository: Repository<ProductEntity>, productsService: ProductsService, configService: ConfigService);
    predict(file: UploadedImageFile, currentUser?: IUser): Promise<{
        diagnosisId: `${string}-${string}-${string}-${string}-${string}`;
        savedToHistory: boolean;
        confidence: number;
        recommendationLevel: RiceDiagnosisRecommendationLevel;
        model: {
            version: string | null;
            task: string | null;
        };
        disease: {
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
            recommendedIngredients: string[];
            searchKeywords: string[];
            confidenceThreshold: number;
            coverImageUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        inferenceFlags: {
            lowConfidence: boolean;
            ambiguousPrediction: boolean;
            lowQuality: boolean;
            confidenceMargin: number | null;
            qualityIssues: string[];
        };
        topPredictions: {
            label: string;
            canonicalLabel: string;
            normalizedKey: string;
            confidence: number;
            diseaseId: string | null;
            diseaseName: string;
            diseaseSlug: string | null;
        }[];
        recommendedProducts: {
            productId: string;
            productName: string;
            productSlug: string;
            quantityAvailable: number;
            unit: string | null;
            isShow: boolean;
            basePrice: string;
            effectivePrice: string;
            primaryImageUrl: string | null;
            appliedDiscount: {
                id: string;
                code: string;
                name: string;
                type: import("../discounts/entities/discount.entity").DiscountType;
                value: string;
                appliesTo: import("../discounts/entities/discount.entity").DiscountApplyTarget;
            } | null;
            category: {
                categoryId: string;
                categoryName: string;
                categorySlug: string;
            } | null;
            origin: {
                originId: string;
                originName: string;
            } | null;
            ratingAverage: string;
            ratingCount: number;
        }[];
        advisory: {
            headline: string;
            disclaimer: string;
        };
    }>;
    listMyHistory(currentUser: IUser): Promise<{
        diagnosisId: string;
        confidence: number;
        recommendationLevel: RiceDiagnosisRecommendationLevel;
        predictedLabel: string | null;
        disease: {
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
            recommendedIngredients: string[];
            searchKeywords: string[];
            confidenceThreshold: number;
            coverImageUrl: string | null;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        } | null;
        model: {
            version: string | null;
            task: string | null;
        };
        createdAt: Date;
    }[]>;
    listPublicDiseases(): Promise<({
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
        recommendedIngredients: string[];
        searchKeywords: string[];
        confidenceThreshold: number;
        coverImageUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null)[]>;
    getPublicDiseaseBySlug(slug: string): Promise<{
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
        recommendedIngredients: string[];
        searchKeywords: string[];
        confidenceThreshold: number;
        coverImageUrl: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    getAdminServiceStatus(): Promise<{
        configured: boolean;
        reachable: boolean;
        baseUrl: string;
        statusCode: number;
        payload: Record<string, unknown>;
        error?: undefined;
    } | {
        configured: boolean;
        reachable: boolean;
        baseUrl: string;
        statusCode: null;
        payload: null;
        error: string;
    }>;
    listAdminProducts(search?: string, limit?: number): Promise<{
        productId: string;
        productName: string;
        productSlug: string;
        quantityAvailable: number;
        unit: string | null;
        isShow: boolean;
        basePrice: string;
        effectivePrice: string;
        primaryImageUrl: string | null;
        appliedDiscount: {
            id: string;
            code: string;
            name: string;
            type: import("../discounts/entities/discount.entity").DiscountType;
            value: string;
            appliesTo: import("../discounts/entities/discount.entity").DiscountApplyTarget;
        } | null;
        category: {
            categoryId: string;
            categoryName: string;
            categorySlug: string;
        } | null;
        origin: {
            originId: string;
            originName: string;
        } | null;
        ratingAverage: string;
        ratingCount: number;
    }[]>;
    listAdminDiseases(query: QueryAdminRiceDiseasesDto): Promise<{
        meta: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
        items: {
            mappedProductCount: number;
            diseaseId?: string | undefined;
            diseaseKey?: string | undefined;
            diseaseSlug?: string | undefined;
            diseaseName?: string | undefined;
            summary?: string | null | undefined;
            symptoms?: string | null | undefined;
            causes?: string | null | undefined;
            treatmentGuidance?: string | null | undefined;
            preventionGuidance?: string | null | undefined;
            severity?: RiceDiseaseSeverity | undefined;
            recommendedIngredients?: string[] | undefined;
            searchKeywords?: string[] | undefined;
            confidenceThreshold?: number | undefined;
            coverImageUrl?: string | null | undefined;
            isActive?: boolean | undefined;
            createdAt?: Date | undefined;
            updatedAt?: Date | undefined;
        }[];
    }>;
    getAdminDisease(diseaseId: string): Promise<{
        mappedProductCount: number;
        recommendedProducts: {
            recommendationId: string;
            productId: string;
            note: string | null;
            rationale: string | null;
            isPrimary: boolean;
            sortOrder: number;
            product: {
                productId: string;
                productName: string;
                productSlug: string;
                quantityAvailable: number;
                unit: string | null;
                isShow: boolean;
                basePrice: string;
                effectivePrice: string;
                primaryImageUrl: string | null;
                appliedDiscount: {
                    id: string;
                    code: string;
                    name: string;
                    type: import("../discounts/entities/discount.entity").DiscountType;
                    value: string;
                    appliesTo: import("../discounts/entities/discount.entity").DiscountApplyTarget;
                } | null;
                category: {
                    categoryId: string;
                    categoryName: string;
                    categorySlug: string;
                } | null;
                origin: {
                    originId: string;
                    originName: string;
                } | null;
                ratingAverage: string;
                ratingCount: number;
            } | null;
        }[];
        diseaseId?: string | undefined;
        diseaseKey?: string | undefined;
        diseaseSlug?: string | undefined;
        diseaseName?: string | undefined;
        summary?: string | null | undefined;
        symptoms?: string | null | undefined;
        causes?: string | null | undefined;
        treatmentGuidance?: string | null | undefined;
        preventionGuidance?: string | null | undefined;
        severity?: RiceDiseaseSeverity | undefined;
        recommendedIngredients?: string[] | undefined;
        searchKeywords?: string[] | undefined;
        confidenceThreshold?: number | undefined;
        coverImageUrl?: string | null | undefined;
        isActive?: boolean | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    createDisease(createRiceDiseaseDto: CreateRiceDiseaseDto): Promise<{
        mappedProductCount: number;
        recommendedProducts: {
            recommendationId: string;
            productId: string;
            note: string | null;
            rationale: string | null;
            isPrimary: boolean;
            sortOrder: number;
            product: {
                productId: string;
                productName: string;
                productSlug: string;
                quantityAvailable: number;
                unit: string | null;
                isShow: boolean;
                basePrice: string;
                effectivePrice: string;
                primaryImageUrl: string | null;
                appliedDiscount: {
                    id: string;
                    code: string;
                    name: string;
                    type: import("../discounts/entities/discount.entity").DiscountType;
                    value: string;
                    appliesTo: import("../discounts/entities/discount.entity").DiscountApplyTarget;
                } | null;
                category: {
                    categoryId: string;
                    categoryName: string;
                    categorySlug: string;
                } | null;
                origin: {
                    originId: string;
                    originName: string;
                } | null;
                ratingAverage: string;
                ratingCount: number;
            } | null;
        }[];
        diseaseId?: string | undefined;
        diseaseKey?: string | undefined;
        diseaseSlug?: string | undefined;
        diseaseName?: string | undefined;
        summary?: string | null | undefined;
        symptoms?: string | null | undefined;
        causes?: string | null | undefined;
        treatmentGuidance?: string | null | undefined;
        preventionGuidance?: string | null | undefined;
        severity?: RiceDiseaseSeverity | undefined;
        recommendedIngredients?: string[] | undefined;
        searchKeywords?: string[] | undefined;
        confidenceThreshold?: number | undefined;
        coverImageUrl?: string | null | undefined;
        isActive?: boolean | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    updateDisease(diseaseId: string, updateRiceDiseaseDto: UpdateRiceDiseaseDto): Promise<{
        mappedProductCount: number;
        recommendedProducts: {
            recommendationId: string;
            productId: string;
            note: string | null;
            rationale: string | null;
            isPrimary: boolean;
            sortOrder: number;
            product: {
                productId: string;
                productName: string;
                productSlug: string;
                quantityAvailable: number;
                unit: string | null;
                isShow: boolean;
                basePrice: string;
                effectivePrice: string;
                primaryImageUrl: string | null;
                appliedDiscount: {
                    id: string;
                    code: string;
                    name: string;
                    type: import("../discounts/entities/discount.entity").DiscountType;
                    value: string;
                    appliesTo: import("../discounts/entities/discount.entity").DiscountApplyTarget;
                } | null;
                category: {
                    categoryId: string;
                    categoryName: string;
                    categorySlug: string;
                } | null;
                origin: {
                    originId: string;
                    originName: string;
                } | null;
                ratingAverage: string;
                ratingCount: number;
            } | null;
        }[];
        diseaseId?: string | undefined;
        diseaseKey?: string | undefined;
        diseaseSlug?: string | undefined;
        diseaseName?: string | undefined;
        summary?: string | null | undefined;
        symptoms?: string | null | undefined;
        causes?: string | null | undefined;
        treatmentGuidance?: string | null | undefined;
        preventionGuidance?: string | null | undefined;
        severity?: RiceDiseaseSeverity | undefined;
        recommendedIngredients?: string[] | undefined;
        searchKeywords?: string[] | undefined;
        confidenceThreshold?: number | undefined;
        coverImageUrl?: string | null | undefined;
        isActive?: boolean | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    toggleDiseaseActive(diseaseId: string): Promise<{
        mappedProductCount: number;
        recommendedProducts: {
            recommendationId: string;
            productId: string;
            note: string | null;
            rationale: string | null;
            isPrimary: boolean;
            sortOrder: number;
            product: {
                productId: string;
                productName: string;
                productSlug: string;
                quantityAvailable: number;
                unit: string | null;
                isShow: boolean;
                basePrice: string;
                effectivePrice: string;
                primaryImageUrl: string | null;
                appliedDiscount: {
                    id: string;
                    code: string;
                    name: string;
                    type: import("../discounts/entities/discount.entity").DiscountType;
                    value: string;
                    appliesTo: import("../discounts/entities/discount.entity").DiscountApplyTarget;
                } | null;
                category: {
                    categoryId: string;
                    categoryName: string;
                    categorySlug: string;
                } | null;
                origin: {
                    originId: string;
                    originName: string;
                } | null;
                ratingAverage: string;
                ratingCount: number;
            } | null;
        }[];
        diseaseId?: string | undefined;
        diseaseKey?: string | undefined;
        diseaseSlug?: string | undefined;
        diseaseName?: string | undefined;
        summary?: string | null | undefined;
        symptoms?: string | null | undefined;
        causes?: string | null | undefined;
        treatmentGuidance?: string | null | undefined;
        preventionGuidance?: string | null | undefined;
        severity?: RiceDiseaseSeverity | undefined;
        recommendedIngredients?: string[] | undefined;
        searchKeywords?: string[] | undefined;
        confidenceThreshold?: number | undefined;
        coverImageUrl?: string | null | undefined;
        isActive?: boolean | undefined;
        createdAt?: Date | undefined;
        updatedAt?: Date | undefined;
    }>;
    private validateImage;
    private requestInference;
    private normalizeInferencePayload;
    private resolveRecommendationLevel;
    private buildAdvisory;
    private matchDisease;
    private buildKeywordHints;
    private loadRecommendationCounts;
    private normalizeDiseasePayload;
    private ensureUniqueDisease;
    private ensureRecommendedProductsExist;
    private replaceRecommendations;
    private getServiceBaseUrl;
    private getServiceTimeoutMs;
    private getServiceHeaders;
    private normalizeModelLabel;
    private normalizeSlug;
    private normalizeTextArray;
    private optionalText;
    private humanizePredictionLabel;
    private readString;
    private readNumber;
    private mapDisease;
}
export {};
