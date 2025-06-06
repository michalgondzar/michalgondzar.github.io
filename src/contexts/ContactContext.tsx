
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
  isLoading: boolean;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider = ({ children }: { children: ReactNode }) => {
  const [contactData, setContactData] = useState<ContactData>(initialContactData);
  const [isLoading, setIsLoading] = useState(true);

  // Načítanie kontaktných údajov z Supabase
  useEffect(() => {
    const loadContactData = async () => {
      try {
        console.log('Loading contact data from Supabase...');
        const { data, error } = await supabase
          .from('contact_info')
          .select('*')
          .eq('id', 1)
          .maybeSingle();

        if (error) {
          console.error('Error loading contact data:', error);
          setContactData(initialContactData);
        } else if (data) {
          console.log('Contact data loaded successfully:', data);
          setContactData({
            address: data.address,
            postalCode: data.postal_code,
            phone: data.phone,
            email: data.email,
            checkinTime: data.checkin_time,
            checkoutTime: data.checkout_time
          });
        } else {
          console.log('No contact data found, using defaults');
          setContactData(initialContactData);
        }
      } catch (error) {
        console.error('Error in loadContactData:', error);
        setContactData(initialContactData);
      } finally {
        setIsLoading(false);
      }
    };

    loadContactData();
  }, []);

  const updateContactData = async (data: ContactData) => {
    console.log('Starting contact data update with:', data);
    
    try {
      const { error } = await supabase
        .from('contact_info')
        .update({
          address: data.address,
          postal_code: data.postalCode,
          phone: data.phone,
          email: data.email,
          checkin_time: data.checkinTime,
          checkout_time: data.checkoutTime,
          updated_at: new Date().toISOString()
        })
        .eq('id', 1);

      if (error) {
        console.error('Error updating contact data:', error);
        throw error;
      }

      setContactData(data);
      console.log('Contact data updated successfully');
    } catch (error) {
      console.error('Error in updateContactData:', error);
      throw error;
    }
  };

  return (
    <ContactContext.Provider value={{ contactData, updateContactData, isLoading }}>
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
