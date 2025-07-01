
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';

export const LanguageSelector = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1">
      <Button
        variant={language === 'sk' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('sk')}
        className="p-2 h-8 w-8"
        title="Slovenčina"
      >
        🇸🇰
      </Button>
      <Button
        variant={language === 'pl' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => setLanguage('pl')}
        className="p-2 h-8 w-8"
        title="Polski"
      >
        🇵🇱
      </Button>
    </div>
  );
};
