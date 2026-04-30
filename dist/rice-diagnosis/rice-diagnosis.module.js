"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RiceDiagnosisModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const products_module_1 = require("../products/products.module");
const product_entity_1 = require("../products/entities/product.entity");
const rice_diagnosis_controller_1 = require("./rice-diagnosis.controller");
const rice_diagnosis_service_1 = require("./rice-diagnosis.service");
const rice_diagnosis_history_entity_1 = require("./entities/rice-diagnosis-history.entity");
const rice_disease_recommendation_entity_1 = require("./entities/rice-disease-recommendation.entity");
const rice_disease_entity_1 = require("./entities/rice-disease.entity");
let RiceDiagnosisModule = class RiceDiagnosisModule {
};
exports.RiceDiagnosisModule = RiceDiagnosisModule;
exports.RiceDiagnosisModule = RiceDiagnosisModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            products_module_1.ProductsModule,
            typeorm_1.TypeOrmModule.forFeature([
                rice_disease_entity_1.RiceDiseaseEntity,
                rice_disease_recommendation_entity_1.RiceDiseaseRecommendationEntity,
                rice_diagnosis_history_entity_1.RiceDiagnosisHistoryEntity,
                product_entity_1.ProductEntity,
            ]),
        ],
        controllers: [rice_diagnosis_controller_1.RiceDiagnosisController],
        providers: [rice_diagnosis_service_1.RiceDiagnosisService],
        exports: [rice_diagnosis_service_1.RiceDiagnosisService],
    })
], RiceDiagnosisModule);
//# sourceMappingURL=rice-diagnosis.module.js.map