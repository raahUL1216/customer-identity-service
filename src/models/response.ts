type IdentityResponse = {
    primaryContactId: number | null | undefined;
    emails: any[];
    phoneNumbers: any[];
    secondaryContactIds: any[];
};

/**
 * return identity api response format
 * @returns 
 */
export const initializeResponse = () => {
    const response: IdentityResponse = {
        primaryContactId: null,
        emails: [],
        phoneNumbers: [],
        secondaryContactIds: []
    };

    return response;
}