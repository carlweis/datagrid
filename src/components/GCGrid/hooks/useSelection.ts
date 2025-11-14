import { useState, useCallback, useMemo } from "react";
import type { Row } from "@tanstack/react-table";

/**
 * Hook to manage row selection state
 */
export function useSelection<TData>(
  getRowId: (row: TData) => string = (row: any) => row.id
) {
  const [selectedRowIds, setSelectedRowIds] = useState<Set<string>>(new Set());

  const toggleRow = useCallback(
    (row: Row<TData>) => {
      const id = getRowId(row.original);
      setSelectedRowIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [getRowId]
  );

  const toggleAll = useCallback((rows: Row<TData>[]) => {
    const allIds = rows.map((row) => getRowId(row.original));
    setSelectedRowIds((prev) => {
      // If all are selected, deselect all. Otherwise, select all.
      if (allIds.every((id) => prev.has(id))) {
        return new Set();
      } else {
        return new Set(allIds);
      }
    });
  }, [getRowId]);

  const clearSelection = useCallback(() => {
    setSelectedRowIds(new Set());
  }, []);

  const isRowSelected = useCallback(
    (row: Row<TData>) => {
      const id = getRowId(row.original);
      return selectedRowIds.has(id);
    },
    [selectedRowIds, getRowId]
  );

  const isAllSelected = useCallback(
    (rows: Row<TData>[]) => {
      if (rows.length === 0) return false;
      return rows.every((row) => {
        const id = getRowId(row.original);
        return selectedRowIds.has(id);
      });
    },
    [selectedRowIds, getRowId]
  );

  const isIndeterminate = useCallback(
    (rows: Row<TData>[]) => {
      if (rows.length === 0) return false;
      const selectedCount = rows.filter((row) => {
        const id = getRowId(row.original);
        return selectedRowIds.has(id);
      }).length;
      return selectedCount > 0 && selectedCount < rows.length;
    },
    [selectedRowIds, getRowId]
  );

  const selectedRows = useMemo(() => {
    return Array.from(selectedRowIds);
  }, [selectedRowIds]);

  const selectedCount = selectedRowIds.size;

  return {
    selectedRowIds,
    selectedRows,
    selectedCount,
    toggleRow,
    toggleAll,
    clearSelection,
    isRowSelected,
    isAllSelected,
    isIndeterminate,
  };
}
