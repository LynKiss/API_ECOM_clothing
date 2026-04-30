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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabasesController = void 0;
const common_1 = require("@nestjs/common");
const databases_service_1 = require("./databases.service");
let DatabasesController = class DatabasesController {
    databasesService;
    constructor(databasesService) {
        this.databasesService = databasesService;
    }
    getSummary() {
        return this.databasesService.getSummary();
    }
};
exports.DatabasesController = DatabasesController;
__decorate([
    (0, common_1.Get)('summary'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], DatabasesController.prototype, "getSummary", null);
exports.DatabasesController = DatabasesController = __decorate([
    (0, common_1.Controller)('databases'),
    __metadata("design:paramtypes", [databases_service_1.DatabasesService])
], DatabasesController);
//# sourceMappingURL=databases.controller.js.map