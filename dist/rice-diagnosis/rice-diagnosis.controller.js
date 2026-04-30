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
exports.RiceDiagnosisController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const customize_1 = require("../decorator/customize");
const create_rice_disease_dto_1 = require("./dto/create-rice-disease.dto");
const query_admin_rice_diseases_dto_1 = require("./dto/query-admin-rice-diseases.dto");
const update_rice_disease_dto_1 = require("./dto/update-rice-disease.dto");
const rice_diagnosis_service_1 = require("./rice-diagnosis.service");
let RiceDiagnosisController = class RiceDiagnosisController {
    riceDiagnosisService;
    constructor(riceDiagnosisService) {
        this.riceDiagnosisService = riceDiagnosisService;
    }
    listPublicDiseases() {
        return this.riceDiagnosisService.listPublicDiseases();
    }
    getPublicDisease(slug) {
        return this.riceDiagnosisService.getPublicDiseaseBySlug(slug);
    }
    predict(file) {
        return this.riceDiagnosisService.predict(file);
    }
    predictForCurrentUser(currentUser, file) {
        return this.riceDiagnosisService.predict(file, currentUser);
    }
    getMyHistory(currentUser) {
        return this.riceDiagnosisService.listMyHistory(currentUser);
    }
    getAdminServiceStatus() {
        return this.riceDiagnosisService.getAdminServiceStatus();
    }
    getAdminProducts(search, limit) {
        return this.riceDiagnosisService.listAdminProducts(search, limit);
    }
    getAdminDiseases(query) {
        return this.riceDiagnosisService.listAdminDiseases(query);
    }
    getAdminDisease(id) {
        return this.riceDiagnosisService.getAdminDisease(id);
    }
    createDisease(createRiceDiseaseDto) {
        return this.riceDiagnosisService.createDisease(createRiceDiseaseDto);
    }
    updateDisease(id, updateRiceDiseaseDto) {
        return this.riceDiagnosisService.updateDisease(id, updateRiceDiseaseDto);
    }
    toggleDiseaseActive(id) {
        return this.riceDiagnosisService.toggleDiseaseActive(id);
    }
};
exports.RiceDiagnosisController = RiceDiagnosisController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('diseases'),
    (0, customize_1.ResponseMessage)('Get public rice diseases'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "listPublicDiseases", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('diseases/:slug'),
    (0, customize_1.ResponseMessage)('Get public rice disease detail'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "getPublicDisease", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Post)('predict'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, customize_1.ResponseMessage)('Predict rice disease from image'),
    __param(0, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "predict", null);
__decorate([
    (0, common_1.Post)('predict/me'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, customize_1.ResponseMessage)('Predict rice disease from image for current user'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "predictForCurrentUser", null);
__decorate([
    (0, common_1.Get)('history/me'),
    (0, customize_1.ResponseMessage)('Get my rice diagnosis history'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "getMyHistory", null);
__decorate([
    (0, common_1.Get)('admin/service-status'),
    (0, customize_1.RequirePermissions)('manage_ai_diagnosis'),
    (0, customize_1.ResponseMessage)('Get rice AI service status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "getAdminServiceStatus", null);
__decorate([
    (0, common_1.Get)('admin/products'),
    (0, customize_1.RequirePermissions)('manage_ai_diagnosis'),
    (0, customize_1.ResponseMessage)('Get products for rice disease mapping'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('limit', new common_1.ParseIntPipe({ optional: true }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number]),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "getAdminProducts", null);
__decorate([
    (0, common_1.Get)('admin/diseases'),
    (0, customize_1.RequirePermissions)('manage_ai_diagnosis'),
    (0, customize_1.ResponseMessage)('Get admin rice disease list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_admin_rice_diseases_dto_1.QueryAdminRiceDiseasesDto]),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "getAdminDiseases", null);
__decorate([
    (0, common_1.Get)('admin/diseases/:id'),
    (0, customize_1.RequirePermissions)('manage_ai_diagnosis'),
    (0, customize_1.ResponseMessage)('Get admin rice disease detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "getAdminDisease", null);
__decorate([
    (0, common_1.Post)('admin/diseases'),
    (0, customize_1.RequirePermissions)('manage_ai_diagnosis'),
    (0, customize_1.ResponseMessage)('Create rice disease'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_rice_disease_dto_1.CreateRiceDiseaseDto]),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "createDisease", null);
__decorate([
    (0, common_1.Patch)('admin/diseases/:id'),
    (0, customize_1.RequirePermissions)('manage_ai_diagnosis'),
    (0, customize_1.ResponseMessage)('Update rice disease'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_rice_disease_dto_1.UpdateRiceDiseaseDto]),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "updateDisease", null);
__decorate([
    (0, common_1.Patch)('admin/diseases/:id/toggle-active'),
    (0, customize_1.RequirePermissions)('manage_ai_diagnosis'),
    (0, customize_1.ResponseMessage)('Toggle rice disease active'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], RiceDiagnosisController.prototype, "toggleDiseaseActive", null);
exports.RiceDiagnosisController = RiceDiagnosisController = __decorate([
    (0, common_1.Controller)('rice-diagnosis'),
    __metadata("design:paramtypes", [rice_diagnosis_service_1.RiceDiagnosisService])
], RiceDiagnosisController);
//# sourceMappingURL=rice-diagnosis.controller.js.map