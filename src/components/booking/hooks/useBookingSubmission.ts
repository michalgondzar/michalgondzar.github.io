
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface BookingData {
  name: string;
  email: string;
  dateFrom: string;
  dateTo: string;
  guests: number;
  stayType: string | null; // Allow null for optional stay type
  coupon: string | null;
}

export const useBookingSubmission = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitBooking = async (bookingData: BookingData) => {
    setIsSubmitting(true);

    try {
      console.log('=== BOOKING SUBMISSION START ===');
      console.log('Input data:', bookingData);

      // Validate required fields
      if (!bookingData.name || !bookingData.email || !bookingData.dateFrom || !bookingData.dateTo) {
        console.error('Missing required fields:', {
          name: !bookingData.name,
          email: !bookingData.email,
          dateFrom: !bookingData.dateFrom,
          dateTo: !bookingData.dateTo
        });
        throw new Error('Chýbajú povinné polia');
      }

      console.log('Creating booking in database...');

      // Save booking to database
      const { data: savedBooking, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          name: bookingData.name,
          email: bookingData.email,
          date_from: bookingData.dateFrom,
          date_to: bookingData.dateTo,
          guests: bookingData.guests,
          stay_type: bookingData.stayType, // This can now be null
          coupon: bookingData.coupon,
          status: 'Čaká na potvrdenie'
        })
        .select()
        .single();

      if (bookingError) {
        console.error('Database error details:', {
          code: bookingError.code,
          message: bookingError.message,
          details: bookingError.details,
          hint: bookingError.hint
        });
        throw new Error(`Chyba databázy: ${bookingError.message}`);
      }

      console.log('Booking saved successfully:', savedBooking);

      // Check if we can access email settings
      console.log('Checking email settings...');
      const emailSettings = localStorage.getItem('emailSettings');
      console.log('Email settings found:', !!emailSettings);

      let emailTemplate = {
        subject: "Potvrdenie rezervácie - Apartmán Tília",
        content: `Dobrý deň {name},

ďakujeme Vám za rezerváciu v našom apartmáne Tília.

Vaša rezervácia bola úspešne prijatá s nasledovnými údajmi:
- Dátum príchodu: {dateFrom}
- Dátum odchodu: {dateTo}
- Počet hostí: {guests}
- Typ pobytu: {stayType}${bookingData.coupon ? '\n- Zľavový kupón: {coupon}' : ''}

V prípade akýchkoľvek otázok nás neváhajte kontaktovať.

Tešíme sa na Vašu návštevu!`
      };
      let senderEmail = "onboarding@resend.dev";
      let adminNotificationSettings = null;

      if (emailSettings) {
        try {
          const settings = JSON.parse(emailSettings);
          emailTemplate = settings.confirmationTemplate;
          senderEmail = settings.senderEmail || senderEmail;
          
          // Prepare admin notification settings
          if (settings.adminNotificationsEnabled && settings.adminEmail) {
            adminNotificationSettings = {
              adminEmail: settings.adminEmail,
              adminTemplate: settings.adminNotificationTemplate
            };
          }
          console.log('Email settings parsed successfully');
        } catch (parseError) {
          console.error('Error parsing email settings:', parseError);
        }
      }

      console.log('Attempting to send confirmation email...');
      console.log('Email payload:', { 
        bookingData, 
        emailTemplate, 
        senderEmail, 
        adminNotificationSettings 
      });

      // Send email confirmation
      const { data, error } = await supabase.functions.invoke('send-booking-confirmation', {
        body: {
          bookingData,
          emailTemplate,
          senderEmail,
          adminNotificationSettings
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        // Don't throw error for email failure, booking is already saved
        console.warn('Email sending failed, but booking was saved successfully');
      } else {
        console.log('Email sent successfully:', data);
      }

      console.log('=== BOOKING SUBMISSION SUCCESS ===');
      toast.success("Rezervácia bola úspešne vytvorená! Potvrdenie sme Vám poslali na email.");
      return true;

    } catch (error) {
      console.error('=== BOOKING SUBMISSION ERROR ===');
      console.error("Error details:", error);
      console.error("Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      
      toast.error("Chyba pri vytváraní rezervácie. Skúste to prosím znovu.");
      return false;
    } finally {
      setIsSubmitting(false);
      console.log('=== BOOKING SUBMISSION END ===');
    }
  };

  return { submitBooking, isSubmitting };
};
