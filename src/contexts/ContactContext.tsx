
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ContactData {
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  checkinTime: string;
  checkoutTime: string;
}

const initialContactData: ContactData = {
  address: "Bešeňová 123",
  postalCode: "034 83 Bešeňová",
  phone: "+421 900 123 456",
  email: "info@trivily.sk",
  checkinTime: "14:00 - 20:00",
  checkoutTime: "do 10:00"
};

interface ContactContextType {
  contactData: ContactData;
  updateContactData: (data: ContactData) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
  const [contactData, setContactData] = useState<ContactData>(initialContactData);

  const updateContactData = (data: ContactData) => {
    setContactData(data);
  };

  return (
    <ContactContext.Provider value={{ contactData, updateContactData }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContact = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};
