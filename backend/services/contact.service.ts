import { IContact } from "../models/Contact";
import Contact from "../models/Contact";
import { CreateContactDto } from "../dtos/contact.dto";
import { contactMessage } from "../email/email.contact_message";

export class ContactService {
  constructor() {
    // Mongoose models are used directly
  }

  async createContact(contactData: CreateContactDto): Promise<IContact> {
    const contact = new Contact(contactData);
    await contactMessage(contact.email, contact.name, contact.message, process.env.EMAIL_USER)
    return await contact.save();
  }

  async getAllContacts(): Promise<IContact[]> {
    return await Contact.find().sort({ createdAt: -1 });
  }

  async getContactById(id: string): Promise<IContact | null> {
    return await Contact.findById(id);
  }

  async updateContactStatus(
    id: string,
    status: string
  ): Promise<IContact | null> {
    return await Contact.findByIdAndUpdate(id, { status }, { new: true });
  }
}