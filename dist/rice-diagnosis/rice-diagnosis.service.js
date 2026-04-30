"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiceDiagnosisService = void 0;
const node_crypto_1 = require("node:crypto");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const products_service_1 = require("../products/products.service");
const product_entity_1 = require("../products/entities/product.entity");
const rice_diagnosis_history_entity_1 = require("./entities/rice-diagnosis-history.entity");
const rice_disease_recommendation_entity_1 = require("./entities/rice-disease-recommendation.entity");
const rice_disease_entity_1 = require("./entities/rice-disease.entity");
let RiceDiagnosisService = class RiceDiagnosisService {
    riceDiseasesRepository;
    riceDiseaseRecommendationsRepository;
    riceDiagnosisHistoryRepository;
    productsRepository;
    productsService;
    configService;
    constructor(riceDiseasesRepository, riceDiseaseRecommendationsRepository, riceDiagnosisHistoryRepository, productsRepository, productsService, configService) {
        this.riceDiseasesRepository = riceDiseasesRepository;
        this.riceDiseaseRecommendationsRepository = riceDiseaseRecommendationsRepository;
        this.riceDiagnosisHistoryRepository = riceDiagnosisHistoryRepository;
        this.productsRepository = productsRepository;
        this.productsService = productsService;
        this.configService = configService;
    }
    async predict(file, currentUser) {
        this.validateImage(file);
        const inference = await this.requestInference(file);
        const diseases = await this.riceDiseasesRepository.find({
            where: { isActive: true },
            order: { diseaseName: 'ASC' },
        });
        const disease = this.matchDisease(diseases, inference.predictedKey, inference.predictedLabel);
        const recommendationLevel = this.resolveRecommendationLevel(disease, inference.confidence, inference);
        const topPredictions = inference.topPredictions.map((prediction) => {
            const matchedDisease = this.matchDisease(diseases, prediction.normalizedKey, prediction.label);
            return {
                label: prediction.label,
                canonicalLabel: prediction.canonicalLabel,
                normalizedKey: prediction.normalizedKey,
                confidence: prediction.confidence,
                diseaseId: matchedDisease?.diseaseId ?? null,
                diseaseName: matchedDisease?.diseaseName ??
                    this.humanizePredictionLabel(prediction.canonicalLabel),
                diseaseSlug: matchedDisease?.diseaseSlug ?? null,
            };
        });
        const explicitRecommendations = disease
            ? await this.riceDiseaseRecommendationsRepository.find({
                where: { diseaseId: disease.diseaseId },
                order: {
                    isPrimary: 'DESC',
                    sortOrder: 'ASC',
                    riceDiseaseRecommendationId: 'ASC',
                },
            })
            : [];
        const recommendedProducts = disease && recommendationLevel !== rice_diagnosis_history_entity_1.RiceDiagnosisRecommendationLevel.LOW
            ? await this.productsService.getRecommendationCards({
                productIds: explicitRecommendations.map((item) => item.productId),
                keywordHints: this.buildKeywordHints(disease),
                limit: 4,
            })
            : [];
        const diagnosisId = (0, node_crypto_1.randomUUID)();
        await this.riceDiagnosisHistoryRepository.save(this.riceDiagnosisHistoryRepository.create({
            diagnosisId,
            userId: currentUser?._id ?? null,
            diseaseId: disease?.diseaseId ?? null,
            originalFileName: file.originalname ?? null,
            imageMimeType: file.mimetype ?? null,
            imageSizeBytes: file.size ?? null,
            imageSha256: (0, node_crypto_1.createHash)('sha256').update(file.buffer).digest('hex'),
            predictedLabel: inference.predictedLabel,
            predictedDiseaseKey: inference.predictedKey,
            confidence: inference.confidence.toFixed(5),
            recommendationLevel,
            modelVersion: inference.modelVersion,
            modelTask: inference.modelTask,
            topPredictions: inference.topPredictions,
            rawResponse: inference.rawResponse,
        }));
        return {
            diagnosisId,
            savedToHistory: true,
            confidence: inference.confidence,
            recommendationLevel,
            model: {
                version: inference.modelVersion,
                task: inference.modelTask,
            },
            disease: disease ? this.mapDisease(disease) : null,
            inferenceFlags: {
                lowConfidence: inference.lowConfidence,
                ambiguousPrediction: inference.ambiguousPrediction,
                lowQuality: inference.lowQuality,
                confidenceMargin: inference.confidenceMargin,
                qualityIssues: inference.qualityIssues,
            },
            topPredictions,
            recommendedProducts,
            advisory: this.buildAdvisory(disease, recommendationLevel, inference),
        };
    }
    async listMyHistory(currentUser) {
        const items = await this.riceDiagnosisHistoryRepository.find({
            where: { userId: currentUser._id },
            order: { createdAt: 'DESC' },
            take: 20,
        });
        const diseaseIds = items
            .map((item) => item.diseaseId)
            .filter((value) => !!value);
        const diseases = diseaseIds.length
            ? await this.riceDiseasesRepository.find({
                where: { diseaseId: (0, typeorm_2.In)(diseaseIds) },
            })
            : [];
        const diseaseMap = new Map(diseases.map((disease) => [disease.diseaseId, disease]));
        return items.map((item) => ({
            diagnosisId: item.diagnosisId,
            confidence: Number(item.confidence),
            recommendationLevel: item.recommendationLevel,
            predictedLabel: item.predictedLabel,
            disease: item.diseaseId ? this.mapDisease(diseaseMap.get(item.diseaseId) ?? null) : null,
            model: {
                version: item.modelVersion,
                task: item.modelTask,
            },
            createdAt: item.createdAt,
        }));
    }
    async listPublicDiseases() {
        const diseases = await this.riceDiseasesRepository.find({
            where: { isActive: true },
            order: { diseaseName: 'ASC' },
        });
        return diseases.map((disease) => this.mapDisease(disease));
    }
    async getPublicDiseaseBySlug(slug) {
        const disease = await this.riceDiseasesRepository.findOneBy({
            diseaseSlug: slug,
            isActive: true,
        });
        if (!disease) {
            throw new common_1.NotFoundException('Rice disease not found');
        }
        return this.mapDisease(disease);
    }
    async getAdminServiceStatus() {
        const baseUrl = this.getServiceBaseUrl();
        const headers = this.getServiceHeaders();
        try {
            const response = await fetch(`${baseUrl}/health`, {
                method: 'GET',
                headers,
                signal: AbortSignal.timeout(this.getServiceTimeoutMs()),
            });
            const payload = (await response.json());
            return {
                configured: true,
                reachable: response.ok,
                baseUrl,
                statusCode: response.status,
                payload,
            };
        }
        catch (error) {
            return {
                configured: true,
                reachable: false,
                baseUrl,
                statusCode: null,
                payload: null,
                error: error instanceof Error ? error.message : 'Unknown error',
            };
        }
    }
    async listAdminProducts(search, limit = 24) {
        return this.productsService.getAdminProductOptions(search, limit);
    }
    async listAdminDiseases(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 12;
        const queryBuilder = this.riceDiseasesRepository.createQueryBuilder('disease');
        if (query.search?.trim()) {
            queryBuilder.andWhere('(disease.disease_name LIKE :search OR disease.disease_key LIKE :search OR disease.disease_slug LIKE :search)', { search: `%${query.search.trim()}%` });
        }
        if (query.isActive !== undefined) {
            queryBuilder.andWhere('disease.is_active = :isActive', {
                isActive: query.isActive,
            });
        }
        queryBuilder
            .orderBy('disease.updated_at', 'DESC')
            .addOrderBy('disease.created_at', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [items, total] = await queryBuilder.getManyAndCount();
        const recommendationCounts = await this.loadRecommendationCounts(items.map((item) => item.diseaseId));
        return {
            meta: {
                page,
                limit,
                total,
                totalPages: Math.max(1, Math.ceil(total / limit)),
            },
            items: items.map((item) => ({
                ...this.mapDisease(item),
                mappedProductCount: recommendationCounts.get(item.diseaseId) ?? 0,
            })),
        };
    }
    async getAdminDisease(diseaseId) {
        const disease = await this.riceDiseasesRepository.findOneBy({ diseaseId });
        if (!disease) {
            throw new common_1.NotFoundException('Rice disease not found');
        }
        const recommendations = await this.riceDiseaseRecommendationsRepository.find({
            where: { diseaseId },
            order: {
                isPrimary: 'DESC',
                sortOrder: 'ASC',
                riceDiseaseRecommendationId: 'ASC',
            },
        });
        const products = await this.productsService.getRecommendationCards({
            productIds: recommendations.map((item) => item.productId),
            keywordHints: [],
            limit: Math.max(1, recommendations.length),
        });
        const productMap = new Map(products.map((product) => [product.productId, product]));
        return {
            ...this.mapDisease(disease),
            mappedProductCount: recommendations.length,
            recommendedProducts: recommendations.map((item) => ({
                recommendationId: item.riceDiseaseRecommendationId,
                productId: item.productId,
                note: item.note,
                rationale: item.rationale,
                isPrimary: item.isPrimary,
                sortOrder: item.sortOrder,
                product: productMap.get(item.productId) ?? null,
            })),
        };
    }
    async createDisease(createRiceDiseaseDto) {
        const payload = this.normalizeDiseasePayload(createRiceDiseaseDto);
        await this.ensureUniqueDisease(payload);
        await this.ensureRecommendedProductsExist(payload.recommendedProducts);
        const disease = await this.riceDiseasesRepository.save(this.riceDiseasesRepository.create({
            diseaseKey: payload.diseaseKey,
            diseaseSlug: payload.diseaseSlug,
            diseaseName: payload.diseaseName,
            summary: payload.summary,
            symptoms: payload.symptoms,
            causes: payload.causes,
            treatmentGuidance: payload.treatmentGuidance,
            preventionGuidance: payload.preventionGuidance,
            severity: payload.severity,
            recommendedIngredients: payload.recommendedIngredients,
            searchKeywords: payload.searchKeywords,
            confidenceThreshold: payload.confidenceThreshold.toFixed(4),
            coverImageUrl: payload.coverImageUrl,
            isActive: payload.isActive,
        }));
        await this.replaceRecommendations(disease.diseaseId, payload.recommendedProducts ?? []);
        return this.getAdminDisease(disease.diseaseId);
    }
    async updateDisease(diseaseId, updateRiceDiseaseDto) {
        const disease = await this.riceDiseasesRepository.findOneBy({ diseaseId });
        if (!disease) {
            throw new common_1.NotFoundException('Rice disease not found');
        }
        const payload = this.normalizeDiseasePayload(updateRiceDiseaseDto, disease);
        await this.ensureUniqueDisease(payload, diseaseId);
        if (payload.recommendedProducts !== undefined) {
            await this.ensureRecommendedProductsExist(payload.recommendedProducts);
        }
        disease.diseaseKey = payload.diseaseKey;
        disease.diseaseSlug = payload.diseaseSlug;
        disease.diseaseName = payload.diseaseName;
        disease.summary = payload.summary;
        disease.symptoms = payload.symptoms;
        disease.causes = payload.causes;
        disease.treatmentGuidance = payload.treatmentGuidance;
        disease.preventionGuidance = payload.preventionGuidance;
        disease.severity = payload.severity;
        disease.recommendedIngredients = payload.recommendedIngredients;
        disease.searchKeywords = payload.searchKeywords;
        disease.confidenceThreshold = payload.confidenceThreshold.toFixed(4);
        disease.coverImageUrl = payload.coverImageUrl;
        disease.isActive = payload.isActive;
        await this.riceDiseasesRepository.save(disease);
        if (payload.recommendedProducts !== undefined) {
            await this.replaceRecommendations(diseaseId, payload.recommendedProducts);
        }
        return this.getAdminDisease(diseaseId);
    }
    async toggleDiseaseActive(diseaseId) {
        const disease = await this.riceDiseasesRepository.findOneBy({ diseaseId });
        if (!disease) {
            throw new common_1.NotFoundException('Rice disease not found');
        }
        disease.isActive = !disease.isActive;
        await this.riceDiseasesRepository.save(disease);
        return this.getAdminDisease(diseaseId);
    }
    validateImage(file) {
        if (!file?.buffer?.length) {
            throw new common_1.BadRequestException('Image file is required');
        }
        if (!file.mimetype?.startsWith('image/')) {
            throw new common_1.BadRequestException('Only image files are supported');
        }
        if (file.size > 8 * 1024 * 1024) {
            throw new common_1.BadRequestException('Image size must not exceed 8MB');
        }
    }
    async requestInference(file) {
        const formData = new FormData();
        const binary = Uint8Array.from(file.buffer);
        const blob = new Blob([binary.buffer], { type: file.mimetype });
        formData.append('file', blob, file.originalname || 'rice-leaf.jpg');
        let response;
        try {
            response = await fetch(`${this.getServiceBaseUrl()}/infer/rice-disease`, {
                method: 'POST',
                headers: this.getServiceHeaders(),
                body: formData,
                signal: AbortSignal.timeout(this.getServiceTimeoutMs()),
            });
        }
        catch (error) {
            throw new common_1.ServiceUnavailableException(`AI inference service is unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        let payload;
        try {
            payload = await response.json();
        }
        catch {
            throw new common_1.InternalServerErrorException('AI inference service returned an invalid JSON response');
        }
        if (!response.ok) {
            const message = typeof payload === 'object' &&
                payload &&
                'message' in payload &&
                typeof payload.message === 'string'
                ? payload.message
                : `AI inference request failed with ${response.status}`;
            throw new common_1.ServiceUnavailableException(message);
        }
        return this.normalizeInferencePayload(payload);
    }
    normalizeInferencePayload(payload) {
        if (!payload || typeof payload !== 'object') {
            throw new common_1.InternalServerErrorException('AI inference response payload is invalid');
        }
        const source = payload;
        const predictedLabel = this.readString(source.canonical_predicted_class) ??
            this.readString(source.predicted_class) ??
            this.readString(source.class_name) ??
            this.readString(source.label) ??
            this.readString(source.prediction);
        const rawPredictedLabel = this.readString(source.raw_predicted_class) ??
            this.readString(source.canonical_raw_predicted_class) ??
            predictedLabel;
        const confidence = this.readNumber(source.confidence);
        const confidenceMargin = this.readNumber(source.confidence_margin);
        const lowConfidence = Boolean(source.low_confidence);
        const ambiguousPrediction = Boolean(source.ambiguous_prediction);
        const lowQuality = Boolean(source.low_quality);
        const qualityIssues = Array.isArray(source.quality_issues)
            ? source.quality_issues.filter((item) => typeof item === 'string' && item.trim().length > 0)
            : [];
        if (!predictedLabel || confidence === null) {
            throw new common_1.InternalServerErrorException('AI inference response is missing required prediction fields');
        }
        const rawPredictions = Array.isArray(source.top_predictions)
            ? source.top_predictions
            : Array.isArray(source.predictions)
                ? source.predictions
                : [];
        const topPredictions = rawPredictions
            .map((item) => {
            if (!item || typeof item !== 'object') {
                return null;
            }
            const label = this.readString(item.label) ??
                this.readString(item.canonical_label) ??
                this.readString(item.class_name) ??
                this.readString(item.predicted_class);
            const itemConfidence = this.readNumber(item.confidence);
            if (!label || itemConfidence === null) {
                return null;
            }
            const canonicalLabel = this.readString(item.canonical_label) ?? label;
            return {
                label,
                canonicalLabel,
                normalizedKey: this.normalizeModelLabel(canonicalLabel),
                confidence: itemConfidence,
            };
        })
            .filter((item) => !!item);
        if (topPredictions.length === 0) {
            topPredictions.push({
                label: predictedLabel,
                canonicalLabel: predictedLabel,
                normalizedKey: this.normalizeModelLabel(predictedLabel),
                confidence,
            });
        }
        return {
            predictedLabel,
            rawPredictedLabel: rawPredictedLabel ?? predictedLabel,
            predictedKey: this.normalizeModelLabel(predictedLabel),
            confidence,
            confidenceMargin,
            lowConfidence,
            ambiguousPrediction,
            lowQuality,
            qualityIssues,
            topPredictions,
            modelVersion: this.readString(source.model_version) ?? 'yolov9c-cls.pt',
            modelTask: this.readString(source.model_task) ?? 'classification',
            rawResponse: source,
        };
    }
    resolveRecommendationLevel(disease, confidence, inference) {
        const reviewThreshold = Number(this.configService.get('RICE_AI_MIN_CONFIDENCE') ?? '0.75');
        const strongThreshold = disease
            ? Number(disease.confidenceThreshold)
            : Number(this.configService.get('RICE_AI_HIGH_CONFIDENCE') ?? '0.9');
        if (inference.lowConfidence || confidence < reviewThreshold) {
            return rice_diagnosis_history_entity_1.RiceDiagnosisRecommendationLevel.LOW;
        }
        if (inference.lowQuality || inference.ambiguousPrediction) {
            return rice_diagnosis_history_entity_1.RiceDiagnosisRecommendationLevel.LOW;
        }
        if (confidence < strongThreshold) {
            return rice_diagnosis_history_entity_1.RiceDiagnosisRecommendationLevel.REVIEW;
        }
        return rice_diagnosis_history_entity_1.RiceDiagnosisRecommendationLevel.HIGH;
    }
    buildAdvisory(disease, recommendationLevel, inference) {
        if (inference.lowQuality) {
            const issues = inference.qualityIssues.length
                ? ` Van de phat hien: ${inference.qualityIssues.join(', ')}.`
                : '';
            return {
                headline: 'Anh tai len chua dat chat luong de dua ra chan doan on dinh.',
                disclaimer: `Hay chup lai la lua ro hon, du sang, can hon vung ton thuong va tranh rung tay.${issues}`,
            };
        }
        if (inference.ambiguousPrediction) {
            return {
                headline: 'AI dang phan van giua nhieu nhan benh gan nhau, nen chua nen de xuat xu ly tu dong.',
                disclaimer: 'Hay doi chieu them top du doan, chup them 1-2 anh khac, hoac nhan vien ky thuat xem lai truoc khi mua thuoc.',
            };
        }
        if (!disease) {
            return {
                headline: 'AI da nhan dang du lieu, nhung chua doi chieu duoc voi danh muc benh noi bo.',
                disclaimer: 'Ket qua nay chi nen duoc xem la tham khao. Hay lien he nhan vien de xac minh truoc khi mua thuoc.',
            };
        }
        if (disease.diseaseKey === 'healthy_rice_leaf') {
            return {
                headline: 'La lua hien tai co dau hieu khoe manh hoac chua thay bieu hien benh ro rang.',
                disclaimer: 'Tiep tuc theo doi ruong, duy tri canh tac can bang va chup lai neu trieu chung thay doi.',
            };
        }
        if (recommendationLevel === rice_diagnosis_history_entity_1.RiceDiagnosisRecommendationLevel.LOW) {
            return {
                headline: 'Do tin cay hien con thap. He thong khong de xuat mua thuoc tu dong.',
                disclaimer: 'Hay chup canh la ro hon, anh du sang hon, hoac mo chat widget chat voi nhan vien ky thuat.',
            };
        }
        if (recommendationLevel === rice_diagnosis_history_entity_1.RiceDiagnosisRecommendationLevel.REVIEW) {
            return {
                headline: 'He thong da nhan dang duoc benh nghiem trong muc tham khao, nen doi chieu them truoc khi xu ly dien rong.',
                disclaimer: 'Nen kiem tra them top du doan ben duoi va doc huong dan phong tri truoc khi mua thuoc.',
            };
        }
        return {
            headline: 'Ket qua AI dat nguong tin cay cao, he thong co the dua ra phac do tham khao va san pham de nghi.',
            disclaimer: 'Van can su dung theo nhan mac, lieu luong va khuyen cao an toan thuc vat truoc khi phun.',
        };
    }
    matchDisease(diseases, predictedKey, predictedLabel) {
        const normalizedPredictedKey = this.normalizeModelLabel(predictedKey);
        const normalizedPredictedLabel = this.normalizeModelLabel(predictedLabel);
        return (diseases.find((item) => item.diseaseKey === normalizedPredictedKey) ??
            diseases.find((item) => item.diseaseSlug === normalizedPredictedLabel) ??
            diseases.find((item) => this.normalizeModelLabel(item.diseaseName) === normalizedPredictedKey ||
                this.normalizeModelLabel(item.diseaseName) === normalizedPredictedLabel) ??
            null);
    }
    buildKeywordHints(disease) {
        return [
            disease.diseaseName,
            ...(disease.searchKeywords ?? []),
            ...(disease.recommendedIngredients ?? []),
        ]
            .map((item) => item.trim())
            .filter(Boolean)
            .slice(0, 8);
    }
    async loadRecommendationCounts(diseaseIds) {
        const counts = new Map();
        if (diseaseIds.length === 0) {
            return counts;
        }
        const items = await this.riceDiseaseRecommendationsRepository.find({
            where: { diseaseId: (0, typeorm_2.In)(diseaseIds) },
        });
        for (const item of items) {
            counts.set(item.diseaseId, (counts.get(item.diseaseId) ?? 0) + 1);
        }
        return counts;
    }
    normalizeDiseasePayload(payload, current) {
        const diseaseName = (payload.diseaseName ?? current?.diseaseName ?? '').trim();
        const diseaseKey = this.normalizeModelLabel(payload.diseaseKey ?? current?.diseaseKey ?? diseaseName);
        const diseaseSlug = this.normalizeSlug(payload.diseaseSlug ?? current?.diseaseSlug ?? diseaseName);
        if (!diseaseName || !diseaseKey || !diseaseSlug) {
            throw new common_1.BadRequestException('Disease name, key and slug are required');
        }
        return {
            diseaseKey,
            diseaseSlug,
            diseaseName,
            summary: this.optionalText(payload.summary, current?.summary ?? null),
            symptoms: this.optionalText(payload.symptoms, current?.symptoms ?? null),
            causes: this.optionalText(payload.causes, current?.causes ?? null),
            treatmentGuidance: this.optionalText(payload.treatmentGuidance, current?.treatmentGuidance ?? null),
            preventionGuidance: this.optionalText(payload.preventionGuidance, current?.preventionGuidance ?? null),
            severity: payload.severity ?? current?.severity ?? rice_disease_entity_1.RiceDiseaseSeverity.MEDIUM,
            recommendedIngredients: this.normalizeTextArray(payload.recommendedIngredients ?? current?.recommendedIngredients ?? []),
            searchKeywords: this.normalizeTextArray(payload.searchKeywords ?? current?.searchKeywords ?? []),
            confidenceThreshold: payload.confidenceThreshold ??
                Number(current?.confidenceThreshold ?? '0.9000'),
            coverImageUrl: this.optionalText(payload.coverImageUrl, current?.coverImageUrl ?? null),
            isActive: payload.isActive ?? current?.isActive ?? true,
            recommendedProducts: payload.recommendedProducts?.map((item, index) => ({
                productId: item.productId,
                note: this.optionalText(item.note, null),
                rationale: this.optionalText(item.rationale, null),
                isPrimary: item.isPrimary ?? index === 0,
                sortOrder: item.sortOrder ?? index,
            })),
        };
    }
    async ensureUniqueDisease(payload, excludeDiseaseId) {
        const existingByKey = await this.riceDiseasesRepository.findOneBy({
            diseaseKey: payload.diseaseKey,
        });
        if (existingByKey && existingByKey.diseaseId !== excludeDiseaseId) {
            throw new common_1.BadRequestException('Disease key already exists');
        }
        const existingBySlug = await this.riceDiseasesRepository.findOneBy({
            diseaseSlug: payload.diseaseSlug,
        });
        if (existingBySlug && existingBySlug.diseaseId !== excludeDiseaseId) {
            throw new common_1.BadRequestException('Disease slug already exists');
        }
    }
    async ensureRecommendedProductsExist(products) {
        if (!products?.length) {
            return;
        }
        const uniqueIds = [...new Set(products.map((item) => item.productId))];
        const existing = await this.productsRepository.find({
            where: { productId: (0, typeorm_2.In)(uniqueIds) },
            select: {
                productId: true,
            },
        });
        if (existing.length !== uniqueIds.length) {
            throw new common_1.BadRequestException('One or more recommended products were not found');
        }
    }
    async replaceRecommendations(diseaseId, items) {
        await this.riceDiseaseRecommendationsRepository.delete({ diseaseId });
        if (items.length === 0) {
            return;
        }
        const normalizedItems = items.map((item, index) => this.riceDiseaseRecommendationsRepository.create({
            diseaseId,
            productId: item.productId,
            note: item.note,
            rationale: item.rationale,
            isPrimary: index === 0 ? true : item.isPrimary,
            sortOrder: item.sortOrder ?? index,
        }));
        await this.riceDiseaseRecommendationsRepository.save(normalizedItems);
    }
    getServiceBaseUrl() {
        return (this.configService
            .get('RICE_AI_SERVICE_URL')
            ?.replace(/\/+$/, '') ?? 'http://127.0.0.1:5001');
    }
    getServiceTimeoutMs() {
        return Number(this.configService.get('RICE_AI_TIMEOUT_MS') ?? '20000');
    }
    getServiceHeaders() {
        const token = this.configService.get('RICE_AI_SERVICE_TOKEN');
        return token ? { 'x-api-key': token } : {};
    }
    normalizeModelLabel(value) {
        const normalized = value
            .normalize('NFKD')
            .replace(/[^\w\s-]/g, '')
            .trim()
            .toLowerCase()
            .replace(/[\s-]+/g, '_');
        const aliases = {
            blast: 'leaf_blast',
            hispa: 'rice_hispa',
            normal: 'healthy_rice_leaf',
            healthy: 'healthy_rice_leaf',
        };
        return aliases[normalized] ?? normalized;
    }
    normalizeSlug(value) {
        return value
            .normalize('NFKD')
            .replace(/[^\w\s-]/g, '')
            .trim()
            .toLowerCase()
            .replace(/[\s_]+/g, '-')
            .replace(/-+/g, '-');
    }
    normalizeTextArray(items) {
        return [...new Set(items.map((item) => item.trim()).filter(Boolean))];
    }
    optionalText(value, fallback) {
        if (value === undefined) {
            return fallback;
        }
        const trimmed = value?.trim();
        return trimmed ? trimmed : null;
    }
    humanizePredictionLabel(value) {
        return value
            .replace(/[_-]+/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }
    readString(value) {
        return typeof value === 'string' && value.trim() ? value.trim() : null;
    }
    readNumber(value) {
        if (typeof value === 'number' && Number.isFinite(value)) {
            return value;
        }
        if (typeof value === 'string' && value.trim()) {
            const parsed = Number(value);
            return Number.isFinite(parsed) ? parsed : null;
        }
        return null;
    }
    mapDisease(disease) {
        if (!disease) {
            return null;
        }
        return {
            diseaseId: disease.diseaseId,
            diseaseKey: disease.diseaseKey,
            diseaseSlug: disease.diseaseSlug,
            diseaseName: disease.diseaseName,
            summary: disease.summary,
            symptoms: disease.symptoms,
            causes: disease.causes,
            treatmentGuidance: disease.treatmentGuidance,
            preventionGuidance: disease.preventionGuidance,
            severity: disease.severity,
            recommendedIngredients: disease.recommendedIngredients ?? [],
            searchKeywords: disease.searchKeywords ?? [],
            confidenceThreshold: Number(disease.confidenceThreshold),
            coverImageUrl: disease.coverImageUrl,
            isActive: disease.isActive,
            createdAt: disease.createdAt,
            updatedAt: disease.updatedAt,
        };
    }
};
exports.RiceDiagnosisService = RiceDiagnosisService;
exports.RiceDiagnosisService = RiceDiagnosisService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(rice_disease_entity_1.RiceDiseaseEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(rice_disease_recommendation_entity_1.RiceDiseaseRecommendationEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(rice_diagnosis_history_entity_1.RiceDiagnosisHistoryEntity)),
    __param(3, (0, typeorm_1.InjectRepository)(product_entity_1.ProductEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        products_service_1.ProductsService,
        config_1.ConfigService])
], RiceDiagnosisService);
//# sourceMappingURL=rice-diagnosis.service.js.map