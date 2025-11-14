import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelection } from '../hooks/useSelection';
import { Button } from './ui/button';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  accessor?: keyof T;
  width?: string;
}

export interface GCGridProps<T> {
  data: T[];
  columns: Column<T>[];
  title?: string;
  getRowId?: (row: T) => string | number;
  onSelectionChange?: (selectedItems: T[]) => void;
  enableSelection?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  onExport?: () => void;
  onAdd?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  tabs?: Array<{ label: string; value: string }>;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function GCGrid<T extends Record<string, any>>({
  data,
  columns,
  title,
  getRowId: customGetRowId,
  onSelectionChange,
  enableSelection = true,
  enablePagination = true,
  pageSize = 10,
  onExport,
  onAdd,
  onEdit,
  onDelete,
  tabs,
  activeTab,
  onTabChange,
}: GCGridProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(pageSize);

  // Default getRowId implementation with safety checks
  const getRowId = useCallback(
    (row: T): string | number => {
      if (!row) {
        console.error('GCGrid: Attempted to get ID for undefined/null row');
        throw new Error('Cannot get ID for undefined or null row');
      }

      if (customGetRowId) {
        try {
          return customGetRowId(row);
        } catch (error) {
          console.error('GCGrid: Error in custom getRowId function', error);
          throw error;
        }
      }

      if ('id' in row && row.id !== undefined && row.id !== null) {
        return row.id;
      }

      if ('_id' in row && row._id !== undefined && row._id !== null) {
        return row._id;
      }

      console.error('GCGrid: Row does not have an "id" or "_id" property', row);
      throw new Error(
        'Row must have an "id" or "_id" property, or provide a custom getRowId function'
      );
    },
    [customGetRowId]
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

  const selection = useSelection({
    data: validData,
    getRowId,
  });

  // Notify parent of selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selection.getSelectedItems());
    }
  }, [selection.selectedRows, onSelectionChange, selection]);

  // Pagination logic
  const totalPages = enablePagination ? Math.ceil(validData.length / itemsPerPage) : 1;
  const startIndex = enablePagination ? (currentPage - 1) * itemsPerPage : 0;
  const endIndex = enablePagination ? startIndex + itemsPerPage : validData.length;
  const paginatedData = enablePagination ? validData.slice(startIndex, endIndex) : validData;

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

  const hasSelection = selection.selectedRows.size > 0;

  return (
    <div className="w-full">
      <div className="rounded-lg border border-gray-300 bg-white">
        {/* Header Section */}
        <div className="border-b border-gray-300 bg-white px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {title || 'Table Entities'}
            </h2>
            <div className="flex items-center gap-2">
              {onExport && (
                <Button variant="outline" size="sm" className="text-sm">
                  Download CSV
                </Button>
              )}
              {onAdd && (
                <Button size="sm" className="bg-blue-600 text-sm text-white hover:bg-blue-700">
                  + Add Contributors
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        {tabs && tabs.length > 0 && (
          <div className="border-b border-gray-300 bg-white px-6">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => onTabChange?.(tab.value)}
                  className={`relative pb-3 pt-4 text-sm font-medium transition-colors ${
                    activeTab === tab.value
                      ? 'text-blue-600'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.value && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Selection Status and Actions Bar */}
        {enableSelection && (
          <div className="border-b border-gray-300 bg-gray-50 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                {hasSelection ? (
                  <>
                    <span className="font-medium text-gray-900">
                      {selection.selectedRows.size} Row{selection.selectedRows.size !== 1 ? 's' : ''} Selected
                    </span>
                    <button
                      onClick={selection.clearSelection}
                      className="text-blue-600 hover:underline"
                    >
                      Clear selection
                    </button>
                  </>
                ) : (
                  <span className="text-gray-600">Nothing Selected</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {onExport && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onExport}
                    disabled={!hasSelection}
                    className="h-8 text-xs"
                  >
                    Export
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    disabled={!hasSelection}
                    className="h-8 text-xs"
                  >
                    <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit
                  </Button>
                )}
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    disabled={!hasSelection}
                    className="h-8 text-xs"
                  >
                    <svg className="mr-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasSelection}
                  className="h-8 text-xs"
                >
                  More Actions
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="border-b border-gray-300 bg-white px-6 py-3">
          <div className="flex items-center justify-end">
            <input
              type="search"
              placeholder="Search"
              className="w-64 rounded border border-gray-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="border-b border-gray-300 bg-gray-50">
              <tr>
                {enableSelection && (
                  <th className="w-12 border-r border-gray-300 px-4 py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={selection.isAllSelected()}
                      onChange={selection.toggleAllSelection}
                      className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      aria-label="Select all rows"
                    />
                  </th>
                )}
                <th className="w-12 border-r border-gray-300 px-4 py-2.5 text-left text-xs font-semibold text-gray-700">
                  ID
                </th>
                {columns.map((column, index) => (
                  <th
                    key={column.key}
                    style={{ width: column.width }}
                    className={`px-4 py-2.5 text-left text-xs font-semibold text-gray-700 ${
                      index < columns.length - 1 ? 'border-r border-gray-300' : ''
                    }`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-300 bg-white">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={columns.length + (enableSelection ? 2 : 1)}
                    className="px-4 py-12 text-center text-sm text-gray-500"
                  >
                    No data available
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => {
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
                      className={`transition-colors ${
                        isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      {enableSelection && (
                        <td className="border-r border-gray-300 px-4 py-2.5 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => selection.toggleRowSelection(row)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            aria-label={`Select row ${rowId}`}
                          />
                        </td>
                      )}
                      <td className="border-r border-gray-300 px-4 py-2.5 text-xs text-gray-900">
                        {rowId}
                      </td>
                      {columns.map((column, index) => (
                        <td
                          key={column.key}
                          className={`px-4 py-2.5 text-xs text-gray-900 ${
                            index < columns.length - 1 ? 'border-r border-gray-300' : ''
                          }`}
                        >
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

        {/* Pagination Footer */}
        {enablePagination && (
          <div className="border-t border-gray-300 bg-white px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-600">
                Showing {startIndex + 1}-{Math.min(endIndex, validData.length)} of{' '}
                {validData.length.toLocaleString()} Entries
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  «
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ‹
                </button>
                <button
                  className="rounded border border-gray-300 bg-gray-100 px-3 py-1 text-xs font-medium text-gray-900"
                >
                  {currentPage}
                </button>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  ›
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  »
                </button>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="ml-2 rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
