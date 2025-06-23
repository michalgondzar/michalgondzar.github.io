
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormLabel } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Save, Search, Globe, Share2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SeoPreview } from "./SeoPreview";

interface SeoSettings {
  page_title: string;
  meta_description: string;
  meta_keywords: string;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title: string;
  twitter_description: string;
  canonical_url: string;
  structured_data: string;
}

export const SeoManager = () => {
  const [seoSettings, setSeoSettings] = useState<SeoSettings>({
    page_title: "Apartmán Tília - Bešeňová",
    meta_description: "Apartmán Tília v Bešeňovej - ubytovanie v blízkosti aquaparku Bešeňová.",
    meta_keywords: "apartmán, Bešeňová, ubytovanie, aquapark, Liptov",
    og_title: "Apartmán Tília - Bešeňová",
    og_description: "Apartmán Tília v Bešeňovej - ubytovanie v blízkosti aquaparku Bešeňová.",
    og_image: "https://lovable.dev/opengraph-image-p98pqg.png",
    twitter_title: "Apartmán Tília - Bešeňová",
    twitter_description: "Apartmán Tília v Bešeňovej - ubytovanie v blízkosti aquaparku Bešeňová.",
    canonical_url: "https://apartman-tilia.lovable.app",
    structured_data: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadSeoSettings();
  }, []);

  const loadSeoSettings = async () => {
    try {
      console.log('SeoManager: Loading SEO settings from Supabase');
      
      const { data, error } = await supabase
        .from('seo_settings')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (error) {
        console.error('SeoManager: Error loading SEO settings:', error);
        return;
      }

      if (data) {
        console.log('SeoManager: Successfully loaded SEO settings:', data);
        setSeoSettings({
          page_title: data.page_title,
          meta_description: data.meta_description,
          meta_keywords: data.meta_keywords,
          og_title: data.og_title,
          og_description: data.og_description,
          og_image: data.og_image,
          twitter_title: data.twitter_title,
          twitter_description: data.twitter_description,
          canonical_url: data.canonical_url,
          structured_data: data.structured_data
        });
      }
    } catch (error) {
      console.error('SeoManager: Error loading SEO settings:', error);
    }
  };

  const saveSeoSettings = async () => {
    setIsLoading(true);
    try {
      console.log('SeoManager: Saving SEO settings to Supabase:', seoSettings);
      
      const { error } = await supabase
        .from('seo_settings')
        .upsert({
          id: 1,
          ...seoSettings,
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('SeoManager: Error saving SEO settings:', error);
        toast.error("Chyba pri ukladaní SEO nastavení");
        return;
      }

      console.log('SeoManager: Successfully saved SEO settings');
      
      // Update the page meta tags dynamically
      updatePageMetaTags();
      
      toast.success("SEO nastavenia boli úspešne uložené");
    } catch (error) {
      console.error('SeoManager: Error saving SEO settings:', error);
      toast.error("Chyba pri ukladaní SEO nastavení");
    } finally {
      setIsLoading(false);
    }
  };

  const updatePageMetaTags = () => {
    // Update page title
    document.title = seoSettings.page_title;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', seoSettings.meta_description);
    }
    
    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', seoSettings.og_title);
    }
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', seoSettings.og_description);
    }
    
    // Update keywords if exists
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords && seoSettings.meta_keywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    if (metaKeywords) {
      metaKeywords.setAttribute('content', seoSettings.meta_keywords);
    }

    // Update JSON-LD structured data
    if (seoSettings.structured_data) {
      const structuredDataScript = document.getElementById('structured-data');
      if (structuredDataScript) {
        try {
          // Validate JSON before inserting
          JSON.parse(seoSettings.structured_data);
          structuredDataScript.textContent = seoSettings.structured_data;
        } catch (error) {
          console.error('Invalid JSON-LD data:', error);
        }
      }
    }
  };

  const generateStructuredData = () => {
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "LodgingBusiness",
      "name": "Apartmán Tília",
      "description": seoSettings.meta_description,
      "url": seoSettings.canonical_url,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Bešeňová",
        "addressCountry": "SK"
      },
      "amenityFeature": [
        {
          "@type": "LocationFeatureSpecification",
          "name": "Aquapark nearby"
        }
      ]
    };
    
    setSeoSettings({
      ...seoSettings,
      structured_data: JSON.stringify(structuredData, null, 2)
    });
    
    toast.success("Štruktúrované dáta boli vygenerované");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SEO Form */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Search className="h-5 w-5 text-blue-600" />
                Základné SEO
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Title, description, keywords</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Share2 className="h-5 w-5 text-green-600" />
                Social Media
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Open Graph, Twitter Cards</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Globe className="h-5 w-5 text-purple-600" />
                Štruktúra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">JSON-LD, canonical URL</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>SEO Optimalizácia</CardTitle>
            <CardDescription>
              Upravte SEO nastavenia pre lepšie vyhľadávanie a zdieľanie na sociálnych sieťach
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Základné SEO */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Search className="h-5 w-5 text-blue-600" />
                Základné SEO
              </h3>
              
              <div>
                <FormLabel>Názov stránky (Title Tag)</FormLabel>
                <Input 
                  value={seoSettings.page_title} 
                  onChange={(e) => setSeoSettings({...seoSettings, page_title: e.target.value})}
                  placeholder="Apartmán Tília - Bešeňová"
                />
                <p className="text-sm text-gray-500 mt-1">Odporúčaná dĺžka: 50-60 znakov</p>
              </div>
              
              <div>
                <FormLabel>Meta popis</FormLabel>
                <Textarea 
                  value={seoSettings.meta_description}
                  onChange={(e) => setSeoSettings({...seoSettings, meta_description: e.target.value})}
                  placeholder="Popis apartmánu pre vyhľadávače..."
                  rows={3}
                />
                <p className="text-sm text-gray-500 mt-1">Odporúčaná dĺžka: 150-160 znakov</p>
              </div>
              
              <div>
                <FormLabel>Kľúčové slová (Keywords)</FormLabel>
                <Input 
                  value={seoSettings.meta_keywords}
                  onChange={(e) => setSeoSettings({...seoSettings, meta_keywords: e.target.value})}
                  placeholder="apartmán, Bešeňová, ubytovanie, aquapark"
                />
                <p className="text-sm text-gray-500 mt-1">Oddeľte čiarkami</p>
              </div>
            </div>

            {/* Open Graph / Facebook */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-600" />
                Facebook / Open Graph
              </h3>
              
              <div>
                <FormLabel>OG Titulok</FormLabel>
                <Input 
                  value={seoSettings.og_title}
                  onChange={(e) => setSeoSettings({...seoSettings, og_title: e.target.value})}
                  placeholder="Titulok pre Facebook"
                />
              </div>
              
              <div>
                <FormLabel>OG Popis</FormLabel>
                <Textarea 
                  value={seoSettings.og_description}
                  onChange={(e) => setSeoSettings({...seoSettings, og_description: e.target.value})}
                  placeholder="Popis pre Facebook zdieľanie..."
                  rows={2}
                />
              </div>
              
              <div>
                <FormLabel>OG Obrázok URL</FormLabel>
                <Input 
                  value={seoSettings.og_image}
                  onChange={(e) => setSeoSettings({...seoSettings, og_image: e.target.value})}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            {/* Twitter */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Share2 className="h-5 w-5 text-blue-400" />
                Twitter Cards
              </h3>
              
              <div>
                <FormLabel>Twitter Titulok</FormLabel>
                <Input 
                  value={seoSettings.twitter_title}
                  onChange={(e) => setSeoSettings({...seoSettings, twitter_title: e.target.value})}
                  placeholder="Titulok pre Twitter"
                />
              </div>
              
              <div>
                <FormLabel>Twitter Popis</FormLabel>
                <Textarea 
                  value={seoSettings.twitter_description}
                  onChange={(e) => setSeoSettings({...seoSettings, twitter_description: e.target.value})}
                  placeholder="Popis pre Twitter zdieľanie..."
                  rows={2}
                />
              </div>
            </div>

            {/* Štruktúrované dáta */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-600" />
                Pokročilé nastavenia
              </h3>
              
              <div>
                <FormLabel>Canonical URL</FormLabel>
                <Input 
                  value={seoSettings.canonical_url}
                  onChange={(e) => setSeoSettings({...seoSettings, canonical_url: e.target.value})}
                  placeholder="https://apartman-tilia.sk"
                />
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <FormLabel>Štruktúrované dáta (JSON-LD)</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={generateStructuredData}
                  >
                    Generovať automaticky
                  </Button>
                </div>
                <Textarea 
                  value={seoSettings.structured_data}
                  onChange={(e) => setSeoSettings({...seoSettings, structured_data: e.target.value})}
                  placeholder='{"@context": "https://schema.org", ...}'
                  rows={6}
                  className="font-mono text-sm"
                />
              </div>
            </div>

            <Button 
              onClick={saveSeoSettings}
              disabled={isLoading}
              className="w-full bg-booking-primary hover:bg-booking-secondary flex gap-2"
            >
              <Save size={16} />
              {isLoading ? "Ukladám..." : "Uložiť SEO nastavenia"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* SEO Preview */}
      <div className="lg:sticky lg:top-6 lg:h-fit">
        <SeoPreview seoSettings={seoSettings} />
      </div>
    </div>
  );
};
