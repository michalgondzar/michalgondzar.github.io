
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitTracker = (pageUrl: string) => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        let country = null;
        
        // Pokúsime sa získať krajinu z IP adresy
        try {
          const response = await fetch('https://ipapi.co/json/');
          if (response.ok) {
            const data = await response.json();
            country = data.country_name || null;
          }
        } catch (ipError) {
          console.log('Could not detect country:', ipError);
        }

        // Kontrola, či je používateľ admin
        const isAdmin = localStorage.getItem("adminToken") ? true : false;

        // Zaznamenanie návštevy s krajinou a admin informáciou
        await supabase.from('page_visits').insert({
          page_url: pageUrl,
          visitor_ip: null, // Môžeme nechať null, keďže IP sa ťažko získava na frontende
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          country: country,
          is_admin: isAdmin
        });

        // Inkrementácia celkového počítadla
        await supabase.rpc('increment_visit_counter');
      } catch (error) {
        console.error('Error tracking visit:', error);
      }
    };

    trackVisit();
  }, [pageUrl]);
};
