import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DistroSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  distros: any[];
  excludeId?: string;
  label: string;
  ariaLabel: string;
}

export const DistroSelect = ({ value, onValueChange, distros, excludeId, label, ariaLabel }: DistroSelectProps) => (
  <div>
    <label className="block text-sm font-medium mb-2 text-foreground">{label}</label>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="h-12 bg-background border-2 border-border hover:border-primary transition-colors" aria-label={ariaLabel}>
        <SelectValue placeholder="Escolha uma distro..." />
      </SelectTrigger>
      <SelectContent className="max-h-[300px]">
        {distros
          .filter(d => d.id !== excludeId)
          .map((distro) => (
            <SelectItem key={distro.id} value={distro.id} className="cursor-pointer">
              <div className="flex items-center gap-3">
                <img src={distro.logo} alt={distro.name} width="24" height="24" loading="lazy" className="w-6 h-6 object-contain" />
                <span className="font-medium">{distro.name}</span>
              </div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  </div>
);
