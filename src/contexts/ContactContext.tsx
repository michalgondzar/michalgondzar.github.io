
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
  // Load data from localStorage or use initial data
  const [contactData, setContactData] = useState<ContactData>(() => {
    try {
      const saved = localStorage.getItem('apartman-contact-data');
      return saved ? JSON.parse(saved) : initialContactData;
    } catch {
      return initialContactData;
    }
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('apartman-contact-data', JSON.stringify(contactData));
  }, [contactData]);

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
