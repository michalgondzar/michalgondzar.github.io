
// Utility na parsovanie iCal dát
export interface ICalEvent {
  summary: string;
  dtstart: string;
  dtend: string;
  uid: string;
}

export const parseICalData = (icalData: string): ICalEvent[] => {
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

export const convertICalDateToLocalDate = (icalDate: string): string => {
  // iCal môže mať rôzne formáty dátumov
  if (icalDate.includes('T')) {
    // Formát s časom: 20231225T120000Z
    const dateOnly = icalDate.split('T')[0];
    return `${dateOnly.substring(0, 4)}-${dateOnly.substring(4, 6)}-${dateOnly.substring(6, 8)}`;
  } else if (icalDate.length === 8) {
    // Formát iba dátum: 20231225
    return `${icalDate.substring(0, 4)}-${icalDate.substring(4, 6)}-${icalDate.substring(6, 8)}`;
  }
  return icalDate;
};

export const getDatesInRange = (startDate: string, endDate: string): string[] => {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Pre jednodňové udalosti
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
