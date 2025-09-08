
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Euro, Save, Tag } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CouponManager } from "./CouponManager";

export const PricingEditor = () => {
  const [pricing, setPricing] = useState({
    lowSeason: {
      weekday: "45",
      weekend: "55"
    },
    highSeason: {
      weekday: "65", 
      weekend: "75"
    },
    cleaningFee: "25",
    touristTax: "1.50"
  });

  const [loading, setLoading] = useState(false);

  // Load pricing data from Supabase on component mount
  useEffect(() => {
    loadPricingFromDatabase();
  }, []);

  const loadPricingFromDatabase = async () => {
    try {
      console.log('PricingEditor: Loading pricing from Supabase');
      
      const { data, error } = await supabase
        .from('pricing')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('PricingEditor: Error loading pricing from Supabase:', error);
        return;
      }

      if (data) {
        console.log('PricingEditor: Successfully loaded pricing from Supabase:', data);
        setPricing({
          lowSeason: {
            weekday: data.low_season_weekday,
            weekend: data.low_season_weekend
          },
          highSeason: {
            weekday: data.high_season_weekday,
            weekend: data.high_season_weekend
          },
          cleaningFee: data.cleaning_fee,
          touristTax: data.tourist_tax
        });
      }
    } catch (error) {
      console.error('PricingEditor: Error loading pricing:', error);
      toast.error("Chyba pri načítavaní cenníka");
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      console.log('PricingEditor: Saving pricing to Supabase:', pricing);
      
      const { error } = await supabase
        .from('pricing')
        .update({
          low_season_weekday: pricing.lowSeason.weekday,
          low_season_weekend: pricing.lowSeason.weekend,
          high_season_weekday: pricing.highSeason.weekday,
          high_season_weekend: pricing.highSeason.weekend,
          cleaning_fee: pricing.cleaningFee,
          tourist_tax: pricing.touristTax
        })
        .eq('id', 1);

      if (error) {
        console.error('PricingEditor: Error saving pricing to Supabase:', error);
        toast.error("Chyba pri ukladaní cenníka");
        return;
      }

      console.log('PricingEditor: Successfully saved pricing to Supabase');
      toast.success("Cenník bol úspešne uložený");
    } catch (error) {
      console.error('PricingEditor: Error saving pricing:', error);
      toast.error("Chyba pri ukladaní cenníka");
    } finally {
      setLoading(false);
    }
  };

  const updatePrice = (season: 'lowSeason' | 'highSeason', type: 'weekday' | 'weekend', value: string) => {
    setPricing(prev => ({
      ...prev,
      [season]: {
        ...prev[season],
        [type]: value
      }
    }));
  };

  const updateFee = (type: 'cleaningFee' | 'touristTax', value: string) => {
    setPricing(prev => ({
      ...prev,
      [type]: value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Euro className="h-6 w-6 text-green-600" />
        <h2 className="text-2xl font-bold">Správa cenníka a kupónov</h2>
      </div>

      <Tabs defaultValue="pricing" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <Euro className="h-4 w-4" />
            Cenník
          </TabsTrigger>
          <TabsTrigger value="coupons" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Kupóny
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="pricing" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nízka sezóna */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Nízka sezóna</CardTitle>
                <CardDescription>Ceny pre nízku sezónu (september - jún)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="low-weekday">Pracovný deň (€/noc)</Label>
                  <Input
                    id="low-weekday"
                    type="number"
                    value={pricing.lowSeason.weekday}
                    onChange={(e) => updatePrice('lowSeason', 'weekday', e.target.value)}
                    placeholder="45"
                  />
                </div>
                <div>
                  <Label htmlFor="low-weekend">Víkend (€/noc)</Label>
                  <Input
                    id="low-weekend"
                    type="number"
                    value={pricing.lowSeason.weekend}
                    onChange={(e) => updatePrice('lowSeason', 'weekend', e.target.value)}
                    placeholder="55"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Vysoká sezóna */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Vysoká sezóna</CardTitle>
                <CardDescription>Ceny pre vysokú sezónu (júl - august)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="high-weekday">Pracovný deň (€/noc)</Label>
                  <Input
                    id="high-weekday"
                    type="number"
                    value={pricing.highSeason.weekday}
                    onChange={(e) => updatePrice('highSeason', 'weekday', e.target.value)}
                    placeholder="65"
                  />
                </div>
                <div>
                  <Label htmlFor="high-weekend">Víkend (€/noc)</Label>
                  <Input
                    id="high-weekend"
                    type="number"
                    value={pricing.highSeason.weekend}
                    onChange={(e) => updatePrice('highSeason', 'weekend', e.target.value)}
                    placeholder="75"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dodatočné poplatky */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Dodatočné poplatky</CardTitle>
              <CardDescription>Ostatné poplatky a služby</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tourist-tax">Pobytová daň na osobu/noc (€)</Label>
                <Input
                  id="tourist-tax"
                  type="number"
                  step="0.01"
                  value={pricing.touristTax}
                  onChange={(e) => updateFee('touristTax', e.target.value)}
                  placeholder="1.50"
                />
              </div>
            </CardContent>
          </Card>

          {/* Uložiť */}
          <div className="flex justify-end">
            <Button 
              onClick={handleSave} 
              className="bg-green-600 hover:bg-green-700"
              disabled={loading}
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? "Ukladám..." : "Uložiť cenník"}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="coupons">
          <CouponManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
