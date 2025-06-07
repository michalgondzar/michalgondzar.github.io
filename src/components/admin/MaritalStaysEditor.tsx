
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save } from "lucide-react";
import { MaritalStaysBasicInfo } from "./marital-stays/MaritalStaysBasicInfo";
import { MaritalStayImageCard } from "./marital-stays/MaritalStayImageCard";
import { MaritalStayAddForm } from "./marital-stays/MaritalStayAddForm";
import { useMaritalStaysContent } from "./marital-stays/hooks/useMaritalStaysContent";

export const MaritalStaysEditor = () => {
  const {
    content,
    isLoading,
    updateContent,
    addImage,
    removeImage,
    updateImage,
    saveContent
  } = useMaritalStaysContent();

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p>Načítavam editor tematických pobytov...</p>
      </div>
    );
  }

  const maxImageId = Math.max(...content.images.map(img => img.id));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Upraviť sekciu tematických pobytov</h2>
      
      <div className="space-y-6">
        <MaritalStaysBasicInfo content={content} onUpdate={updateContent} />
        
        <div>
          <Label>Tematické pobyty</Label>
          <div className="space-y-4 mt-2">
            {content.images.map((image) => (
              <MaritalStayImageCard
                key={image.id}
                image={image}
                onUpdate={updateImage}
                onRemove={removeImage}
              />
            ))}
            
            <MaritalStayAddForm onAdd={addImage} maxId={maxImageId} />
          </div>
        </div>
        
        <Button 
          onClick={saveContent}
          className="bg-booking-primary hover:bg-booking-secondary flex gap-2"
        >
          <Save size={16} />
          Uložiť zmeny tematických pobytov
        </Button>
      </div>
    </div>
  );
};
