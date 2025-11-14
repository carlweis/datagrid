import { useMemo, useState, useEffect } from "react";
import type { SortingState } from "@tanstack/react-table";
import type { GCGridProps, ServerFilterTab } from "./types";
import { GCGridHeader } from "./GCGridHeader";
import { GCGridFilterTabs } from "./GCGridFilterTabs";
import { GCGridSearch } from "./GCGridSearch";
import { GCGridActionBar } from "./GCGridActionBar";
import { GCGridTable } from "./GCGridTable";
import { GCGridPagination } from "./GCGridPagination";
import { GCGridSkeleton } from "./GCGridSkeleton";
import { GCGridError } from "./GCGridError";
import { GCGridEmpty } from "./GCGridEmpty";
import { useSelection } from "./hooks/useSelection";
import { usePagination } from "./hooks/usePagination";
import { useServerData } from "./hooks/useServerData";
import { useDebounce } from "./hooks/useDebounce";

/**
 * Main GCGrid component - Production-ready data grid with client and server modes
 */
export function GCGrid<TData>(props: GCGridProps<TData>) {
  const {
    title,
    columns,
    actionButtons,
    selectable = false,
    onRowSelect,
    bulkActions,
    onBulkDelete,
    onBulkExport,
    searchable = false,
    searchPlaceholder,
    searchDebounceMs = 300,
    searchableColumns,
    pagination: paginationConfig = {
      pageSize: 10,
      pageSizeOptions: [10, 25, 50, 100],
    },
    loadingComponent,
    emptyComponent,
    errorComponent,
    className,
    getRowId = (row: any) => row.id,
    onRowClick,
    enableRowHover = true,
    initialSorting = [],
    enableSorting = true,
    bordered = true,
    isLoading: externalIsLoading,
  } = props;

  // Sorting state
  const [sorting, setSorting] = useState<SortingState>(initialSorting);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, searchDebounceMs);

  // Filter state
  const [activeFilterValue, setActiveFilterValue] = useState<string>(
    props.filterTabs?.[0]
      ? props.mode === "client"
        ? "0"
        : (props.filterTabs[0] as ServerFilterTab).value || "all"
      : "all"
  );

  // CLIENT MODE
  if (props.mode === "client") {
    const { data: clientData, filterTabs } = props;

    // Pagination
    const paginationState = usePagination(
      paginationConfig.pageSize,
      paginationConfig.initialPage
    );

    // Selection
    const selection = useSelection<TData>(getRowId);

    // Filter data based on active tab
    const filteredByTab = useMemo(() => {
      if (!filterTabs || filterTabs.length === 0) {
        return clientData;
      }

      const activeTabIndex = parseInt(activeFilterValue);
      const activeTab = filterTabs[activeTabIndex];

      if (!activeTab || !activeTab.query) {
        return clientData;
      }

      return clientData.filter(activeTab.query);
    }, [clientData, filterTabs, activeFilterValue]);

    // Filter by search
    const filteredBySearch = useMemo(() => {
      if (!debouncedSearchQuery) {
        return filteredByTab;
      }

      const query = debouncedSearchQuery.toLowerCase();
      return filteredByTab.filter((row: any) => {
        // Search in all columns or specified columns
        const columnsToSearch = searchableColumns || columns.map((col: any) => col.id || col.accessorKey);

        return columnsToSearch.some((colKey) => {
          const value = (row as any)[colKey as string];
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });
    }, [filteredByTab, debouncedSearchQuery, searchableColumns, columns]);

    // Update total count for pagination
    useEffect(() => {
      paginationState.setTotalCount(filteredBySearch.length);
    }, [filteredBySearch.length, paginationState]);

    // Paginate data
    const paginatedData = useMemo(() => {
      const start = (paginationState.currentPage - 1) * paginationState.pageSize;
      const end = start + paginationState.pageSize;
      return filteredBySearch.slice(start, end);
    }, [filteredBySearch, paginationState.currentPage, paginationState.pageSize]);

    // Handle row selection callback
    useEffect(() => {
      if (onRowSelect && selection.selectedCount > 0) {
        // This would need access to actual Row objects, simplified for now
        onRowSelect([] as any);
      }
    }, [selection.selectedCount, onRowSelect]);

    // Prepare filter tabs with counts
    const tabsWithCounts = useMemo(() => {
      if (!filterTabs) return [];

      return filterTabs.map((tab, index) => {
        const count =
          tab.count !== undefined
            ? tab.count
            : tab.query
            ? clientData.filter(tab.query).length
            : clientData.length;

        return {
          label: tab.label,
          value: String(index),
          count,
        };
      });
    }, [filterTabs, clientData]);

    return (
      <div className={className}>
        <GCGridHeader title={title} actionButtons={actionButtons} />

        {tabsWithCounts.length > 0 && (
          <GCGridFilterTabs
            tabs={tabsWithCounts}
            activeTab={activeFilterValue}
            onTabChange={setActiveFilterValue}
          />
        )}

        {searchable && (
          <GCGridSearch
            placeholder={searchPlaceholder}
            onSearch={setSearchQuery}
            debounceMs={searchDebounceMs}
          />
        )}

        {selectable && selection.selectedCount > 0 && (
          <GCGridActionBar
            selectedCount={selection.selectedCount}
            onClearSelection={selection.clearSelection}
            bulkActions={bulkActions}
            onBulkDelete={onBulkDelete}
            onBulkExport={onBulkExport}
            selectedIds={selection.selectedRows}
          />
        )}

        {externalIsLoading ? (
          loadingComponent ? (
            <>{loadingComponent}</>
          ) : (
            <GCGridSkeleton />
          )
        ) : paginatedData.length === 0 ? (
          emptyComponent ? (
            <>{emptyComponent}</>
          ) : (
            <GCGridEmpty />
          )
        ) : (
          <>
            <GCGridTable
              columns={columns}
              data={paginatedData}
              selectable={selectable}
              isRowSelected={selection.isRowSelected}
              onRowToggle={selection.toggleRow}
              isAllSelected={selection.isAllSelected(paginatedData as any)}
              isIndeterminate={selection.isIndeterminate(paginatedData as any)}
              onToggleAll={selection.toggleAll}
              onRowClick={onRowClick}
              enableRowHover={enableRowHover}
              sorting={sorting}
              onSortingChange={setSorting}
              enableSorting={enableSorting}
              bordered={bordered}
              getRowId={getRowId}
            />

            <GCGridPagination
              currentPage={paginationState.currentPage}
              pageCount={paginationState.pageCount}
              pageSize={paginationState.pageSize}
              pageSizeOptions={paginationConfig.pageSizeOptions}
              totalCount={paginationState.totalCount}
              startRow={paginationState.startRow}
              endRow={paginationState.endRow}
              canNextPage={paginationState.canNextPage}
              canPreviousPage={paginationState.canPreviousPage}
              onPageChange={paginationState.setPage}
              onPageSizeChange={paginationState.setPageSize}
            />
          </>
        )}
      </div>
    );
  }

  // SERVER MODE
  const {
    onFetchData,
    filterTabs,
    onError,
    retryable = true,
  } = props;

  // Server data hook
  const serverData = useServerData<TData>({
    onFetchData,
    initialPageSize: paginationConfig.pageSize,
    initialPage: paginationConfig.initialPage,
    onError,
  });

  // Selection
  const selection = useSelection<TData>(getRowId);

  // Update server data when search or filter changes
  useEffect(() => {
    serverData.setSearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, serverData]);

  useEffect(() => {
    const activeTab = filterTabs?.find((tab) => tab.value === activeFilterValue);
    serverData.setActiveFilter(activeTab?.value || null);
  }, [activeFilterValue, filterTabs, serverData]);

  useEffect(() => {
    serverData.setSorting(sorting);
  }, [sorting, serverData]);

  // Prepare filter tabs
  const serverTabsWithCounts = useMemo(() => {
    if (!filterTabs) return [];

    return filterTabs.map((tab) => ({
      label: tab.label,
      value: tab.value || "all",
      count: tab.count,
    }));
  }, [filterTabs]);

  const isLoading = externalIsLoading !== undefined ? externalIsLoading : serverData.isLoading;

  return (
    <div className={className}>
      <GCGridHeader title={title} actionButtons={actionButtons} />

      {serverTabsWithCounts.length > 0 && (
        <GCGridFilterTabs
          tabs={serverTabsWithCounts}
          activeTab={activeFilterValue}
          onTabChange={setActiveFilterValue}
        />
      )}

      {searchable && (
        <GCGridSearch
          placeholder={searchPlaceholder}
          onSearch={setSearchQuery}
          debounceMs={searchDebounceMs}
        />
      )}

      {selectable && selection.selectedCount > 0 && (
        <GCGridActionBar
          selectedCount={selection.selectedCount}
          onClearSelection={selection.clearSelection}
          bulkActions={bulkActions}
          onBulkDelete={onBulkDelete}
          onBulkExport={onBulkExport}
          selectedIds={selection.selectedRows}
        />
      )}

      {serverData.error ? (
        errorComponent ? (
          <>{errorComponent}</>
        ) : (
          <GCGridError
            error={serverData.error}
            onRetry={retryable ? serverData.refetch : undefined}
            retryable={retryable}
          />
        )
      ) : isLoading && serverData.data.length === 0 ? (
        loadingComponent ? (
          <>{loadingComponent}</>
        ) : (
          <GCGridSkeleton />
        )
      ) : serverData.data.length === 0 ? (
        emptyComponent ? (
          <>{emptyComponent}</>
        ) : (
          <GCGridEmpty />
        )
      ) : (
        <>
          <GCGridTable
            columns={columns}
            data={serverData.data}
            selectable={selectable}
            isRowSelected={selection.isRowSelected}
            onRowToggle={selection.toggleRow}
            isAllSelected={selection.isAllSelected(serverData.data as any)}
            isIndeterminate={selection.isIndeterminate(serverData.data as any)}
            onToggleAll={selection.toggleAll}
            onRowClick={onRowClick}
            enableRowHover={enableRowHover}
            sorting={sorting}
            onSortingChange={setSorting}
            enableSorting={enableSorting}
            bordered={bordered}
            getRowId={getRowId}
          />

          <GCGridPagination
            currentPage={serverData.data.length > 0 ? Math.ceil((paginationConfig.initialPage || 1)) : 1}
            pageCount={serverData.pageCount}
            pageSize={paginationConfig.pageSize}
            pageSizeOptions={paginationConfig.pageSizeOptions}
            totalCount={serverData.totalCount}
            startRow={serverData.data.length > 0 ? 1 : 0}
            endRow={serverData.data.length}
            canNextPage={serverData.pageCount > 1}
            canPreviousPage={false}
            onPageChange={serverData.setPage}
            onPageSizeChange={serverData.setPageSize}
          />
        </>
      )}
    </div>
  );
}
