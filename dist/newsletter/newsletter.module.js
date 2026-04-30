"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsletterModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const settings_module_1 = require("../settings/settings.module");
const newsletter_campaign_entity_1 = require("./entities/newsletter-campaign.entity");
const newsletter_subscriber_entity_1 = require("./entities/newsletter-subscriber.entity");
const newsletter_controller_1 = require("./newsletter.controller");
const newsletter_service_1 = require("./newsletter.service");
let NewsletterModule = class NewsletterModule {
};
exports.NewsletterModule = NewsletterModule;
exports.NewsletterModule = NewsletterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            settings_module_1.SettingsModule,
            typeorm_1.TypeOrmModule.forFeature([newsletter_subscriber_entity_1.NewsletterSubscriberEntity, newsletter_campaign_entity_1.NewsletterCampaignEntity]),
        ],
        controllers: [newsletter_controller_1.NewsletterController],
        providers: [newsletter_service_1.NewsletterService],
        exports: [newsletter_service_1.NewsletterService],
    })
], NewsletterModule);
//# sourceMappingURL=newsletter.module.js.map