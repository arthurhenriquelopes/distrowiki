import { useQuery } from "@tanstack/react-query";
import { transformDistros } from "@/utils/apiTransform";
import type { Distro } from "@/types";

interface UseDistrosOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

interface UseDistrosReturn {
  distros: Distro[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

const API_BASE = import.meta.env.VITE_API_BASE_ || "https://distrowiki-api.vercel.app";

async function fetchDistros(options: UseDistrosOptions): Promise<Distro[]> {
  const { page = 1, pageSize = 100, sortBy = "name", order = "asc" } = options;
  
  const url = `${API_BASE}/distros?page=${page}&page_size=${pageSize}&sort_by=${sortBy}&order=${order}`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Erro ao buscar distribuições: ${response.status}`);
  }
  
  const data = await response.json();
  return transformDistros(data.distros || []);
}

/**
 * Custom hook to fetch distributions from API with React Query caching
 */
export function useDistros(options: UseDistrosOptions = {}): UseDistrosReturn {
  const { page = 1, pageSize = 100, sortBy = "name", order = "asc" } = options;
  
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["distros", page, pageSize, sortBy, order],
    queryFn: () => fetchDistros({ page, pageSize, sortBy, order }),
    staleTime: 5 * 60 * 1000, // 5 minutes cache
    gcTime: 10 * 60 * 1000, // 10 minutes garbage collection
  });

  return {
    distros: data || [],
    loading: isLoading,
    error: error ? (error as Error).message : null,
    refetch,
  };
}
