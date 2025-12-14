import { cn } from "@/lib/utils";

// Configuração de cada ambiente gráfico com cores e ícones
const desktopEnvConfig: Record<string, {
  bg: string;
  text: string;
  border: string;
  icon: string;
  label?: string;
}> = {
  gnome: {
    bg: "bg-[#4A86CF]/20",
    text: "text-[#4A86CF]",
    border: "border-[#4A86CF]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/6/68/Gnomelogo.svg",
    label: "GNOME"
  },
  "kde plasma": {
    bg: "bg-[#1D99F3]/20",
    text: "text-[#1D99F3]",
    border: "border-[#1D99F3]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/8d/KDE_logo.svg",
    label: "KDE Plasma"
  },
  kde: {
    bg: "bg-[#1D99F3]/20",
    text: "text-[#1D99F3]",
    border: "border-[#1D99F3]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/8d/KDE_logo.svg",
    label: "KDE"
  },
  xfce: {
    bg: "bg-[#2CAEFF]/20",
    text: "text-[#2CAEFF]",
    border: "border-[#2CAEFF]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/5b/Xfce_logo.svg",
    label: "Xfce"
  },
  lxqt: {
    bg: "bg-[#0191D3]/20",
    text: "text-[#0191D3]",
    border: "border-[#0191D3]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/0a/LXQt_logo.svg",
    label: "LXQt"
  },
  lxde: {
    bg: "bg-[#8B8B8B]/20",
    text: "text-[#8B8B8B]",
    border: "border-[#8B8B8B]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/9/90/Lubuntu%2BLXDE_logo_%28without_background%29.svg",
    label: "LXDE"
  },
  mate: {
    bg: "bg-[#9DDA5B]/20",
    text: "text-[#6FB137]",
    border: "border-[#9DDA5B]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/e/e8/Mate-logo.svg",
    label: "MATE"
  },
  budgie: {
    bg: "bg-[#6BACE7]/20",
    text: "text-[#6BACE7]",
    border: "border-[#6BACE7]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Budgie_Logo.svg/64px-Budgie_Logo.svg.png",
    label: "Budgie"
  },
  cinnamon: {
    bg: "bg-[#DC682E]/20",
    text: "text-[#DC682E]",
    border: "border-[#DC682E]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/5/5a/Cinnamon-logo.svg",
    label: "Cinnamon"
  },
  i3: {
    bg: "bg-[#333333]/30",
    text: "text-foreground",
    border: "border-[#555555]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/2/27/I3_window_manager_logo.svg",
    label: "i3"
  },
  sway: {
    bg: "bg-[#68B0D8]/20",
    text: "text-[#68B0D8]",
    border: "border-[#68B0D8]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Sway_WM_logo.svg",
    label: "Sway"
  },
  pantheon: {
    bg: "bg-[#3689E6]/20",
    text: "text-[#3689E6]",
    border: "border-[#3689E6]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/8/83/Elementary_logo.svg",
    label: "Pantheon"
  },
  deepin: {
    bg: "bg-[#0082FA]/20",
    text: "text-[#0082FA]",
    border: "border-[#0082FA]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/f/f5/Deepin_logo.svg",
    label: "Deepin"
  },
  enlightenment: {
    bg: "bg-[#333333]/30",
    text: "text-foreground",
    border: "border-[#555555]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/d/da/Enlightenment_Logo.svg",
    label: "Enlightenment"
  },
  openbox: {
    bg: "bg-[#707070]/20",
    text: "text-[#909090]",
    border: "border-[#707070]/50",
    icon: "",
    label: "Openbox"
  },
  fluxbox: {
    bg: "bg-[#707070]/20",
    text: "text-[#909090]",
    border: "border-[#707070]/50",
    icon: "",
    label: "Fluxbox"
  },
  awesome: {
    bg: "bg-[#535D6C]/20",
    text: "text-[#535D6C]",
    border: "border-[#535D6C]/50",
    icon: "https://upload.wikimedia.org/wikipedia/commons/0/07/Awesome_logo.svg",
    label: "Awesome"
  },
  hyprland: {
    bg: "bg-[#58E1FF]/20",
    text: "text-[#58E1FF]",
    border: "border-[#58E1FF]/50",
    icon: "",
    label: "Hyprland"
  },
  cosmic: {
    bg: "bg-[#6B4FBB]/20",
    text: "text-[#6B4FBB]",
    border: "border-[#6B4FBB]/50",
    icon: "",
    label: "COSMIC"
  },
  none: {
    bg: "bg-muted/30",
    text: "text-muted-foreground",
    border: "border-muted-foreground/30",
    icon: "",
    label: "Nenhum"
  }
};

// Fallback para ambientes não mapeados
const defaultConfig = {
  bg: "bg-muted/40",
  text: "text-muted-foreground",
  border: "border-muted-foreground/40",
  icon: "",
  label: "",
};

interface DesktopEnvBadgeProps {
  name: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export const DesktopEnvBadge = ({ 
  name, 
  size = "md", 
  showIcon = true,
  className 
}: DesktopEnvBadgeProps) => {
  const key = name.toLowerCase();
  const config = desktopEnvConfig[key] || defaultConfig;
  const displayName = config.label || name;
  
  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-2",
    lg: "px-4 py-2 text-base gap-2.5"
  };
  
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-lg border transition-all duration-200",
        "hover:scale-105 hover:shadow-sm",
        config.bg,
        config.text,
        config.border,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && config.icon && (
        <img 
          src={config.icon} 
          alt={displayName}
          className={cn(iconSizes[size], "object-contain")}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      {displayName}
    </span>
  );
};

// Componente para mostrar lista de ambientes com layout melhorado
interface DesktopEnvListProps {
  environments: string[];
  size?: "sm" | "md" | "lg";
  centered?: boolean;
  className?: string;
}

export const DesktopEnvList = ({ 
  environments, 
  size = "md",
  centered = false,
  className 
}: DesktopEnvListProps) => {
  if (!environments || environments.length === 0) {
    return (
      <span className="text-sm text-muted-foreground italic">
        Nenhum ambiente gráfico
      </span>
    );
  }
  
  return (
    <div className={cn(
      "flex flex-wrap gap-2",
      centered && "justify-center",
      className
    )}>
      {environments.map((de) => (
        <DesktopEnvBadge key={de} name={de} size={size} />
      ))}
    </div>
  );
};

export default DesktopEnvBadge;
