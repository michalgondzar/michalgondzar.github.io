import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Heart, Users, Coffee, Upload, Save } from "lucide-react";
import { useOtherImagesManager } from "@/hooks/useOtherImagesManager";

interface ThematicStay {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  features: string[];
}

const STORAGE_KEY = 'apartmentThematicStays';

const DEFAULT_STAYS: ThematicStay[] = [
  {
    id: "manzelsky",
    title: "Manželský pobyt",
    description: "Romantický pobyt pre páry s možnosťou relaxu a súkromia. Ideálny na oslavu výročia alebo jednoducho na strávenie kvalitného času spolu.",
    image: "/lovable-uploads/0b235c75-170d-4c29-b94b-ea1fc022003f.png",
    icon: "Heart",
    features: ["Romantická atmosféra", "Súkromie", "Relaxácia pre dvoch"]
  },
  {
    id: "rodinny",
    title: "Rodinný pobyt",
    description: "Pobyt vhodný pre celú rodinu s deťmi. Priestranný apartmán s pohodlným ubytovaním a blízkosťou k rodinným aktivitám.",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
    icon: "Users",
    features: ["Vhodné pre deti", "Priestranný apartmán", "Rodinné aktivity"]
  },
  {
    id: "komorka",
    title: "Pobyt v komôrke",
    description: "Exkluzívny a pokojný pobyt v tichej časti apartmánu. Ideálny pre tých, ktorí hľadajú úplné súkromie a relaxáciu.",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop",
    icon: "Coffee",
    features: ["Absolútne súkromie", "Tichá lokalita", "Relaxačná atmosféra"]
  }
];

