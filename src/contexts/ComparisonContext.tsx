import React, { createContext, useContext, useState, ReactNode } from "react";
import type { Distro } from "@/types";

interface ComparisonContextType {
  selectedDistros: Distro[];
  addDistro: (distro: Distro) => void;
  removeDistro: (distroId: string) => void;
  clearSelection: () => void;
  replaceSelection: (distros: Distro[]) => void;
  isSelected: (distroId: string) => boolean;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(undefined);

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return context;
};

interface ComparisonProviderProps {
  children: ReactNode;
}

export const ComparisonProvider: React.FC<ComparisonProviderProps> = ({ children }) => {
  const [selectedDistros, setSelectedDistros] = useState<Distro[]>([]);

  const addDistro = (distro: Distro) => {
    if (selectedDistros.length >= 4) {
      return; 
    }
    if (!selectedDistros.find((d) => d.id === distro.id)) {
      setSelectedDistros([...selectedDistros, distro]);
    }
  };

  const removeDistro = (distroId: string) => {
    setSelectedDistros(selectedDistros.filter((d) => d.id !== distroId));
  };

  const clearSelection = () => {
    setSelectedDistros([]);
  };

  const replaceSelection = (distros: Distro[]) => {
    setSelectedDistros(distros.slice(0, 4)); // garante máximo 4
  };

  const isSelected = (distroId: string) => {
    return selectedDistros.some((d) => d.id === distroId);
  };

  return (
    <ComparisonContext.Provider
      value={{ 
        selectedDistros, 
        addDistro, 
        removeDistro, 
        clearSelection, 
        replaceSelection,
        isSelected 
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};
