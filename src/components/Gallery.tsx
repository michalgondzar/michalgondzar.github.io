
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Image } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loadGalleryFromDatabase, GalleryImage } from '@/utils/supabaseGallery';

const defaultGalleryImages: GalleryImage[] = [
  {
    id: 1,
    category: "interior",
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
    alt: "Obývacia izba"
  },
  {
    id: 2,
    category: "interior",
    src: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a",
    alt: "Kuchyňa"
  },
  {
    id: 3,
    category: "interior",
    src: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd",
    alt: "Spálňa"
  },
  {
    id: 4,
    category: "interior",
    src: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14",
    alt: "Kúpeľňa"
  },
  {
    id: 5,
    category: "exterior",
    src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",
    alt: "Pohľad na apartmán zvonku"
  },
  {
    id: 6,
    category: "exterior",
    src: "https://images.unsplash.com/photo-1568084680786-a84f91d1153c",
    alt: "Terasa"
  },
  {
    id: 7,
    category: "surroundings",
    src: "https://images.unsplash.com/photo-1551867633-194f125bddfa",
    alt: "Aquapark Bešeňová"
  },
  {
    id: 8,
    category: "surroundings",
    src: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8",
    alt: "Okolie Bešeňovej"
  }
];

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(defaultGalleryImages);

  // Load gallery from Supabase
  useEffect(() => {
    const loadGallery = async () => {
      try {
        const supabaseGallery = await loadGalleryFromDatabase();
        if (supabaseGallery.length > 0) {
          setGalleryImages(supabaseGallery);
          console.log('Loaded gallery from Supabase for display:', supabaseGallery);
        } else {
          // Fallback to localStorage if no Supabase data
          const savedGallery = localStorage.getItem('apartmentGallery');
          if (savedGallery) {
            try {
              const parsedGallery = JSON.parse(savedGallery);
              setGalleryImages(parsedGallery);
              console.log('Loaded gallery from localStorage for display:', parsedGallery);
            } catch (error) {
              console.error('Error parsing saved gallery for display:', error);
            }
          }
        }
      } catch (error) {
        console.error('Error loading gallery from Supabase:', error);
        // Fallback to localStorage on error
        const savedGallery = localStorage.getItem('apartmentGallery');
        if (savedGallery) {
          try {
            const parsedGallery = JSON.parse(savedGallery);
            setGalleryImages(parsedGallery);
          } catch (parseError) {
            console.error('Error parsing localStorage gallery:', parseError);
          }
        }
      }
    };

    loadGallery();
  }, []);

  return (
    <section id="galeria" className="bg-booking-gray py-16">
      <div className="section-container">
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-sm p-6 md:p-8 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Image className="h-6 w-6 text-booking-primary" />
            <h2 className="section-title mb-0">Galéria</h2>
          </div>
          <p className="section-subtitle">Prezrite si náš útulný apartmán</p>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-8 bg-white/50 backdrop-blur-sm">
              <TabsTrigger value="all">Všetko</TabsTrigger>
              <TabsTrigger value="interior">Interiér</TabsTrigger>
              <TabsTrigger value="exterior">Exteriér</TabsTrigger>
              <TabsTrigger value="surroundings">Okolie</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {galleryImages.map((image) => (
                  <Dialog key={image.id}>
                    <DialogTrigger asChild>
                      <div 
                        className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02]"
                        onClick={() => setSelectedImage(image.src)}
                      >
                        <img 
                          src={image.src} 
                          alt={image.alt}
                          className="w-full h-56 object-cover"
                        />
                        <div className="p-2 text-center text-sm text-gray-500">
                          {image.alt}
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[900px] p-1">
                      <img 
                        src={selectedImage || ''} 
                        alt="Zväčšený obrázok"
                        className="w-full h-auto object-contain max-h-[80vh]"
                      />
                    </DialogContent>
                  </Dialog>
                ))}
              </div>
            </TabsContent>
            
            {["interior", "exterior", "surroundings"].map((category) => (
              <TabsContent key={category} value={category} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {galleryImages
                    .filter((image) => image.category === category)
                    .map((image) => (
                      <Dialog key={image.id}>
                        <DialogTrigger asChild>
                          <div 
                            className="cursor-pointer overflow-hidden rounded-lg bg-white shadow-md hover:shadow-xl transition-all transform hover:scale-[1.02]"
                            onClick={() => setSelectedImage(image.src)}
                          >
                            <img 
                              src={image.src} 
                              alt={image.alt}
                              className="w-full h-56 object-cover"
                            />
                            <div className="p-2 text-center text-sm text-gray-500">
                              {image.alt}
                            </div>
                          </div>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[900px] p-1">
                          <img 
                            src={selectedImage || ''} 
                            alt="Zväčšený obrázok"
                            className="w-full h-auto object-contain max-h-[80vh]"
                          />
                        </DialogContent>
                      </Dialog>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
