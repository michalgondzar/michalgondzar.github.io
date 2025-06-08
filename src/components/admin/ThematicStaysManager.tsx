
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Heart, Users, Coffee, Upload, Save, RefreshCw } from "lucide-react";
import { useOtherImagesManager } from "@/hooks/useOtherImagesManager";
import { useThematicStaysDatabase } from "@/hooks/useThematicStaysDatabase";

const ThematicStaysManager = () => {
  const { stays, loading, updateStay, refetch } = useThematicStaysDatabase();
  const [editingStay, setEditingStay] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const [formData, setFormData] = useState<{ [key: string]: any }>({});
  const { uploadImage } = useOtherImagesManager();

  const updateFormField = (stayId: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [`${stayId}_${field}`]: value
    }));
  };

  const getFormValue = (stayId: string, field: string, defaultValue: any) => {
    return formData[`${stayId}_${field}`] !== undefined 
      ? formData[`${stayId}_${field}`] 
      : defaultValue;
  };

  const handleSaveStay = async (stay: any) => {
    try {
      const updates: any = {};
      
      const title = getFormValue(stay.stay_id, 'title', stay.title);
      const description = getFormValue(stay.stay_id, 'description', stay.description);
      const image = getFormValue(stay.stay_id, 'image', stay.image);
      const features = getFormValue(stay.stay_id, 'features', stay.features);

      if (title !== stay.title) updates.title = title;
      if (description !== stay.description) updates.description = description;
      if (image !== stay.image) updates.image = image;
      if (JSON.stringify(features) !== JSON.stringify(stay.features)) updates.features = features;

      if (Object.keys(updates).length > 0) {
        await updateStay(stay.stay_id, updates);
        
        // Clear form data for this stay
        Object.keys(formData).forEach(key => {
          if (key.startsWith(`${stay.stay_id}_`)) {
            setFormData(prev => {
              const newData = { ...prev };
              delete newData[key];
              return newData;
            });
          }
        });
        
        toast.success("Zmeny boli uložené a synchronizované na všetky zariadenia");
      } else {
        toast.info("Žiadne zmeny na uloženie");
      }
      
      setEditingStay(null);
    } catch (error) {
      console.error('Error saving stay:', error);
    }
  };

  const handleImageUpload = async (stayId: string, file: File) => {
    setUploadingImage(stayId);
    try {
      const success = await uploadImage(file, `Obrázok pre tematický pobyt`);
      if (success) {
        const savedImages = JSON.parse(localStorage.getItem('apartmentOtherImages') || '[]');
        const latestImage = savedImages[savedImages.length - 1];
        if (latestImage) {
          updateFormField(stayId, 'image', latestImage.src);
          toast.success("Obrázok bol nahraný");
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error("Chyba pri nahrávaní obrázka");
    } finally {
      setUploadingImage(null);
    }
  };

  const updateFeature = (stayId: string, featureIndex: number, value: string) => {
    const currentFeatures = getFormValue(stayId, 'features', stays.find(s => s.stay_id === stayId)?.features || []);
    const newFeatures = [...currentFeatures];
    newFeatures[featureIndex] = value;
    updateFormField(stayId, 'features', newFeatures);
  };

  const addFeature = (stayId: string) => {
    const currentFeatures = getFormValue(stayId, 'features', stays.find(s => s.stay_id === stayId)?.features || []);
    updateFormField(stayId, 'features', [...currentFeatures, "Nová vlastnosť"]);
  };

  const removeFeature = (stayId: string, featureIndex: number) => {
    const currentFeatures = getFormValue(stayId, 'features', stays.find(s => s.stay_id === stayId)?.features || []);
    const newFeatures = currentFeatures.filter((_: any, index: number) => index !== featureIndex);
    updateFormField(stayId, 'features', newFeatures);
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'Heart': return Heart;
      case 'Users': return Users;
      case 'Coffee': return Coffee;
      default: return Heart;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-lg">Načítavam tematické pobyty...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Tematické pobyty</h2>
          <p className="text-gray-600">Upravte texty a obrázky pre jednotlivé typy pobytov - zmeny sa automaticky synchronizujú na všetky zariadenia</p>
        </div>
        <Button onClick={refetch} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Obnoviť
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {stays.map((stay) => {
          const IconComponent = getIconComponent(stay.icon);
          const isEditing = editingStay === stay.stay_id;
          
          return (
            <Card key={stay.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5 text-blue-600" />
                    <CardTitle>{stay.title}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    {isEditing && (
                      <Button
                        onClick={() => handleSaveStay(stay)}
                        className="flex items-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Uložiť
                      </Button>
                    )}
                    <Button
                      variant={isEditing ? "secondary" : "outline"}
                      onClick={() => setEditingStay(isEditing ? null : stay.stay_id)}
                    >
                      {isEditing ? "Zrušiť" : "Upraviť"}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {isEditing ? (
                  <>
                    <div>
                      <Label htmlFor={`title-${stay.stay_id}`}>Názov</Label>
                      <Input
                        id={`title-${stay.stay_id}`}
                        value={getFormValue(stay.stay_id, 'title', stay.title)}
                        onChange={(e) => updateFormField(stay.stay_id, 'title', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor={`description-${stay.stay_id}`}>Popis</Label>
                      <Textarea
                        id={`description-${stay.stay_id}`}
                        value={getFormValue(stay.stay_id, 'description', stay.description)}
                        onChange={(e) => updateFormField(stay.stay_id, 'description', e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label>Obrázok</Label>
                      <div className="flex items-center gap-4">
                        <div className="relative w-32 h-24">
                          <img 
                            src={getFormValue(stay.stay_id, 'image', stay.image)} 
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
                                handleImageUpload(stay.stay_id, file);
                              }
                            }}
                            className="hidden"
                            id={`image-upload-${stay.stay_id}`}
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById(`image-upload-${stay.stay_id}`)?.click()}
                            disabled={uploadingImage === stay.stay_id}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadingImage === stay.stay_id ? "Nahráva..." : "Zmeniť obrázok"}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Vlastnosti</Label>
                      <div className="space-y-2">
                        {getFormValue(stay.stay_id, 'features', stay.features).map((feature: string, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={feature}
                              onChange={(e) => updateFeature(stay.stay_id, index, e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeFeature(stay.stay_id, index)}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => addFeature(stay.stay_id)}
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
