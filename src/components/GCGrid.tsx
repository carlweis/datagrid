import { useCallback, useMemo } from 'react';
import { useSelection } from '../hooks/useSelection';
import { Button } from './ui/button';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  accessor?: keyof T;
}

export interface GCGridProps<T> {
  data: T[];
  columns: Column<T>[];
  getRowId?: (row: T) => string | number;
  onSelectionChange?: (selectedItems: T[]) => void;
  enableSelection?: boolean;
}

export function GCGrid<T extends Record<string, any>>({
  data,
  columns,
  getRowId: customGetRowId,
  onSelectionChange,
  enableSelection = true,
}: GCGridProps<T>) {
  // Default getRowId implementation with safety checks
  const getRowId = useCallback(
    (row: T): string | number => {
      // Safety check: handle undefined or null rows
      if (!row) {
        console.error('GCGrid: Attempted to get ID for undefined/null row');
        throw new Error('Cannot get ID for undefined or null row');
      }

      // Use custom getRowId if provided
      if (customGetRowId) {
        try {
          return customGetRowId(row);
        } catch (error) {
          console.error('GCGrid: Error in custom getRowId function', error);
          throw error;
        }
      }

      // Default: try to use 'id' property
      if ('id' in row && row.id !== undefined && row.id !== null) {
        return row.id;
      }

      // Fallback: try '_id' property (common in MongoDB)
      if ('_id' in row && row._id !== undefined && row._id !== null) {
        return row._id;
      }

      // If no ID found, throw error with helpful message
      console.error('GCGrid: Row does not have an "id" or "_id" property', row);
      throw new Error(
        'Row must have an "id" or "_id" property, or provide a custom getRowId function'
      );
    },
    [customGetRowId]
  );

  const selection = useSelection({
    data,
    getRowId,
  });

  // Notify parent of selection changes
  useMemo(() => {
    if (onSelectionChange) {
      onSelectionChange(selection.getSelectedItems());
    }
  }, [selection.selectedRows, onSelectionChange, selection]);

  const handleRowClick = useCallback(
    (row: T) => {
      if (!enableSelection) return;
      selection.toggleRowSelection(row);
    },
    [enableSelection, selection]
  );

  // Filter out any invalid rows before rendering
  const validData = useMemo(() => {
    return data.filter((row) => {
      if (!row) {
        console.warn('GCGrid: Skipping undefined/null row in data');
        return false;
      }
      try {
        getRowId(row);
        return true;
      } catch (error) {
        console.warn('GCGrid: Skipping row with invalid ID', error);
        return false;
      }
    });
  }, [data, getRowId]);

  const renderCellContent = useCallback(
    (row: T, column: Column<T>) => {
      if (column.render) {
        return column.render(row);
      }
      if (column.accessor) {
        return String(row[column.accessor] ?? '');
      }
      return '';
    },
    []
  );

  return (
    <div className="w-full overflow-auto">
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        {/* Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Data Grid</h2>
            {enableSelection && validData.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selection.selectedRows.size} of {validData.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={selection.toggleAllSelection}
                >
                  {selection.isAllSelected() ? 'Deselect All' : 'Select All'}
                </Button>
                {selection.selectedRows.size > 0 && (
                  <Button variant="outline" size="sm" onClick={selection.clearSelection}>
                    Clear
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                {enableSelection && (
                  <th className="w-12 px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selection.isAllSelected()}
                      onChange={selection.toggleAllSelection}
                      className="h-4 w-4 rounded border-gray-300"
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-sm font-medium text-gray-700"
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {validData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (enableSelection ? 1 : 0)}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                validData.map((row) => {
                  let rowId: string | number;
                  try {
                    rowId = getRowId(row);
                  } catch (error) {
                    console.error('GCGrid: Error rendering row', error);
                    return null;
                  }

                  const isSelected = selection.isRowSelected(row);

                  return (
                    <tr
                      key={rowId}
                      onClick={() => handleRowClick(row)}
                      className={`
                        transition-colors
                        ${enableSelection ? 'cursor-pointer hover:bg-gray-50' : ''}
                        ${isSelected ? 'bg-blue-50' : ''}
                      `}
                    >
                      {enableSelection && (
                        <td className="px-4 py-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => selection.toggleRowSelection(row)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 rounded border-gray-300"
                            aria-label={`Select row ${rowId}`}
                          />
                        </td>
                      )}
                      {columns.map((column) => (
                        <td key={column.key} className="px-4 py-3 text-sm text-gray-900">
                          {renderCellContent(row, column)}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
