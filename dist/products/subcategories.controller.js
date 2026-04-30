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
exports.SubcategoriesController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const create_subcategory_dto_1 = require("./dto/create-subcategory.dto");
const query_subcategories_dto_1 = require("./dto/query-subcategories.dto");
const update_subcategory_dto_1 = require("./dto/update-subcategory.dto");
const subcategories_service_1 = require("./subcategories.service");
let SubcategoriesController = class SubcategoriesController {
    subcategoriesService;
    constructor(subcategoriesService) {
        this.subcategoriesService = subcategoriesService;
    }
    getSubcategories(query) {
        return this.subcategoriesService.findAll(query);
    }
    getSubcategory(id) {
        return this.subcategoriesService.findOne(id);
    }
    createSubcategory(dto) {
        return this.subcategoriesService.create(dto);
    }
    updateSubcategory(id, dto) {
        return this.subcategoriesService.update(id, dto);
    }
    removeSubcategory(id) {
        return this.subcategoriesService.remove(id);
    }
};
exports.SubcategoriesController = SubcategoriesController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Get subcategories list'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [query_subcategories_dto_1.QuerySubcategoriesDto]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "getSubcategories", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, customize_1.ResponseMessage)('Get subcategory detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "getSubcategory", null);
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create subcategory'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_subcategory_dto_1.CreateSubcategoryDto]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "createSubcategory", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Update subcategory'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_subcategory_dto_1.UpdateSubcategoryDto]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "updateSubcategory", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Delete subcategory'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], SubcategoriesController.prototype, "removeSubcategory", null);
exports.SubcategoriesController = SubcategoriesController = __decorate([
    (0, common_1.Controller)('subcategories'),
    __metadata("design:paramtypes", [subcategories_service_1.SubcategoriesService])
], SubcategoriesController);
//# sourceMappingURL=subcategories.controller.js.map