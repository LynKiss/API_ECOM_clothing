import type { IUser } from '../users/users.interface';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { ContactsService } from './contacts.service';
export declare class ContactsController {
    private readonly contactsService;
    constructor(contactsService: ContactsService);
    createContact(currentUser: IUser, createContactDto: CreateContactDto): Promise<import("./entities/contact.entity").ContactEntity>;
    getMyContacts(currentUser: IUser): Promise<import("./entities/contact.entity").ContactEntity[]>;
    getContacts(): Promise<import("./entities/contact.entity").ContactEntity[]>;
    getContact(id: string, currentUser: IUser): Promise<import("./entities/contact.entity").ContactEntity>;
    updateContactStatus(id: string, updateContactStatusDto: UpdateContactStatusDto): Promise<import("./entities/contact.entity").ContactEntity>;
}
