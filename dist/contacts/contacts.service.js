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
exports.ContactsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const contact_entity_1 = require("./entities/contact.entity");
let ContactsService = class ContactsService {
    contactsRepository;
    constructor(contactsRepository) {
        this.contactsRepository = contactsRepository;
    }
    async create(currentUser, createContactDto) {
        const contact = this.contactsRepository.create({
            userId: currentUser._id,
            subject: createContactDto.subject,
            message: createContactDto.message,
        });
        return this.contactsRepository.save(contact);
    }
    async findAll() {
        return this.contactsRepository.find({
            order: { createdAt: 'DESC' },
        });
    }
    async findMine(userId) {
        return this.contactsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }
    async findOne(contactId, currentUser, canManage) {
        const contact = await this.contactsRepository.findOneBy({ contactId });
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        if (!canManage && contact.userId !== currentUser._id) {
            throw new common_1.ForbiddenException('You cannot access this contact');
        }
        return contact;
    }
    async updateStatus(contactId, updateContactStatusDto) {
        const contact = await this.contactsRepository.findOneBy({ contactId });
        if (!contact) {
            throw new common_1.NotFoundException('Contact not found');
        }
        contact.status = updateContactStatusDto.status;
        return this.contactsRepository.save(contact);
    }
};
exports.ContactsService = ContactsService;
exports.ContactsService = ContactsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(contact_entity_1.ContactEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ContactsService);
//# sourceMappingURL=contacts.service.js.map