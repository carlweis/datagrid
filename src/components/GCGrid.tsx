import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelection } from '../hooks/useSelection';

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

const PRIMARY_BLUE = '#015FA3';
const PRIMARY_BUTTON = '#0062AC';

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
  const [searchFocused, setSearchFocused] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const searchInputRef = useRef<HTMLInputElement | null>(null);

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
  const isSearching = searchFocused || Boolean(searchValue);

  return (
    <div className="w-full border border-gray-300 bg-white">
      {/* Header Section */}
      <div className="border-b border-gray-300 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {validData.length.toLocaleString()} {title || 'Table Entities'}
          </h2>
          <div className="flex items-center gap-3">
            {onExport && (
              <button
                onClick={onExport}
                className="text-sm font-medium text-[#015FA3] hover:underline"
              >
                Download CSV
              </button>
            )}
            {onAdd && (
              <button
                onClick={onAdd}
                className="rounded px-4 py-2 text-sm font-medium text-white"
                style={{ backgroundColor: PRIMARY_BUTTON }}
              >
                + Add Constituent
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs + Search */}
      {tabs && tabs.length > 0 && (
        <div className="border-b border-gray-300 bg-white px-6">
          {isSearching ? (
            <div className="flex items-center pb-2 pt-3">
              <div className="relative w-full">
                <svg
                  className="absolute left-0 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  autoFocus
                  type="text"
                  role="searchbox"
                  aria-label="Search"
                  value={searchValue}
                  placeholder="Search"
                  onChange={(e) => setSearchValue(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setSearchFocused(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setSearchValue('');
                      setSearchFocused(false);
                      searchInputRef.current?.blur();
                    }
                  }}
                  className="w-full border-0 bg-transparent pb-1 pl-6 pr-8 text-sm text-gray-700 outline-none ring-0 focus:ring-0"
                />
                {searchValue && (
                  <button
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => setSearchValue('')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-[#015FA3] hover:underline"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-end justify-between gap-6">
              <div className="flex gap-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.value}
                    onClick={() => onTabChange?.(tab.value)}
                    className={`relative pb-3 pt-4 text-sm font-medium transition-colors ${
                      activeTab === tab.value
                        ? 'text-[#015FA3]'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.value && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#015FA3]" />
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-1 items-end justify-end pb-2 pt-3">
                <button
                  onClick={() => setSearchFocused(true)}
                  className="flex items-center gap-2 pb-1 text-sm font-semibold text-[#015FA3] hover:underline"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Selection Status and Actions Bar */}
      {enableSelection && (
        <div
          className={`border-b border-gray-300 px-6 py-3 ${
            hasSelection ? 'bg-[#E8F4FD]' : 'bg-[#F5F5F5]'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm">
              {hasSelection ? (
                <>
                  <span className="font-semibold text-gray-900">
                    {selection.selectedRows.size} Row{selection.selectedRows.size !== 1 ? 's' : ''}{' '}
                    Selected
                  </span>
                  <button
                    onClick={selection.clearSelection}
                    className="font-medium text-[#015FA3] hover:underline"
                  >
                    Clear selection
                  </button>
                </>
              ) : (
                <span className="text-gray-600">Nothing Selected</span>
              )}
            </div>
            <div className="flex items-center gap-4">
              {onExport && (
                <button
                  onClick={onExport}
                  disabled={!hasSelection}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#015FA3] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                  Export
                </button>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  disabled={!hasSelection}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#015FA3] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={onDelete}
                  disabled={!hasSelection}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#015FA3] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                  Delete
                </button>
              )}
              <button
                disabled={!hasSelection}
                className="flex items-center gap-1 text-sm font-medium text-[#015FA3] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
              >
                More Actions
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-300 bg-white">
            <tr>
              {enableSelection && (
                <th className="w-12 px-6 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={selection.isAllSelected()}
                    onChange={selection.toggleAllSelection}
                    className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#015FA3] focus:ring-[#015FA3]"
                    style={{ accentColor: PRIMARY_BLUE }}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              <th className="w-24 px-6 py-3 text-left text-sm font-semibold text-gray-700">
                <div className="flex items-center gap-1">
                  ID
                  <button className="text-gray-400 hover:text-gray-600">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z" />
                    </svg>
                  </button>
                </div>
              </th>
              {columns.map((column) => (
                <th
                  key={column.key}
                  style={{ width: column.width }}
                  className="px-6 py-3 text-left text-sm font-semibold text-gray-700"
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    <button className="text-gray-400 hover:text-gray-600">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 5.83L15.17 9l1.41-1.41L12 3 7.41 7.59 8.83 9 12 5.83zm0 12.34L8.83 15l-1.41 1.41L12 21l4.59-4.59L15.17 15 12 18.17z" />
                      </svg>
                    </button>
                  </div>
                </th>
              ))}
              <th className="sticky right-0 w-12 bg-white shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)]"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (enableSelection ? 3 : 2)}
                  className="px-6 py-12 text-center text-sm text-gray-500"
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
                      isSelected ? 'bg-[#E8F4FD]' : 'hover:bg-gray-50'
                    }`}
                  >
                    {enableSelection && (
                      <td className="px-6 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => selection.toggleRowSelection(row)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 cursor-pointer rounded border-gray-300 text-[#015FA3] focus:ring-[#015FA3]"
                          style={{ accentColor: PRIMARY_BLUE }}
                          aria-label={`Select row ${rowId}`}
                        />
                      </td>
                    )}
                    <td className="px-6 py-3 text-sm text-gray-900">{rowId}</td>
                    {columns.map((column) => (
                      <td key={column.key} className="px-6 py-3 text-sm text-gray-900">
                        {renderCellContent(row, column)}
                      </td>
                    ))}
                    <td className={`sticky right-0 px-6 py-3 text-center shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1)] ${
                      isSelected ? 'bg-[#E8F4FD]' : 'bg-white'
                    }`}>
                      <button className="text-gray-400 hover:text-gray-600">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                        </svg>
                      </button>
                    </td>
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
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold">{startIndex + 1}</span> -{' '}
              <span className="font-semibold">{Math.min(endIndex, validData.length)}</span> of{' '}
              <span className="font-semibold">{validData.length.toLocaleString()}</span> Entities
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="px-2 text-sm font-semibold text-[#015FA3] disabled:cursor-not-allowed disabled:text-gray-400"
              >
                ««
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2 text-sm font-semibold text-[#015FA3] disabled:cursor-not-allowed disabled:text-gray-400"
              >
                ‹
              </button>

              {/* Page numbers */}
              {currentPage > 2 && (
                <>
                  <button
                    onClick={() => setCurrentPage(1)}
                    className="px-2 text-sm font-semibold text-[#015FA3] hover:underline"
                  >
                    1
                  </button>
                  {currentPage > 3 && <span className="px-2 text-sm text-gray-500">...</span>}
                </>
              )}

              {currentPage > 1 && (
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-2 text-sm font-semibold text-[#015FA3] hover:underline"
                >
                  {currentPage - 1}
                </button>
              )}

              <button className="rounded border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-800 shadow-sm">
                {currentPage}
              </button>

              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-2 text-sm font-semibold text-[#015FA3] hover:underline"
                >
                  {currentPage + 1}
                </button>
              )}

              {currentPage < totalPages - 1 && (
                <>
                  {currentPage < totalPages - 2 && (
                    <span className="px-2 text-sm text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="px-2 text-sm font-semibold text-[#015FA3] hover:underline"
                  >
                    {totalPages}
                  </button>
                </>
              )}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2 text-sm font-semibold text-[#015FA3] disabled:cursor-not-allowed disabled:text-gray-400"
              >
                ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="px-2 text-sm font-semibold text-[#015FA3] disabled:cursor-not-allowed disabled:text-gray-400"
              >
                »»
              </button>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="ml-3 rounded border border-gray-300 px-3 py-1.5 text-sm text-gray-700 focus:border-[#015FA3] focus:outline-none focus:ring-1 focus:ring-[#015FA3]"
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
  );
}
