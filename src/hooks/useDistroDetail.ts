import { useQuery, useQueryClient } from "@tanstack/react-query";
import { transformDistro } from "@/utils/apiTransform";
import { calculatePerformanceScore } from "@/utils/scoreCalculation";
import type { DistroAPI } from "@/types";
import { useCallback } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_ || "https://distrowiki-api.vercel.app";

async function fetchDistroById(id: string) {
  const response = await fetch(`${API_BASE}/distros/${id}`);
  if (!response.ok) {
    throw new Error(`Distribuição não encontrada`);
  }
  const data: DistroAPI = await response.json();
  const normalized = transformDistro(data);

  return {
    ...data,
    ...normalized,
    package_manager: data.package_management || data.package_manager,
    office_manager: data.office_suite,
    rating: calculatePerformanceScore(normalized),
  };
}

/**
 * Hook to fetch a single distro by ID with React Query caching.
 * Enables prefetch support from catalog cards.
 */
export function useDistroDetail(id: string | undefined) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["distro", id],
    queryFn: () => fetchDistroById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });

  return {
    distro: data || null,
    loading: isLoading,
    error: error ? (error as Error).message : null,
  };
}

/**
 * Hook that returns a prefetch function for distro details.
 * Call on hover/focus to pre-load data before navigation.
 */
export function usePrefetchDistro() {
  const queryClient = useQueryClient();

  const prefetch = useCallback(
    (id: string) => {
      queryClient.prefetchQuery({
        queryKey: ["distro", id],
        queryFn: () => fetchDistroById(id),
        staleTime: 5 * 60 * 1000,
      });
    },
    [queryClient]
  );

  return prefetch;
}
