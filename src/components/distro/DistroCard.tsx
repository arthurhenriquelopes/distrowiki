import { Distro } from "@/types";
import DistroCardGrid from "./DistroCardGrid";
import DistroCardList from "./DistroCardList";
import DistroCardTerminal from "./DistroCardTerminal";

interface DistroCardProps {
  distro: Distro;
  isSelected?: boolean;
  onSelectToggle?: () => void;
  showCheckbox?: boolean;
  showSpecs?: boolean;
  viewMode?: "list" | "grid" | "terminal";
  onQuickPeek?: (distro: Distro) => void;
}

const DistroCard = ({
  distro,
  isSelected = false,
  onSelectToggle,
  showCheckbox = true,
  showSpecs = true,
  viewMode = "list",
  onQuickPeek,
}: DistroCardProps) => {
  if (viewMode === "terminal") {
    return (
      <DistroCardTerminal
        distro={distro}
        isSelected={isSelected}
        onSelectToggle={onSelectToggle}
        showCheckbox={showCheckbox}
      />
    );
  }

  if (viewMode === "grid") {
    return (
      <DistroCardGrid
        distro={distro}
        isSelected={isSelected}
        onSelectToggle={onSelectToggle}
        showCheckbox={showCheckbox}
      />
    );
  }

  return (
    <DistroCardList
      distro={distro}
      isSelected={isSelected}
      onSelectToggle={onSelectToggle}
      showCheckbox={showCheckbox}
      showSpecs={showSpecs}
      onQuickPeek={onQuickPeek}
    />
  );
};

export default DistroCard;
