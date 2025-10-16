"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const Contact_1 = __importDefault(require("../models/Contact"));
const email_contact_message_1 = require("../email/email.contact_message");
class ContactService {
    constructor() {
        // Mongoose models are used directly
    }
    async createContact(contactData) {
        const contact = new Contact_1.default(contactData);
        await (0, email_contact_message_1.contactMessage)(contact.email, contact.name, contact.message, process.env.EMAIL_USER);
        return await contact.save();
    }
    async getAllContacts() {
        return await Contact_1.default.find().sort({ createdAt: -1 });
    }
    async getContactById(id) {
        return await Contact_1.default.findById(id);
    }
    async updateContactStatus(id, status) {
        return await Contact_1.default.findByIdAndUpdate(id, { status }, { new: true });
    }
}
exports.ContactService = ContactService;
