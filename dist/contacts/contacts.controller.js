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
exports.ContactsController = void 0;
const common_1 = require("@nestjs/common");
const customize_1 = require("../decorator/customize");
const create_contact_dto_1 = require("./dto/create-contact.dto");
const update_contact_status_dto_1 = require("./dto/update-contact-status.dto");
const contacts_service_1 = require("./contacts.service");
let ContactsController = class ContactsController {
    contactsService;
    constructor(contactsService) {
        this.contactsService = contactsService;
    }
    createContact(currentUser, createContactDto) {
        return this.contactsService.create(currentUser, createContactDto);
    }
    getMyContacts(currentUser) {
        return this.contactsService.findMine(currentUser._id);
    }
    getContacts() {
        return this.contactsService.findAll();
    }
    getContact(id, currentUser) {
        const canManage = currentUser.permissions.some((permission) => permission.key === 'manage_users');
        return this.contactsService.findOne(id, currentUser, canManage);
    }
    updateContactStatus(id, updateContactStatusDto) {
        return this.contactsService.updateStatus(id, updateContactStatusDto);
    }
};
exports.ContactsController = ContactsController;
__decorate([
    (0, common_1.Post)(),
    (0, customize_1.ResponseMessage)('Create contact'),
    __param(0, (0, customize_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_contact_dto_1.CreateContactDto]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "createContact", null);
__decorate([
    (0, common_1.Get)('my'),
    (0, customize_1.ResponseMessage)('Get my contacts'),
    __param(0, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getMyContacts", null);
__decorate([
    (0, common_1.Get)(),
    (0, customize_1.RequirePermissions)('manage_users'),
    (0, customize_1.ResponseMessage)('Get contacts list'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getContacts", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, customize_1.ResponseMessage)('Get contact detail'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, customize_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "getContact", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, customize_1.RequirePermissions)('manage_users'),
    (0, customize_1.ResponseMessage)('Update contact status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_contact_status_dto_1.UpdateContactStatusDto]),
    __metadata("design:returntype", void 0)
], ContactsController.prototype, "updateContactStatus", null);
exports.ContactsController = ContactsController = __decorate([
    (0, common_1.Controller)('contacts'),
    __metadata("design:paramtypes", [contacts_service_1.ContactsService])
], ContactsController);
//# sourceMappingURL=contacts.controller.js.map