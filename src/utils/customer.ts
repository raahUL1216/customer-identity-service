import { Contact } from '../entity/contact';
import { AppDataSource } from '../database';
import { In } from 'typeorm';

const contactRepositary = AppDataSource.getRepository(Contact);

/**
 * find existing contacts based on email or phoneNumber
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
 * gets all contacts based on existing contacts (parent + children)
 * @param contacts
 * @returns Contact[]
 */
const getAllContacts = async (contacts: Contact[]) => {
    const parentIds = contacts.map((contact) => (contact.parentId || contact.id))

    if (!parentIds?.length) {
        return [];
    }

    return contactRepositary.find({
        where: [
            { id: In(parentIds) },
            { parentId: In(parentIds) }
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
 * @param parentId
 * @returns Contact
 */
const createContact = async (
    email: string,
    phoneNumber: string,
    linkPrecedence: 'primary' | 'secondary' = 'primary',
    primaryContactId: number | null = null,
    parentId: number | null = null
) => {
    const customer = new Contact();

    customer.email = email;
    customer.phoneNumber = phoneNumber;
    customer.linkedId = primaryContactId;
    customer.linkPrecedence = linkPrecedence;
    customer.parentId = parentId;

    await contactRepositary.save(customer);

    return customer;
}

/**
 * check if given contact is duplicate
 * @param contacts 
 * @param email 
 * @param phoneNumber 
 * @returns Boolean
 */
const isGivenContactDuplicate = (contacts: Contact[], email: string | null, phoneNumber: string | null) => {
    const contact = contacts.find((contact) => (
        (contact.email === email && contact.phoneNumber === phoneNumber) ||
        (email === null && contact.phoneNumber === phoneNumber) ||
        (contact.email === email && phoneNumber === null)
    ));

    // if two different contacts are present with each containing email and phoneNumber, then avoid creating new contact
    const contactsWithEmail = contacts.filter((contact) => contact.email === email);
    const contactsWithPhone = contacts.filter((contact) => contact.phoneNumber === phoneNumber);

    let isDuplicate = (contactsWithEmail?.length > 0 && contactsWithPhone?.length > 0) ? true : false;

    return !!contact || isDuplicate;
}

/**
 * gets first primary contact from given list of contacts
 * @param contacts 
 * @returns Contact
 */
const findPrimaryContacts = (contacts: Contact[]) => {
    return contacts.filter((contact) => contact.linkPrecedence === 'primary');
}

/**
 * Contact rows are linked if they have either of email or phone as common.
 * @param contacts 
 * @param email 
 * @param phoneNumber 
 * @returns Number
 */
const findLinkedId = (contacts: Contact[], email: string | null, phoneNumber: string | null) => {
    const contact = contacts.find((contact) => (contact.email === email || contact.phoneNumber === phoneNumber));

    return contact?.id || null;
}

export { findExistingContacts, getAllContacts, createContact, isGivenContactDuplicate, findPrimaryContacts, findLinkedId };