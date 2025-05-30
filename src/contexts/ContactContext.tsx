
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ContactData {
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  checkinTime: string;
  checkoutTime: string;
}

// Predvolené kontaktné údaje
const initialContactData: ContactData = {
  address: "Apartmán Tília",
  postalCode: "97221 Bešeňová",
  phone: "+421 XXX XXX XXX",
  email: "apartmantilia@gmail.com",
  checkinTime: "14:00 - 20:00",
  checkoutTime: "do 10:00"
};

interface ContactContextType {
  contactData: ContactData;
  updateContactData: (data: ContactData) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
  // Force clear old data and use fresh initial data
  const [contactData, setContactData] = useState<ContactData>(() => {
    // Clear any old cached data
    localStorage.removeItem('apartman-contact-data');
    return initialContactData;
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
