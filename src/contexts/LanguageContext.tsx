
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'sk' | 'pl';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  sk: {
    // Navigation
    'nav.accommodation': 'Ubytovanie',
    'nav.gallery': 'Galéria',
    'nav.booking': 'Rezervácia',
    'nav.contact': 'Kontakt',
    
    // Hero section
    'hero.title': 'Apartmán Tília',
    'hero.subtitle': 'Bešeňová',
    'hero.description': 'Luxusné ubytovanie v srdci Liptova s výhľadom na Tatry',
    'hero.book': 'Rezervovať pobyt',
    'hero.gallery': 'Prezrieť galériu',
    'hero.stay': 'Príjemné ubytovanie v blízkosti aquaparku Bešeňová',
    
    // Promo banner
    'promo.summer': 'LETNÁ AKCIA',
    'promo.weekly': 'Týždenný pobyt len za',
    'promo.code': 'Stačí ak pri rezervácií zadáte kód',
    'promo.valid': 'Akcia platí do konca augusta 2025',
    
    // Description
    'description.title': 'O apartmáne',
    'description.subtitle': 'Moderné ubytovanie s kompletným vybavením',
    
    // Thematic stays
    'stays.title': 'Tematické pobyty',
    'stays.subtitle': 'Vyberte si z našich špeciálnych balíčkov',
    
    // Gallery
    'gallery.title': 'Galéria',
    'gallery.subtitle': 'Pozrite si fotografie nášho apartmánu',
    
    // Booking section
    'booking.title': 'Rezervácia',
    'booking.subtitle': 'Rezervujte si váš pobyt v apartmáne Tília',
    
    // Booking form
    'form.name': 'Meno',
    'form.name.placeholder': 'Meno hosťa',
    'form.email': 'Email',
    'form.email.placeholder': 'email@example.com',
    'form.dateFrom': 'Dátum od',
    'form.dateTo': 'Dátum do',
    'form.guests': 'Počet hostí',
    'form.stayType': 'Typ pobytu',
    'form.stayType.placeholder': 'Vyberte typ pobytu',
    'form.stayType.marital': 'Manželský pobyt',
    'form.stayType.family': 'Rodinný pobyt',
    'form.stayType.room': 'Pobyt v komôrke',
    'form.coupon': 'Zľavový kupón',
    'form.coupon.placeholder': 'Kód kupónu (voliteľné)',
    'form.submit': 'Odoslať rezerváciu',
    
    // Pricing
    'pricing.title': 'Cenník',
    'pricing.night': 'noc',
    'pricing.person': 'osoba',
    'pricing.tax': 'Turistická daň',
    
    // Availability
    'availability.title': 'Dostupnosť',
    'availability.subtitle': 'Skontrolujte dostupné termíny',
    'availability.available': 'Voľné termíny',
    'availability.unavailable': 'Obsadené termíny',
    'availability.legend': 'Červenou farbou sú označené obsadené termíny. Ostatné termíny sú voľné.',
    
    // Contact
    'contact.title': 'Kontakt',
    'contact.subtitle': 'Spojte sa s nami',
    'contact.form.name': 'Vaše meno',
    'contact.form.email': 'Váš email',
    'contact.form.message': 'Správa',
    'contact.form.send': 'Odoslať správu',
    'contact.info.address': 'Adresa',
    'contact.info.phone': 'Telefón',
    'contact.info.email': 'Email',
    
    // Footer
    'footer.address': 'Bešeňová, Slovensko',
    'footer.rights': 'Všetky práva vyhradené',
    'footer.accommodation': 'Ubytovanie',
    'footer.description': 'Komfortné ubytovanie v blízkosti aquaparku Bešeňová pre váš dokonalý oddych.',
    'footer.navigation': 'Navigácia',
    'footer.contact': 'Kontakt',
    'footer.payment': 'Platobné možnosti',
    'footer.cash': 'Hotovosť',
    'footer.transfer': 'Bankový prevod',
    'footer.admin': 'Vstup pre admina',
    
    // Common
    'common.loading': 'Načítavam...',
    'common.error': 'Chyba',
    'common.success': 'Úspech',
    'common.save': 'Uložiť',
    'common.cancel': 'Zrušiť',
    'common.delete': 'Vymazať',
    'common.edit': 'Upraviť',
    'common.add': 'Pridať',
    'common.remove': 'Odstrániť',
  },
  pl: {
    // Navigation
    'nav.accommodation': 'Zakwaterowanie',
    'nav.gallery': 'Galeria',
    'nav.booking': 'Rezerwacja',
    'nav.contact': 'Kontakt',
    
    // Hero section
    'hero.title': 'Apartament Tília',
    'hero.subtitle': 'Bešeňová',
    'hero.description': 'Luksusowe zakwaterowanie w sercu Liptova z widokiem na Tatry',
    'hero.book': 'Zarezerwuj pobyt',
    'hero.gallery': 'Zobacz galerię',
    'hero.stay': 'Przyjemne zakwaterowanie w pobliżu aquaparku Bešeňová',
    
    // Promo banner
    'promo.summer': 'AKCJA LETNIA',
    'promo.weekly': 'Tygodniowy pobyt za tylko',
    'promo.code': 'Wystarczy wpisać kod przy rezerwacji',
    'promo.valid': 'Akcja obowiązuje do końca sierpnia 2025',
    
    // Description
    'description.title': 'O apartamencie',
    'description.subtitle': 'Nowoczesne zakwaterowanie z pełnym wyposażeniem',
    
    // Thematic stays
    'stays.title': 'Pobyty tematyczne',
    'stays.subtitle': 'Wybierz z naszych specjalnych pakietów',
    
    // Gallery
    'gallery.title': 'Galeria',
    'gallery.subtitle': 'Zobacz zdjęcia naszego apartamentu',
    
    // Booking section
    'booking.title': 'Rezerwacja',
    'booking.subtitle': 'Zarezerwuj swój pobyt w apartamencie Tília',
    
    // Booking form
    'form.name': 'Imię',
    'form.name.placeholder': 'Imię gościa',
    'form.email': 'Email',
    'form.email.placeholder': 'email@example.com',
    'form.dateFrom': 'Data od',
    'form.dateTo': 'Data do',
    'form.guests': 'Liczba gości',
    'form.stayType': 'Typ pobytu',
    'form.stayType.placeholder': 'Wybierz typ pobytu',
    'form.stayType.marital': 'Pobyt małżeński',
    'form.stayType.family': 'Pobyt rodzinny',
    'form.stayType.room': 'Pobyt w pokoju',
    'form.coupon': 'Kupon zniżkowy',
    'form.coupon.placeholder': 'Kod kuponu (opcjonalnie)',
    'form.submit': 'Wyślij rezerwację',
    
    // Pricing
    'pricing.title': 'Cennik',
    'pricing.night': 'noc',
    'pricing.person': 'osoba',
    'pricing.tax': 'Podatek turystyczny',
    
    // Availability
    'availability.title': 'Dostępność',
    'availability.subtitle': 'Sprawdź dostępne terminy',
    'availability.available': 'Dostępne terminy',
    'availability.unavailable': 'Zajęte terminy',
    'availability.legend': 'Czerwonym kolorem oznaczone są zajęte terminy. Pozostałe terminy są wolne.',
    
    // Contact
    'contact.title': 'Kontakt',
    'contact.subtitle': 'Skontaktuj się z nami',
    'contact.form.name': 'Twoje imię',
    'contact.form.email': 'Twój email',
    'contact.form.message': 'Wiadomość',
    'contact.form.send': 'Wyślij wiadomość',
    'contact.info.address': 'Adres',
    'contact.info.phone': 'Telefon',
    'contact.info.email': 'Email',
    
    // Footer
    'footer.address': 'Bešeňová, Słowacja',
    'footer.rights': 'Wszystkie prawa zastrzeżone',
    'footer.accommodation': 'Zakwaterowanie',
    'footer.description': 'Komfortowe zakwaterowanie w pobliżu aquaparku Bešeňová dla idealnego wypoczynku.',
    'footer.navigation': 'Nawigacja',
    'footer.contact': 'Kontakt',
    'footer.payment': 'Opcje płatności',
    'footer.cash': 'Gotówka',
    'footer.transfer': 'Przelew bankowy',
    'footer.admin': 'Wejście dla admina',
    
    // Common
    'common.loading': 'Ładowanie...',
    'common.error': 'Błąd',
    'common.success': 'Sukces',
    'common.save': 'Zapisz',
    'common.cancel': 'Anuluj',
    'common.delete': 'Usuń',
    'common.edit': 'Edytuj',
    'common.add': 'Dodaj',
    'common.remove': 'Usuń',
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'sk';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
