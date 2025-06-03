
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useVisitTracker = (pageUrl: string) => {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        // Zaznamenanie návštevy
        await supabase.from('page_visits').insert({
          page_url: pageUrl,
          visitor_ip: null, // Môžeme nechať null, keďže IP sa ťažko získava na frontende
          user_agent: navigator.userAgent,
          referrer: document.referrer || null
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
