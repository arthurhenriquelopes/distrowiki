import { useState, useEffect } from "react";
import { transformDistros, type Distro } from "@/utils/apiTransform";

interface UseDistrosOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  forceRefresh?: boolean;
}

interface UseDistrosReturn {
  distros: Distro[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Hook customizado para buscar distribuições da API
 */
export function useDistros(options: UseDistrosOptions = {}): UseDistrosReturn {
  const {
    page = 1,
    pageSize = 100,
    sortBy = "name",
    order = "asc",
    forceRefresh = false,
  } = options;

  const [distros, setDistros] = useState<Distro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  useEffect(() => {
    const fetchDistros = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const apiBase = import.meta.env.VITE_API_BASE_ || "https://distrowiki-api.vercel.app";
        const url = `${apiBase}/distros?page=${page}&page_size=${pageSize}&sort_by=${sortBy}&order=${order}&force_refresh=${forceRefresh}`;
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error(`Erro ao buscar distribuições: ${response.status}`);
        }
        
        const data = await response.json();
        const transformed = transformDistros(data.distros || []);
        setDistros(transformed);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Erro ao carregar distribuições");
      } finally {
        setLoading(false);
      }
    };

    fetchDistros();
  }, [page, pageSize, sortBy, order, forceRefresh, refetchTrigger]);

  const refetch = () => setRefetchTrigger((prev) => prev + 1);

  return { distros, loading, error, refetch };
}
