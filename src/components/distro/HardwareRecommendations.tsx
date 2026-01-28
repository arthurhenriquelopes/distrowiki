import { HardDrive, Cpu, ShoppingCart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';

const HardwareRecommendations = () => {
  const { t } = useTranslation();

  return (
    <div className="bg-gradient-to-br from-card to-muted p-6 rounded-xl border border-border my-8">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5" />
        {t('features.hardware.title')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
            <HardDrive className="w-8 h-8 text-blue-400 mt-1" />
            <div>
                <h4 className="font-bold text-sm">{t('features.hardware.ssd')}</h4>
                <p className="text-xs text-muted-foreground mb-2">Kingston 480GB A400 - Ideal para reviver PCs antigos com Linux.</p>
                <Button variant="link" className="h-auto p-0 text-blue-400 hover:text-blue-300 text-xs">
                    Ver na Amazon
                </Button>
            </div>
        </div>
        <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-border/50 hover:border-primary/50 transition-colors">
            <Cpu className="w-8 h-8 text-green-400 mt-1" />
            <div>
                <h4 className="font-bold text-sm">{t('features.hardware.ram')}</h4>
                <p className="text-xs text-muted-foreground mb-2">Crucial RAM 8GB DDR4 - Multitarefa suave no GNOME/KDE.</p>
                <Button variant="link" className="h-auto p-0 text-green-400 hover:text-green-300 text-xs">
                    Ver na Amazon
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HardwareRecommendations;
