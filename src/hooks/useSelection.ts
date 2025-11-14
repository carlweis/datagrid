import { useState, useCallback, useMemo } from 'react';

export interface UseSelectionOptions<T> {
  data: T[];
  getRowId: (row: T) => string | number;
  initialSelection?: Set<string | number>;
}

export interface UseSelectionReturn<T> {
  selectedRows: Set<string | number>;
  isRowSelected: (row: T) => boolean;
  toggleRowSelection: (row: T) => void;
  toggleAllSelection: () => void;
  isAllSelected: () => boolean;
  clearSelection: () => void;
  getSelectedItems: () => T[];
}

export function useSelection<T>({
  data,
  getRowId,
  initialSelection = new Set(),
}: UseSelectionOptions<T>): UseSelectionReturn<T> {
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(initialSelection);

  const isRowSelected = useCallback(
    (row: T): boolean => {
      // Handle undefined or null rows
      if (!row) {
        console.warn('useSelection: Attempted to check selection for undefined/null row');
        return false;
      }

      try {
        const id = getRowId(row);
        return selectedRows.has(id);
      } catch (error) {
        console.error('useSelection: Error getting row ID', error);
        return false;
      }
    },
    [selectedRows, getRowId]
  );

  const toggleRowSelection = useCallback(
    (row: T) => {
      // Handle undefined or null rows
      if (!row) {
        console.warn('useSelection: Attempted to toggle selection for undefined/null row');
        return;
      }

      try {
        const id = getRowId(row);
        setSelectedRows((prev) => {
          const next = new Set(prev);
          if (next.has(id)) {
            next.delete(id);
          } else {
            next.add(id);
          }
          return next;
        });
      } catch (error) {
        console.error('useSelection: Error toggling row selection', error);
      }
    },
    [getRowId]
  );

  const isAllSelected = useCallback((): boolean => {
    if (!data || data.length === 0) {
      return false;
    }

    // Filter out any undefined/null rows before checking
    const validRows = data.filter((row) => row != null);

    if (validRows.length === 0) {
      return false;
    }

    return validRows.every((row) => {
      try {
        const id = getRowId(row);
        return selectedRows.has(id);
      } catch (error) {
        console.error('useSelection: Error checking if all selected', error);
        return false;
      }
    });
  }, [data, selectedRows, getRowId]);

  const toggleAllSelection = useCallback(() => {
    if (isAllSelected()) {
      setSelectedRows(new Set());
    } else {
      // Filter out undefined/null rows before selecting all
      const validRows = data.filter((row) => row != null);
      const allIds = validRows
        .map((row) => {
          try {
            return getRowId(row);
          } catch (error) {
            console.error('useSelection: Error getting row ID for select all', error);
            return null;
          }
        })
        .filter((id): id is string | number => id != null);

      setSelectedRows(new Set(allIds));
    }
  }, [data, isAllSelected, getRowId]);

  const clearSelection = useCallback(() => {
    setSelectedRows(new Set());
  }, []);

  const getSelectedItems = useCallback((): T[] => {
    if (!data || data.length === 0) {
      return [];
    }

    return data.filter((row) => {
      if (!row) return false;
      try {
        const id = getRowId(row);
        return selectedRows.has(id);
      } catch (error) {
        console.error('useSelection: Error filtering selected items', error);
        return false;
      }
    });
  }, [data, selectedRows, getRowId]);

  return useMemo(
    () => ({
      selectedRows,
      isRowSelected,
      toggleRowSelection,
      toggleAllSelection,
      isAllSelected,
      clearSelection,
      getSelectedItems,
    }),
    [
      selectedRows,
      isRowSelected,
      toggleRowSelection,
      toggleAllSelection,
      isAllSelected,
      clearSelection,
      getSelectedItems,
    ]
  );
}
