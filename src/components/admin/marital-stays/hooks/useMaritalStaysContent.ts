
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MaritalStayImage {
  id: number;
  src: string;
  alt: string;
  description: string;
}

interface MaritalStayContent {
  title: string;
  description: string;
  external_link: string;
  images: MaritalStayImage[];
}

const CORRECT_CONTENT: MaritalStayContent = {
  title: "Tematické pobyty",
  description: "Objavte naše špeciálne balíčky pobytov vytvorené pre páry a rodiny. Každý balíček obsahuje ubytovanie v našom apartmáne plus jedinečné zážitky v regióne Liptov.",
  external_link: "https://www.manzelkepobyty.sk",
  images: [
    {
      id: 1,
      src: "/lovable-uploads/6dcee98c-9685-4fd8-94e6-6b9e4a7b2f5c.png",
      alt: "Manželský pobyt",
      description: "Romantický pobyt pre dvoch. Balíček obsahuje 2 noci v apartmáne, raňajky, romantickú večeru, masáže pre dvoch a vstupy do aquaparku. Ideálny pre mladomanželov alebo páry oslavujúce výročie."
    },
    {
      id: 2,
      src: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Rodinný pobyt",
      description: "Akčný rodinný pobyt plný dobrodružstv pre celú rodinu. Obsahuje 3 noci v apartmáne, raňajky, vstupy do aquaparku, rafting na Váhu, návštevu Bojnického zámku a interaktívne workshopy pre deti. Program je prispôsobený rodinám s deťmi od 6 rokov."
    },
    {
      id: 3,
      src: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      alt: "Pobyt v komôrke",
      description: "Jedinečný pobyt v štýlovej komôrke pre tých, ktorí hľadajú niečo výnimočné. Obsahuje 1 noc v autenticky zariadenom priestore, raňajky, degustáciu miestnych špecialít a sprievodcu po historických miestach. Ideálne pre páry hľadajúce nekonvenčný zážitok."
    }
  ]
};

export const useMaritalStaysContent = () => {
  const [content, setContent] = useState<MaritalStayContent>(CORRECT_CONTENT);
  const [isLoading, setIsLoading] = useState(true);

  const loadContent = async () => {
    try {
      console.log('Loading marital stays content...');
      setIsLoading(true);
      
      // Vždy použiť správny obsah
      setContent(CORRECT_CONTENT);
      
      // Pokús načítať z databázy, ale vždy použiť správnu fotku
      const { data, error } = await supabase
        .from('marital_stays_content')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (data && !error) {
        console.log('Loaded from database, applying correct photo');
        const images = Array.isArray(data.images) 
          ? (data.images as unknown as MaritalStayImage[])
          : CORRECT_CONTENT.images;
        
        // Vždy nahradiť prvý obrázok správnou fotkou
        const correctedImages = images.map((img, index) => 
          index === 0 ? CORRECT_CONTENT.images[0] : img
        );
        
        const correctedContent: MaritalStayContent = {
          title: data.title || CORRECT_CONTENT.title,
          description: data.description || CORRECT_CONTENT.description,
          external_link: data.external_link || CORRECT_CONTENT.external_link,
          images: correctedImages
        };
        setContent(correctedContent);
      }
    } catch (error) {
      console.error('Error loading content:', error);
      setContent(CORRECT_CONTENT);
    } finally {
      setIsLoading(false);
    }
  };

  const saveContent = async () => {
    try {
      console.log('Saving content with correct photo:', content);
      
      const { error } = await supabase
        .from('marital_stays_content')
        .upsert({
          id: 1,
          title: content.title,
          description: content.description,
          external_link: content.external_link,
          images: content.images as any,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Error saving content:', error);
        toast.error("Chyba pri ukladaní obsahu do databázy");
        return;
      }

      console.log('Successfully saved content with correct photo');
      
      window.dispatchEvent(new CustomEvent('maritalStaysContentUpdated'));
      toast.success("Sekcia tematických pobytov bola úspešne uložená do databázy");
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error("Chyba pri ukladaní obsahu");
    }
  };

  const updateContent = (updates: Partial<MaritalStayContent>) => {
    setContent(prev => ({ ...prev, ...updates }));
  };

  const addImage = (newImage: Omit<MaritalStayImage, 'id'>) => {
    const newImageWithId: MaritalStayImage = {
      id: Math.max(...content.images.map(img => img.id)) + 1,
      ...newImage
    };
    setContent(prev => ({
      ...prev,
      images: [...prev.images, newImageWithId]
    }));
    toast.success("Tematický pobyt bol pridaný");
  };

  const removeImage = (imageId: number) => {
    setContent(prev => ({
      ...prev,
      images: prev.images.filter(img => img.id !== imageId)
    }));
    toast.success("Tematický pobyt bol odstránený");
  };

  const updateImage = (imageId: number, field: 'src' | 'alt' | 'description', value: string) => {
    setContent(prev => ({
      ...prev,
      images: prev.images.map(img => 
        img.id === imageId ? { ...img, [field]: value } : img
      )
    }));
  };

  useEffect(() => {
    loadContent();
  }, []);

  useEffect(() => {
    const handleContentUpdate = () => {
      console.log('Received update event, reloading...');
      loadContent();
    };

    window.addEventListener('maritalStaysContentUpdated', handleContentUpdate);
    
    return () => {
      window.removeEventListener('maritalStaysContentUpdated', handleContentUpdate);
    };
  }, []);

  return {
    content,
    isLoading,
    updateContent,
    addImage,
    removeImage,
    updateImage,
    saveContent
  };
};
