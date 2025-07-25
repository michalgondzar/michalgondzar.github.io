
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash, FileImage, Replace, ExternalLink, RefreshCw } from "lucide-react";
import { ImageUploadDialog } from "./ImageUploadDialog";
import { useOtherImagesManager, OtherImage } from "@/hooks/useOtherImagesManager";

export const OtherImagesManager = () => {
  const [currentImage, setCurrentImage] = useState<OtherImage | null>(null);
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const {
    otherImages,
    isLoading,
    uploadImage,
    deleteImage,
    updateImageField,
    loadOtherImages,
    debugLocalStorage
  } = useOtherImagesManager();

  const openImageDialog = (image: OtherImage | null = null) => {
    setCurrentImage(image);
    setIsImageDialogOpen(true);
  };

  const closeImageDialog = () => {
    setIsImageDialogOpen(false);
    setCurrentImage(null);
  };

  const handleImageUpload = async (file: File, description?: string) => {
    return await uploadImage(file, description, currentImage);
  };

  // Funkcia na zobrazenie preview obrázka v novom okne
  const previewImage = (src: string) => {
    if (src) {
      window.open(src, '_blank');
    }
  };

  const handleRefresh = () => {
    console.log('Manual refresh triggered');
    debugLocalStorage();
    loadOtherImages();
  };

  const handleDebugClick = () => {
    console.log('Debug button clicked');
    debugLocalStorage();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileImage className="h-5 w-5 text-booking-primary" />
          <h3 className="text-lg font-semibold">Ostatné obrázky na stránke</h3>
          <span className="text-sm text-gray-500">({otherImages.length} obrázkov)</span>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            type="button"
          >
            <RefreshCw size={16} />
            Obnoviť
          </Button>
          <Button 
            onClick={() => openImageDialog()} 
            className="flex items-center gap-2"
            disabled={isLoading}
            type="button"
          >
            <Plus size={16} />
            Pridať obrázok
          </Button>
        </div>
      </div>

      {/* Debug info */}
      <div className="mb-4 p-3 bg-gray-100 rounded text-sm">
        <strong>Debug info:</strong> Načítané {otherImages.length} obrázkov z localStorage
        <Button 
          onClick={handleDebugClick} 
          variant="outline" 
          size="sm" 
          className="ml-2"
          type="button"
        >
          Zobraziť localStorage
        </Button>
      </div>

      {otherImages.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <FileImage size={48} className="mx-auto mb-4 opacity-50" />
          <p>Žiadne obrázky nie sú načítané.</p>
          <p className="text-sm mt-2">Skúste kliknúť na tlačidlo "Obnoviť" alebo "Zobraziť localStorage"</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {otherImages.map((image) => (
            <div key={image.id} className="relative group rounded-lg overflow-hidden shadow-md bg-gray-50 border-2 border-gray-200">
              {/* Zobrazenie stavu obrázka */}
              <div className="absolute top-2 left-2 z-10">
                {image.src ? (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Nastavený</span>
                ) : (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">Chýba</span>
                )}
              </div>

              {/* Preview obrázka alebo placeholder */}
              {image.src ? (
                <img 
                  src={image.src} 
                  alt={image.alt}
                  className="w-full h-32 object-cover group-hover:opacity-75 transition-opacity cursor-pointer"
                  onClick={() => previewImage(image.src)}
                  title="Kliknite pre zobrazenie v plnej veľkosti"
                />
              ) : (
                <div className="w-full h-32 bg-gray-300 flex items-center justify-center text-gray-500">
                  <FileImage size={32} />
                  <span className="ml-2 text-sm">Žiadny obrázok</span>
                </div>
              )}
              
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                <div className="flex gap-2">
                  {image.src && (
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={() => previewImage(image.src)}
                      title="Zobraziť v plnej veľkosti"
                      className="bg-white text-black hover:bg-gray-100"
                      type="button"
                    >
                      <ExternalLink size={16} />
                    </Button>
                  )}
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={() => openImageDialog(image)}
                    title="Nahradiť obrázok"
                    className="bg-white text-black hover:bg-gray-100"
                    type="button"
                  >
                    <Replace size={16} />
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => deleteImage(image.id)}
                    title="Odstrániť obrázok"
                    type="button"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="p-3 space-y-2">
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Názov</label>
                  <Input 
                    value={image.name}
                    onChange={(e) => updateImageField(image.id, 'name', e.target.value)}
                    placeholder="Názov obrázka"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Popis</label>
                  <Input 
                    value={image.alt}
                    onChange={(e) => updateImageField(image.id, 'alt', e.target.value)}
                    placeholder="Popis obrázka"
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">Použitie na stránke</label>
                  <Select 
                    value={image.usage}
                    onValueChange={(value) => updateImageField(image.id, 'usage', value)}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Vyberte použitie" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">Všeobecné</SelectItem>
                      <SelectItem value="hero-background">Hero pozadie</SelectItem>
                      <SelectItem value="about-section">Sekcia o nás</SelectItem>
                      <SelectItem value="contact-section">Kontaktná sekcia</SelectItem>
                      <SelectItem value="footer-background">Pozadie pätičky</SelectItem>
                      <SelectItem value="logo">Logo</SelectItem>
                      <SelectItem value="gallery-background">Pozadie galérie</SelectItem>
                      <SelectItem value="booking-section">Rezervačná sekcia</SelectItem>
                      <SelectItem value="apartment-exterior">Exteriér apartmánu</SelectItem>
                      <SelectItem value="apartment-interior">Interiér apartmánu</SelectItem>
                      <SelectItem value="aquapark-bešeňová">Aquapark Bešeňová</SelectItem>
                      <SelectItem value="location-map">Mapa lokality</SelectItem>
                      <SelectItem value="navbar-background">Navbar pozadie</SelectItem>
                      <SelectItem value="description-background">Popis pozadie</SelectItem>
                      <SelectItem value="marital-stays-background">Manželské pobyty pozadie</SelectItem>
                      <SelectItem value="gallery-hero">Galéria hero</SelectItem>
                      <SelectItem value="contact-hero">Kontakt hero</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Zobrazenie dodatočných informácií */}
                <div className="text-xs text-gray-500 space-y-1">
                  <div>ID: {image.id}</div>
                  {image.storage_path && (
                    <div>Uložené v: {image.storage_path}</div>
                  )}
                  <div>Použitie: {image.usage}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Ako fungujú obrázky na stránke:</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Obrázky s nastaveným "Použitím" sa automaticky zobrazia na príslušných sekciách stránky</li>
          <li>• Ak je obrázok označený ako "Chýba", sekcia bude bez pozadia alebo bude používať predvolený obrázok</li>
          <li>• Kliknutím na obrázok si ho môžete prezrieť v plnej veľkosti</li>
          <li>• Použite tlačidlo "Nahradiť" na zmenu existujúceho obrázka</li>
          <li>• Ak nevidíte obrázky, skúste kliknúť na tlačidlo "Obnoviť"</li>
        </ul>
      </div>

      <ImageUploadDialog 
        isOpen={isImageDialogOpen}
        onClose={closeImageDialog}
        currentImage={currentImage}
        onImageUpload={handleImageUpload}
        isLoading={isLoading}
      />
    </div>
  );
};
