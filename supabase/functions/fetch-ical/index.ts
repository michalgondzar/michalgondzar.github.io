
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// iCal parsing utilities
interface ICalEvent {
  summary: string;
  dtstart: string;
  dtend: string;
  uid: string;
}

const parseICalData = (icalData: string): ICalEvent[] => {
  const events: ICalEvent[] = [];
  const lines = icalData.split('\n').map(line => line.trim());
  
  let currentEvent: Partial<ICalEvent> = {};
  let inEvent = false;
  
  for (const line of lines) {
    if (line === 'BEGIN:VEVENT') {
      inEvent = true;
      currentEvent = {};
    } else if (line === 'END:VEVENT' && inEvent) {
      if (currentEvent.dtstart && currentEvent.dtend) {
        events.push(currentEvent as ICalEvent);
      }
      inEvent = false;
    } else if (inEvent) {
      if (line.startsWith('SUMMARY:')) {
        currentEvent.summary = line.substring(8);
      } else if (line.startsWith('DTSTART')) {
        const value = line.includes(':') ? line.split(':')[1] : '';
        currentEvent.dtstart = value;
      } else if (line.startsWith('DTEND')) {
        const value = line.includes(':') ? line.split(':')[1] : '';
        currentEvent.dtend = value;
      } else if (line.startsWith('UID:')) {
        currentEvent.uid = line.substring(4);
      }
    }
  }
  
  return events;
};

const convertICalDateToLocalDate = (icalDate: string): string => {
  if (icalDate.includes('T')) {
    const dateOnly = icalDate.split('T')[0];
    return `${dateOnly.substring(0, 4)}-${dateOnly.substring(4, 6)}-${dateOnly.substring(6, 8)}`;
  } else if (icalDate.length === 8) {
    return `${icalDate.substring(0, 4)}-${icalDate.substring(4, 6)}-${icalDate.substring(6, 8)}`;
  }
  return icalDate;
};

const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.getTime() === end.getTime()) {
    dates.push(startDate);
    return dates;
  }
  
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url, auto_sync } = await req.json()
    
    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL je povinné' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Fetching iCal data from:', url, auto_sync ? '(auto sync)' : '(manual sync)')
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; iCal-Sync/1.0)'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const icalData = await response.text()
    console.log('Successfully fetched iCal data, length:', icalData.length)

    // If this is an auto sync, process the data and update the database
    if (auto_sync) {
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      // Parse iCal data
      const events = parseICalData(icalData);
      console.log('Parsed events for auto sync:', events.length);
      
      if (events.length > 0) {
        // Convert events to availability updates
        const availabilityUpdates: Array<{ date: string; is_available: boolean }> = [];
        
        events.forEach(event => {
          const startDate = convertICalDateToLocalDate(event.dtstart);
          const endDate = convertICalDateToLocalDate(event.dtend);
          
          const datesInRange = getDatesInRange(startDate, endDate);
          
          datesInRange.forEach(date => {
            availabilityUpdates.push({
              date,
              is_available: false
            });
          });
        });

        console.log('Auto sync - availability updates:', availabilityUpdates.length);

        // Update database
        if (availabilityUpdates.length > 0) {
          const { error: dbError } = await supabase
            .from('availability_calendar')
            .upsert(availabilityUpdates, {
              onConflict: 'date'
            });

          if (dbError) {
            console.error('Auto sync - error updating availability:', dbError);
            throw new Error('Chyba pri aktualizácii dostupnosti');
          }

          console.log(`Auto sync completed - updated ${availabilityUpdates.length} dates`);
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: `Auto sync completed - processed ${events.length} events`,
          updated_dates: events.length > 0 ? availabilityUpdates?.length || 0 : 0
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // For manual sync, just return the data
    return new Response(
      JSON.stringify({ data: icalData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  } catch (error) {
    console.error('Error in iCal sync:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Chyba pri synchronizácii iCal dát',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
