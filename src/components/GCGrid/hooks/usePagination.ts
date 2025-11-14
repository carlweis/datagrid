import { useState, useCallback, useMemo } from "react";

export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalCount: number;
}

export interface PaginationActions {
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  firstPage: () => void;
  lastPage: () => void;
  setTotalCount: (count: number) => void;
}

export interface PaginationInfo {
  pageCount: number;
  canNextPage: boolean;
  canPreviousPage: boolean;
  startRow: number;
  endRow: number;
}

/**
 * Hook to manage pagination state and calculations
 */
export function usePagination(
  initialPageSize: number = 10,
  initialPage: number = 1
): PaginationState & PaginationActions & PaginationInfo {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [totalCount, setTotalCount] = useState(0);

  const pageCount = useMemo(() => {
    return Math.ceil(totalCount / pageSize);
  }, [totalCount, pageSize]);

  const canNextPage = currentPage < pageCount;
  const canPreviousPage = currentPage > 1;

  const startRow = useMemo(() => {
    return (currentPage - 1) * pageSize + 1;
  }, [currentPage, pageSize]);

  const endRow = useMemo(() => {
    return Math.min(currentPage * pageSize, totalCount);
  }, [currentPage, pageSize, totalCount]);

  const setPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleSetPageSize = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    // Reset to first page when page size changes
    setCurrentPage(1);
  }, []);

  const nextPage = useCallback(() => {
    setCurrentPage((prev) => Math.min(prev + 1, pageCount));
  }, [pageCount]);

  const previousPage = useCallback(() => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }, []);

  const firstPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const lastPage = useCallback(() => {
    setCurrentPage(pageCount);
  }, [pageCount]);

  return {
    currentPage,
    pageSize,
    totalCount,
    pageCount,
    canNextPage,
    canPreviousPage,
    startRow,
    endRow,
    setPage,
    setPageSize: handleSetPageSize,
    nextPage,
    previousPage,
    firstPage,
    lastPage,
    setTotalCount,
  };
}
