import { Contact } from '../entity/contact';
import { AppDataSource } from '../database';

const contactRepositary = AppDataSource.getRepository(Contact);

const createCustomerContact = async (
    email: string,
    phoneNumber: string,
    primaryContactId: number | null = null,
    linkPrecedence: 'primary' | 'secondary' = 'primary'
) => {
    const customer = new Contact();

    customer.email = email;
    customer.phoneNumber = phoneNumber;
    customer.linkedId = primaryContactId;
    customer.linkPrecedence = linkPrecedence;

    await contactRepositary.save(customer);

    return customer;
}

export { createCustomerContact };