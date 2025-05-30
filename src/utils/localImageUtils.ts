
export const compressImage = (file: File, quality: number = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Nastavenie maximálnych rozmerov
      const maxWidth = 1200;
      const maxHeight = 800;
      
      let { width, height } = img;
      
      // Výpočet nových rozmerov
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } else {
        reject(new Error('Chyba pri vytváraní canvas kontextu'));
      }
    };

    img.onerror = () => reject(new Error('Chyba pri načítavaní obrázka'));
    img.src = URL.createObjectURL(file);
  });
};

export const exportGalleryToFile = (gallery: any[]) => {
  const dataStr = JSON.stringify(gallery, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `galeria_apartman_tilia_${new Date().toISOString().split('T')[0]}.json`;
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importGalleryFromFile = (file: File): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const gallery = JSON.parse(result);
          if (Array.isArray(gallery)) {
            resolve(gallery);
          } else {
            reject(new Error('Neplatný formát súboru galérie'));
          }
        } else {
          reject(new Error('Chyba pri čítaní súboru'));
        }
      } catch (error) {
        reject(new Error('Chyba pri parsovaní JSON súboru'));
      }
    };
    
    reader.onerror = () => reject(new Error('Chyba pri čítaní súboru'));
    reader.readAsText(file);
  });
};

export const getStorageUsage = () => {
  const gallery = localStorage.getItem('apartmentGallery');
  if (!gallery) return { used: 0, percentage: 0 };
  
  const usedBytes = new Blob([gallery]).size;
  const usedMB = usedBytes / (1024 * 1024);
  const maxStorageMB = 5; // Približné maximum pre localStorage
  const percentage = (usedMB / maxStorageMB) * 100;
  
  return {
    used: usedMB,
    percentage: Math.min(percentage, 100)
  };
};
