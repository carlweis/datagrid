import { useState, useCallback, useEffect, useRef } from "react";
import type { SortingState } from "@tanstack/react-table";
import type { ServerDataParams, ServerDataResponse } from "../types";

export interface UseServerDataProps<TData> {
  onFetchData: (params: ServerDataParams) => Promise<ServerDataResponse<TData>>;
  initialPageSize: number;
  initialPage?: number;
  onError?: (error: Error) => void;
}

export interface UseServerDataReturn<TData> {
  data: TData[];
  totalCount: number;
  pageCount: number;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  setSearchQuery: (query: string) => void;
  setActiveFilter: (filter: string | null) => void;
  setSorting: (sorting: SortingState) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
}

/**
 * Hook to manage server-side data fetching
 */
export function useServerData<TData>({
  onFetchData,
  initialPageSize,
  initialPage = 1,
  onError,
}: UseServerDataProps<TData>): UseServerDataReturn<TData> {
  const [data, setData] = useState<TData[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Track the current request to allow cancellation
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);

    try {
      const params: ServerDataParams = {
        page,
        pageSize,
        search: searchQuery || undefined,
        filters: activeFilter,
        sortBy: sorting[0]?.id,
        sortOrder: sorting[0]?.desc ? "desc" : "asc",
      };

      const response = await onFetchData(params);

      setData(response.data);
      setTotalCount(response.totalCount);
      setPageCount(response.pageCount);
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      const error = err instanceof Error ? err : new Error("Failed to fetch data");
      setError(error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, [page, pageSize, searchQuery, activeFilter, sorting, onFetchData, onError]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchData]);

  const refetch = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const handleSetPageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setPage(1); // Reset to first page
  }, []);

  return {
    data,
    totalCount,
    pageCount,
    isLoading,
    error,
    refetch,
    setSearchQuery,
    setActiveFilter,
    setSorting,
    setPage,
    setPageSize: handleSetPageSize,
  };
}
