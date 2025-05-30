
// Google Calendar API konfigurácia
const GOOGLE_CALENDAR_API_KEY = import.meta.env.VITE_GOOGLE_CALENDAR_API_KEY;
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

interface GoogleCalendarEvent {
  summary: string;
  start: {
    date: string;
  };
  end: {
    date: string;
  };
  description?: string;
}

export class GoogleCalendarService {
  private gapi: any = null;
  private isInitialized = false;

  async initializeGapi(): Promise<boolean> {
    try {
      // Načítame Google API script ak nie je načítaný
      if (!window.gapi) {
        await this.loadGapiScript();
      }

      this.gapi = window.gapi;
      
      // Inicializujeme gapi
      await new Promise((resolve) => {
        this.gapi.load('client:auth2', resolve);
      });

      // Inicializujeme klienta
      await this.gapi.client.init({
        apiKey: GOOGLE_CALENDAR_API_KEY,
        clientId: GOOGLE_CLIENT_ID,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES
      });

      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Chyba pri inicializácii Google API:', error);
      return false;
    }
  }

  private loadGapiScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Nepodarilo sa načítať Google API script'));
      document.head.appendChild(script);
    });
  }

  async signIn(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initializeGapi();
        if (!initialized) return false;
      }

      const authInstance = this.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      
      return user.isSignedIn();
    } catch (error) {
      console.error('Chyba pri prihlasovaní do Google:', error);
      return false;
    }
  }

  async signOut(): Promise<void> {
    if (this.isInitialized) {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
    }
  }

  isSignedIn(): boolean {
    if (!this.isInitialized) return false;
    const authInstance = this.gapi.auth2.getAuthInstance();
    return authInstance.isSignedIn.get();
  }

  async createEvent(event: GoogleCalendarEvent): Promise<boolean> {
    try {
      if (!this.isSignedIn()) {
        throw new Error('Používateľ nie je prihlásený');
      }

      const response = await this.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      return response.status === 200;
    } catch (error) {
      console.error('Chyba pri vytváraní udalosti:', error);
      return false;
    }
  }

  async syncBookings(bookings: any[]): Promise<boolean> {
    try {
      if (!this.isSignedIn()) {
        throw new Error('Používateľ nie je prihlásený');
      }

      for (const booking of bookings) {
        const event: GoogleCalendarEvent = {
          summary: `Rezervácia - ${booking.name}`,
          start: { date: booking.dateFrom },
          end: { date: booking.dateTo },
          description: `Rezervácia pre ${booking.guests} hostí\nEmail: ${booking.email}\nStav: ${booking.status}`
        };

        await this.createEvent(event);
      }

      return true;
    } catch (error) {
      console.error('Chyba pri synchronizácii rezervácií:', error);
      return false;
    }
  }
}

// Singleton instance
export const googleCalendarService = new GoogleCalendarService();

// Globálny typ pre window.gapi
declare global {
  interface Window {
    gapi: any;
  }
}
