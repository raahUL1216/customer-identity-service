import express, { Request, Response } from 'express';
import { initializeResponse } from '../models/response';

import { Contact } from '../entity/contact';
import { AppDataSource } from '../database';

import { createContact, findExistingContacts, findPrimaryContacts, getAllContacts, isGivenContactDuplicate } from '../utils/customer';
import { removeDuplicates } from '../utils/miscellaneous';

const router = express.Router();

const contactRepositary = AppDataSource.getRepository(Contact);

/**
 * Identify customer by email or phone and create new contact if required
 */
router.post('/identify', async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;
    const response = initializeResponse();

    try {
        const existingContacts = await findExistingContacts(email, phoneNumber);
        console.log(`total existing contacts: ${existingContacts.length}`);

        if (existingContacts.length === 0) {
            // if new contact details provided, create primary contact
            const newContact = await createContact(
                email,
                phoneNumber,
                'primary'
            );

            response.primaryContactId = newContact.id;
            response.emails.push(newContact.email);
            response.phoneNumbers.push(newContact.phoneNumber);
        } else {
            const contacts = await getAllContacts(existingContacts);
            console.log(contacts);

            const primaryContacts = findPrimaryContacts(contacts);
            const primaryContactId = primaryContacts ? primaryContacts[0]?.id : null;

            // add existing email and phone contacts in response
            response.primaryContactId = primaryContactId;
            response.emails = contacts.map(({ email }) => email);
            response.phoneNumbers = contacts.map(({ phoneNumber }) => phoneNumber);

            if (primaryContacts.length == 1) {
                // create secondary contact if there is only 1 primary contact
                response.secondaryContactIds = contacts.filter((contact) => contact.id !== primaryContactId).map((contact) => contact.id);

                const isDuplicate = isGivenContactDuplicate(
                    contacts,
                    email,
                    phoneNumber
                );

                if (!isDuplicate) {
                    console.log('creating secondary contact', isDuplicate);
                    const customer = await createContact(
                        email,
                        phoneNumber,
                        'secondary',
                        existingContacts[0].id
                    );

                    response.emails.push(customer.email);
                    response.phoneNumbers.push(customer.phoneNumber);
                    response.secondaryContactIds.push(customer.id);
                }
            } else {
                // handle multiple primary contacts by updating latest primary contacts with secondary
                console.log('multiple primary contacts');
                for (let index = 1; index < primaryContacts.length; index++) {
                    let contact = primaryContacts[index];
                    contact.linkedId = primaryContactId;
                    contact.linkPrecedence = 'secondary';

                    await contactRepositary.save(contact);
                    response.secondaryContactIds.push(contact.id);
                }
            }

            // prepare response
            response.emails = removeDuplicates(response.emails);
            response.phoneNumbers = removeDuplicates(response.phoneNumbers);
            response.secondaryContactIds = removeDuplicates(response.secondaryContactIds);
        }

        return res.json({ contact: response });
    }
    catch (error) {
        throw error;
    }
});

router.delete('/contact', async (req: Request, res: Response) => {
    const { id } = req.body;

    await contactRepositary.delete({ id: id });

    return res.json({ success: true });
});

export default router;