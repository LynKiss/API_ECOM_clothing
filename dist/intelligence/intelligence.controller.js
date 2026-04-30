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
exports.IntelligenceController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const query_demand_forecast_dto_1 = require("./dto/query-demand-forecast.dto");
const query_product_recommendations_dto_1 = require("./dto/query-product-recommendations.dto");
const query_reorder_suggestions_dto_1 = require("./dto/query-reorder-suggestions.dto");
const intelligence_service_1 = require("./intelligence.service");
let IntelligenceController = class IntelligenceController {
    intelligenceService;
    constructor(intelligenceService) {
        this.intelligenceService = intelligenceService;
    }
    getProductRecommendations(query) {
        return this.intelligenceService.getProductRecommendations(query);
    }
    getReorderSuggestions(query) {
        return this.intelligenceService.getReorderSuggestions(query);
    }
    getDemandForecast(query) {
        return this.intelligenceService.getDemandForecast(query);
    }
};
exports.IntelligenceController = IntelligenceController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('product-recommendations'),
    (0, customize_1.ResponseMessage)('Get product recommendations'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_product_recommendations_dto_1.QueryProductRecommendationsDto]),
    __metadata("design:returntype", void 0)
], IntelligenceController.prototype, "getProductRecommendations", null);
__decorate([
    (0, common_1.Get)('reorder-suggestions'),
    (0, customize_1.RequirePermissions)('manage_inventory'),
    (0, customize_1.ResponseMessage)('Get reorder suggestions'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_reorder_suggestions_dto_1.QueryReorderSuggestionsDto]),
    __metadata("design:returntype", void 0)
], IntelligenceController.prototype, "getReorderSuggestions", null);
__decorate([
    (0, common_1.Get)('demand-forecast'),
    (0, customize_1.RequirePermissions)('manage_inventory'),
    (0, customize_1.ResponseMessage)('Get demand forecast'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_demand_forecast_dto_1.QueryDemandForecastDto]),
    __metadata("design:returntype", void 0)
], IntelligenceController.prototype, "getDemandForecast", null);
exports.IntelligenceController = IntelligenceController = __decorate([
    (0, common_1.Controller)('intelligence'),
    __metadata("design:paramtypes", [intelligence_service_1.IntelligenceService])
], IntelligenceController);
//# sourceMappingURL=intelligence.controller.js.map