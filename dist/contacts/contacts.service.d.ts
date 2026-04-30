import { Repository } from 'typeorm';
import type { IUser } from '../users/users.interface';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactStatusDto } from './dto/update-contact-status.dto';
import { ContactEntity } from './entities/contact.entity';
export declare class ContactsService {
    private readonly contactsRepository;
    constructor(contactsRepository: Repository<ContactEntity>);
    create(currentUser: IUser, createContactDto: CreateContactDto): Promise<ContactEntity>;
    findAll(): Promise<ContactEntity[]>;
    findMine(userId: string): Promise<ContactEntity[]>;
    findOne(contactId: string, currentUser: IUser, canManage: boolean): Promise<ContactEntity>;
    updateStatus(contactId: string, updateContactStatusDto: UpdateContactStatusDto): Promise<ContactEntity>;
}
