
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ContactData {
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  checkinTime: string;
  checkoutTime: string;
}

// Upravte tieto predvolené hodnoty podľa vašich skutočných kontaktných údajov
const initialContactData: ContactData = {
  address: "Vaša skutočná adresa",  // Zmeňte na vašu skutočnú adresu
  postalCode: "Vaše PSČ a mesto",   // Zmeňte na vaše skutočné PSČ
  phone: "Vaše telefónne číslo",    // Zmeňte na vaše skutočné telefónne číslo
  email: "apartmantilia@gmail.com", // Zmeňte na váš skutočný email
  checkinTime: "14:00 - 20:00",     // Upravte podľa potreby
  checkoutTime: "do 10:00"          // Upravte podľa potreby
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
