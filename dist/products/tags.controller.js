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
exports.TagsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const create_tag_dto_1 = require("./dto/create-tag.dto");
const manage_product_tags_dto_1 = require("./dto/manage-product-tags.dto");
const update_tag_dto_1 = require("./dto/update-tag.dto");
const tags_service_1 = require("./tags.service");
let TagsController = class TagsController {
    tagsService;
    constructor(tagsService) {
        this.tagsService = tagsService;
    }
    getTags(search) {
        return this.tagsService.findAll(search);
    }
    getProductTags(productId) {
        return this.tagsService.getProductTags(productId);
    }
    addProductTags(productId, dto) {
        return this.tagsService.addProductTags(productId, dto);
    }
    setProductTags(productId, dto) {
        return this.tagsService.setProductTags(productId, dto);
    }
    removeProductTag(productId, tagId) {
        return this.tagsService.removeProductTag(productId, tagId);
    }
    getTag(id) {
        return this.tagsService.findOne(id);
    }
    createTag(dto) {
        return this.tagsService.create(dto);
    }
    updateTag(id, dto) {
        return this.tagsService.update(id, dto);
    }
    removeTag(id) {
        return this.tagsService.remove(id);
    }
};
exports.TagsController = TagsController;
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Get tags list'),
    __param(0, (0, common_1.Query)('search')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "getTags", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)('products/:productId'),
    (0, customize_1.ResponseMessage)('Get product tags'),
    __param(0, (0, common_1.Param)('productId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "getProductTags", null);
__decorate([
    (0, common_1.Post)('products/:productId'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Add product tags'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, manage_product_tags_dto_1.ManageProductTagsDto]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "addProductTags", null);
__decorate([
    (0, common_1.Patch)('products/:productId'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Set product tags'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, manage_product_tags_dto_1.ManageProductTagsDto]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "setProductTags", null);
__decorate([
    (0, common_1.Delete)('products/:productId/:tagId'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Remove product tag'),
    __param(0, (0, common_1.Param)('productId')),
    __param(1, (0, common_1.Param)('tagId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "removeProductTag", null);
__decorate([
    (0, customize_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, customize_1.ResponseMessage)('Get tag detail'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "getTag", null);
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Create tag'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tag_dto_1.CreateTagDto]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "createTag", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Update tag'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_tag_dto_1.UpdateTagDto]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "updateTag", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, customize_1.RequirePermissions)('manage_products'),
    (0, customize_1.ResponseMessage)('Delete tag'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TagsController.prototype, "removeTag", null);
exports.TagsController = TagsController = __decorate([
    (0, common_1.Controller)('tags'),
    __metadata("design:paramtypes", [tags_service_1.TagsService])
], TagsController);
//# sourceMappingURL=tags.controller.js.map