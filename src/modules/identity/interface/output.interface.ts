export interface Contact {
    primaryContactId: number;
    emails: string[];
    phoneNumbers: string[];
    secondaryContactIds: number[];
  }
  
  export interface Output {
    contact: Contact;
  }
  