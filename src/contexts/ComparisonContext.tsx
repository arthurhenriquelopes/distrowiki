import React, { createContext, useContext, useState, ReactNode } from "react";
import { Distro } from "@/data/distros";

interface ComparisonContextType {
  selectedDistros: Distro[];
  addDistro: (distro: Distro) => void;
  removeDistro: (distroId: string) => void;
  clearSelection: () => void;
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
      return; // Máximo 4 distros
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

  const isSelected = (distroId: string) => {
    return selectedDistros.some((d) => d.id === distroId);
  };

  return (
    <ComparisonContext.Provider
      value={{ selectedDistros, addDistro, removeDistro, clearSelection, isSelected }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};