const ThematicStaysManager = () => {
  const [stays, setStays] = useState<ThematicStay[]>(DEFAULT_STAYS);
  const [editingStay, setEditingStay] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const { uploadImage } = useOtherImagesManager();

  useEffect(() => {
    loadStays();
  }, []);

  const loadStays = () => {
    try {
      const savedStays = localStorage.getItem(STORAGE_KEY);
      if (savedStays) {
        const parsedStays = JSON.parse(savedStays);
        setStays(parsedStays);
        console.log('Loaded thematic stays:', parsedStays);
      } else {
        console.log('No saved thematic stays, using defaults');
        saveStays(DEFAULT_STAYS);
      }
    } catch (error) {
      console.error('Error loading thematic stays:', error);
      setStays(DEFAULT_STAYS);
    }
  };

  const saveStays = (updatedStays: ThematicStay[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStays));
      console.log('Saved thematic stays:', updatedStays);
      
      // Enhanced event triggering for better mobile support
      const customEvent = new CustomEvent('thematicStaysUpdated', { 
        detail: updatedStays,
        bubbles: true 
      });
      window.dispatchEvent(customEvent);
      
      // Force storage event for same-window updates
      const storageEvent = new StorageEvent('storage', {
        key: STORAGE_KEY,
        newValue: JSON.stringify(updatedStays),
        storageArea: localStorage
      });
      window.dispatchEvent(storageEvent);
      
      // Additional custom event for cross-component communication
      window.dispatchEvent(new Event('apartmentDataUpdated'));
      
      // Force page refresh on mobile devices for reliability
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        setTimeout(() => {
          console.log('Mobile device detected, forcing page refresh...');
          window.location.reload();
        }, 500);
      }
      
      toast.success("Tematické pobyty boli uložené");
    } catch (error) {
      console.error('Error saving thematic stays:', error);
      toast.error("Chyba pri ukladaní tematických pobytov");
    }
  };

  const updateStayField = (stayId: string, field: keyof ThematicStay, value: string | string[]) => {
    const updatedStays = stays.map(stay => 
      stay.id === stayId ? { ...stay, [field]: value } : stay
    );
    setStays(updatedStays);
  };

  const updateFeature = (stayId: string, featureIndex: number, value: string) => {
    const updatedStays = stays.map(stay => {
      if (stay.id === stayId) {
        const newFeatures = [...stay.features];
        newFeatures[featureIndex] = value;
        return { ...stay, features: newFeatures };
      }
      return stay;
    });
    setStays(updatedStays);
  };

  const addFeature = (stayId: string) => {
    const updatedStays = stays.map(stay => 
      stay.id === stayId ? { ...stay, features: [...stay.features, "Nová vlastnosť"] } : stay
    );
    setStays(updatedStays);
  };

  const removeFeature = (stayId: string, featureIndex: number) => {
    const updatedStays = stays.map(stay => {
      if (stay.id === stayId) {
        const newFeatures = stay.features.filter((_, index) => index !== featureIndex);
        return { ...stay, features: newFeatures };
      }
      return stay;
    });
    setStays(updatedStays);
  };

  const handleImageUpload = async (stayId: string, file: File) => {
    setUploadingImage(stayId);
    try {
      const success = await uploadImage(file, `Obrázok pre ${stays.find(s => s.id === stayId)?.title}`);
      if (success) {
        // Get the uploaded image URL and update the stay
        const savedImages = JSON.parse(localStorage.getItem('apartmentOtherImages') || '[]');
        const latestImage = savedImages[savedImages.length - 1];
        if (latestImage) {
          updateStayField(stayId, 'image', latestImage.src);
        }
        toast.success("Obrázok bol nahraný");
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Chyba pri nahrávaní obrázka");
    } finally {
      setUploadingImage(null);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return Heart;
      case 'Users': return Users;
      case 'Coffee': return Coffee;
      default: return Heart;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tematické pobyty</h2>
          <p className="text-gray-600">Upravte texty a obrázky pre jednotlivé typy pobytov</p>
        </div>
        <Button onClick={() => saveStays(stays)} className="flex items-center gap-2">
          <Save className="h-4 w-4" />
          Uložiť zmeny
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {stays.map((stay) => {
          const IconComponent = getIconComponent(stay.icon);
          const isEditing = editingStay === stay.id;
          
          return (
            <Card key={stay.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <CardTitle>{stay.title}</CardTitle>
                  </div>
                  <Button
                    variant={isEditing ? "default" : "outline"}
                    onClick={() => setEditingStay(isEditing ? null : stay.id)}
                  >
                    {isEditing ? "Zavrieť" : "Upraviť"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor={`title-${stay.id}`}>Názov</Label>
                      <Input
                        id={`title-${stay.id}`}
                        value={stay.title}
                        onChange={(e) => updateStayField(stay.id, 'title', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`description-${stay.id}`}>Popis</Label>
                      <Textarea
                        id={`description-${stay.id}`}
                        value={stay.description}
                        onChange={(e) => updateStayField(stay.id, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Obrázok</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-32 h-24">
                          <img 
                            src={stay.image} 
                            alt={stay.title}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                        <div>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleImageUpload(stay.id, file);
                              }
                            }}
                            className="hidden"
                            id={`image-upload-${stay.id}`}
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById(`image-upload-${stay.id}`)?.click()}
                            disabled={uploadingImage === stay.id}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingImage === stay.id ? "Nahráva..." : "Zmeniť obrázok"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Vlastnosti</Label>
                      <div className="space-y-2">
                        {stay.features.map((feature, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => updateFeature(stay.id, index, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFeature(stay.id, index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addFeature(stay.id)}
                        >
                          + Pridať vlastnosť
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-4">
                      <img 
                        src={stay.image} 
                        alt={stay.title}
                        className="w-32 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="text-gray-600 mb-2">{stay.description}</p>
                        <div className="space-y-1">
                          <h4 className="font-semibold text-sm text-gray-700">Vlastnosti:</h4>
                          <ul className="space-y-1">
                            {stay.features.map((feature, index) => (
                              <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0"></div>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ThematicStaysManager;
