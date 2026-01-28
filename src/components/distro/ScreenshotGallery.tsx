import { useState } from 'react';
import { Distro } from '@/types';
import { useTranslation } from 'react-i18next';

interface ScreenshotGalleryProps {
  distro: Distro;
}

const ScreenshotGallery = ({ distro }: ScreenshotGalleryProps) => {
  const { t } = useTranslation();
  // mock images using placehold.co or similar since we don't have real screenshot urls yet
  const images = [
    { src: `https://placehold.co/800x450/1a1a1a/white?text=${distro.name}+Desktop`, alt: 'Desktop' },
    { src: `https://placehold.co/800x450/2a2a2a/white?text=${distro.name}+Menu`, alt: 'Menu' },
    { src: `https://placehold.co/800x450/3a3a3a/white?text=${distro.name}+Files`, alt: 'File Manager' },
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);

  return (
    <div className="my-8">
      <h3 className="text-2xl font-bold mb-4">{t('features.gallery.title')}</h3>
      <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm">
        <div className="aspect-video w-full bg-muted relative">
            <img 
                src={selectedImage.src} 
                alt={selectedImage.alt}
                className="w-full h-full object-cover"
                loading="lazy"
            />
        </div>
        <div className="p-4 flex gap-4 overflow-x-auto">
            {images.map((img, idx) => (
                <button 
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`relative rounded-lg overflow-hidden w-24 h-16 flex-shrink-0 border-2 transition-all ${selectedImage.src === img.src ? 'border-primary ring-2 ring-primary/20' : 'border-transparent opacity-70 hover:opacity-100'}`}
                >
                    <img src={img.src} alt={img.alt} className="w-full h-full object-cover" />
                </button>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ScreenshotGallery;
