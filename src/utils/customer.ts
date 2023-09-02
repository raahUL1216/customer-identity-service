import { Contact } from '../entity/contact';
import { AppDataSource } from '../database';
import { In } from 'typeorm';

const contactRepositary = AppDataSource.getRepository(Contact);

/**
 * get existing contacts based on email or phoneNumber
 * @param email 
 * @param phoneNumber 
 * @returns Contact[]
 */
const findExistingContacts = async (email: string, phoneNumber: string) => {
    return contactRepositary.find({
        where: [
            { email: email },
            { phoneNumber: phoneNumber },
        ],
    });
}

/**
 * gets all contacts based on given emails, phone numbers and linked contacts
 * @param emails 
 * @param phoneNumbers 
 * @param secondaryContactIds 
 * @returns Contact[]
 */
const getAllContacts = async (existingContacts: Contact[]) => {
    const { emails, phoneNumbers, secondaryContactIds } = extractContactData(existingContacts);

    return contactRepositary.find({
        where: [
            { email: In(emails) },
            { phoneNumber: In(phoneNumbers) },
            { linkedId: In(secondaryContactIds) }
        ],
        order: {
            createdAt: "ASC"
        }
    });
}

/**
 * create primary or secondary customer contact
 * @param email 
 * @param phoneNumber 
 * @param linkPrecedence 
 * @param primaryContactId 
 * @returns Contact
 */
const createContact = async (
    email: string,
    phoneNumber: string,
    linkPrecedence: 'primary' | 'secondary' = 'primary',
    primaryContactId: number | null = null
) => {
    const customer = new Contact();

    customer.email = email;
    customer.phoneNumber = phoneNumber;
    customer.linkedId = primaryContactId;
    customer.linkPrecedence = linkPrecedence;

    await contactRepositary.save(customer);

    return customer;
}

/**
 * extract email, phone and secondary contacts as seperate arrays
 * @param existingContacts 
 * @returns { emails: [], phoneNumbers: [], secondaryContactIds: []}
 */
const extractContactData = (existingContacts: Contact[]) => {
    const emails = existingContacts.map(({ email }) => email).filter((email) => !!email);
    const phoneNumbers = existingContacts.map(({ phoneNumber }) => phoneNumber).filter((phoneNumber) => !!phoneNumber);
    const secondaryContactIds = existingContacts.map(({ linkedId }) => linkedId).filter((linkedId) => !!linkedId);

    return { emails, phoneNumbers, secondaryContactIds };
}

/**
 * gets first primary contact from given list of contacts
 * @param contacts 
 * @returns Contact
 */
const findPrimaryContacts = (contacts: Contact[]) => {
    return contacts.filter((contact) => contact.linkPrecedence === 'primary');
}

export { findExistingContacts, getAllContacts, createContact, findPrimaryContacts };