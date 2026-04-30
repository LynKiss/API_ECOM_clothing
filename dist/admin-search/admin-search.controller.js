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
exports.AdminSearchController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const admin_search_service_1 = require("./admin-search.service");
const admin_search_query_dto_1 = require("./dto/admin-search-query.dto");
let AdminSearchController = class AdminSearchController {
    adminSearchService;
    constructor(adminSearchService) {
        this.adminSearchService = adminSearchService;
    }
    search(currentUser, query) {
        return this.adminSearchService.search(currentUser, query);
    }
};
exports.AdminSearchController = AdminSearchController;
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.ResponseMessage)('Global admin search'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, admin_search_query_dto_1.AdminSearchQueryDto]),
    __metadata("design:returntype", void 0)
], AdminSearchController.prototype, "search", null);
exports.AdminSearchController = AdminSearchController = __decorate([
    (0, common_1.Controller)('admin-search'),
    __metadata("design:paramtypes", [admin_search_service_1.AdminSearchService])
], AdminSearchController);
//# sourceMappingURL=admin-search.controller.js.map