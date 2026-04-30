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
exports.SystemSettingEntity = void 0;
const typeorm_1 = require("typeorm");
let SystemSettingEntity = class SystemSettingEntity {
    settingKey;
    settingValue;
    createdAt;
    updatedAt;
};
exports.SystemSettingEntity = SystemSettingEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ name: 'setting_key', type: 'varchar', length: 100 }),
    __metadata("design:type", String)
], SystemSettingEntity.prototype, "settingKey", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'setting_value', type: 'longtext' }),
    __metadata("design:type", String)
], SystemSettingEntity.prototype, "settingValue", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SystemSettingEntity.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], SystemSettingEntity.prototype, "updatedAt", void 0);
exports.SystemSettingEntity = SystemSettingEntity = __decorate([
    (0, typeorm_1.Entity)({ name: 'system_settings' })
], SystemSettingEntity);
//# sourceMappingURL=system-setting.entity.js.map