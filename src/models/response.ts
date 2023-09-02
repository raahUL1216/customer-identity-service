type IdentityResponse = {
    primaryContactId: number | null;
    emails: (string | null)[];
    phoneNumbers: (string | null)[];
    secondaryContactIds: number[];
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