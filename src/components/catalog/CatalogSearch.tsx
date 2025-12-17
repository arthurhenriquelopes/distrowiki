import { Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

interface CatalogSearchProps {
  value: string;
  onChange: (value: string) => void;
  resultCount: number;
  totalCount: number;
}

const CatalogSearch = ({
  value,
  onChange,
  resultCount,
  totalCount,
}: CatalogSearchProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative mb-4">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        placeholder={t("catalog.search.placeholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-12 pr-32 h-12 text-base bg-background/50 backdrop-blur-sm border-border focus-visible:ring-primary"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground pointer-events-none">
        {resultCount === totalCount ? (
          <span>{t("catalog.search.results", { count: totalCount })}</span>
        ) : (
          <span>{t("catalog.search.resultsOf", { count: resultCount, total: totalCount })}</span>
        )}
      </div>
    </div>
  );
};

export default CatalogSearch;
