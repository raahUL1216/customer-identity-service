import express, { Request, Response } from 'express';
import { IdentityResponse } from '../models/response';

import { In } from 'typeorm';
import { Contact } from '../entity/contact';
import { AppDataSource } from '../database';

import { createCustomerContact } from '../utils/customer';
import { removeDuplicates } from '../utils/miscellaneous';

const router = express.Router();

const contactRepositary = AppDataSource.getRepository(Contact);

/**
 * Identify customer by email or phone and create new contact if required
 */
router.post('/identify', async (req: Request, res: Response) => {
    const { email, phoneNumber } = req.body;
    const response: IdentityResponse = {
        primaryContactId: null,
        emails: [],
        phoneNumbers: [],
        secondaryContactIds: []
    };

    try {
        // Check if a contact already exists
        const existingContacts = await contactRepositary.find({
            where: [
                { email: email },
                { phoneNumber: phoneNumber },
            ],
        });

        console.log(`total customers: ${existingContacts.length}`);

        if (existingContacts.length === 0) {
            // if given contact does not exists, create primary contact
            const customer = await createCustomerContact(
                email,
                phoneNumber
            );

            response.primaryContactId = customer.id;
            response.emails.push(customer.email);
            response.phoneNumbers.push(customer.phoneNumber);
        } else {
            let emails = existingContacts.map(({ email }) => email).filter((email) => !!email);
            let phoneNumbers = existingContacts.map(({ phoneNumber }) => phoneNumber).filter((phoneNumber) => !!phoneNumber);
            let secondaryContactIds = existingContacts.map(({ linkedId }) => linkedId).filter((linkedId) => !!linkedId);

            console.log(emails);
            console.log(phoneNumbers);
            console.log(secondaryContactIds);

            const contacts = await contactRepositary.find({
                where: [
                    { email: In(emails) },
                    { phoneNumber: In(phoneNumbers) },
                    { linkedId: In(secondaryContactIds) }
                ]
            });

            console.log(contacts);

            // extract primary contact
            const primaryContact = contacts.find((contact) => contact.linkPrecedence === 'primary');
            const primaryContactId = primaryContact?.id;

            // map existing contact in response
            response.emails = contacts.map(({ email }) => email);
            response.phoneNumbers = contacts.map(({ phoneNumber }) => phoneNumber);
            response.secondaryContactIds = contacts.filter((contact) => contact.id !== primaryContactId).map((contact) => contact.id)

            // create new secondary contact if new contact is provided
            const sameContact = contacts.find((contact) => (
                (contact.email === email && contact.phoneNumber === phoneNumber) ||
                (email === null && contact.phoneNumber === phoneNumber) ||
                (contact.email === email && phoneNumber === null)
            ));

            // console.log(sameContact);

            if (!sameContact) {
                console.log('creating secondary contact');
                const customer = await createCustomerContact(email, phoneNumber, existingContacts[0].id, 'secondary');

                response.emails.push(customer.email);
                response.phoneNumbers.push(customer.phoneNumber);
                response.secondaryContactIds.push(customer.id);
            }

            // prepare response
            response.primaryContactId = primaryContactId;
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