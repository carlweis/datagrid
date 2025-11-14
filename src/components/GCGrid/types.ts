import type { ColumnDef, Row, SortingState } from "@tanstack/react-table";
import type { ButtonProps } from "@/components/ui/button";

/**
 * Mode of operation for the data grid
 * - client: All data operations happen in the browser
 * - server: Data operations happen on the server via callbacks
 */
export type GCGridMode = "client" | "server";

/**
 * Action button configuration for the grid header
 */
export interface ActionButton {
  /** Button label text */
  label: string;
  /** Click handler */
  onClick: () => void | Promise<void>;
  /** Button variant (default, outline, etc.) */
  variant?: ButtonProps["variant"];
  /** Loading state for async operations */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Filter tab configuration for client-side mode
 */
export interface ClientFilterTab<TData> {
  /** Tab label */
  label: string;
  /** Filter predicate function (null for no filter) */
  query: ((row: TData) => boolean) | null;
  /** Optional count override (auto-calculated if not provided) */
  count?: number;
}

/**
 * Filter tab configuration for server-side mode
 */
export interface ServerFilterTab {
  /** Tab label */
  label: string;
  /** Filter value to send to server (null for no filter) */
  value: string | null;
  /** Optional count override */
  count?: number;
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /** Number of rows per page */
  pageSize: number;
  /** Available page size options */
  pageSizeOptions: number[];
  /** Initial page (default: 1) */
  initialPage?: number;
}

/**
 * Parameters passed to server-side data fetching callback
 */
export interface ServerDataParams {
  /** Current page number (1-indexed) */
  page: number;
  /** Number of items per page */
  pageSize: number;
  /** Search query string */
  search?: string;
  /** Active filter value from tabs */
  filters?: string | null;
  /** Sort column key */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: "asc" | "desc";
}

/**
 * Response structure for server-side data fetching
 */
export interface ServerDataResponse<TData> {
  /** Array of data items for current page */
  data: TData[];
  /** Total number of items across all pages */
  totalCount: number;
  /** Total number of pages */
  pageCount: number;
  /** Current page number */
  currentPage?: number;
}

/**
 * Bulk action configuration for selection action bar
 */
export interface BulkAction {
  /** Action label */
  label: string;
  /** Click handler with selected row IDs */
  onClick: (selectedIds: string[]) => void | Promise<void>;
  /** Button variant */
  variant?: ButtonProps["variant"];
  /** Loading state */
  loading?: boolean;
  /** Icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Whether this is a destructive action */
  destructive?: boolean;
}

/**
 * Props for client-side mode
 */
export interface GCGridClientProps<TData> {
  /** Operating mode */
  mode: "client";
  /** Data array (all data loaded upfront) */
  data: TData[];
  /** Filter tabs with client-side predicates */
  filterTabs?: ClientFilterTab<TData>[];
  /** Callback when data is filtered/sorted locally */
  onDataChange?: (data: TData[]) => void;
}

/**
 * Props for server-side mode
 */
export interface GCGridServerProps<TData> {
  /** Operating mode */
  mode: "server";
  /** Data fetching callback */
  onFetchData: (params: ServerDataParams) => Promise<ServerDataResponse<TData>>;
  /** Filter tabs with server-side values */
  filterTabs?: ServerFilterTab[];
  /** Error callback */
  onError?: (error: Error) => void;
  /** Custom error message */
  errorMessage?: string;
  /** Whether to show retry button on error */
  retryable?: boolean;
}

/**
 * Common props for both client and server modes
 */
export interface GCGridCommonProps<TData> {
  /** Grid title displayed in header */
  title: string;
  /** Column definitions (TanStack Table format) */
  columns: ColumnDef<TData, any>[];
  /** Action buttons for grid header */
  actionButtons?: ActionButton[];
  /** Whether rows are selectable via checkbox */
  selectable?: boolean;
  /** Row selection callback */
  onRowSelect?: (rows: Row<TData>[]) => void;
  /** Bulk actions for selection action bar */
  bulkActions?: BulkAction[];
  /** Bulk delete handler */
  onBulkDelete?: (selectedIds: string[]) => void | Promise<void>;
  /** Bulk export handler */
  onBulkExport?: (selectedIds: string[]) => void | Promise<void>;
  /** Whether search is enabled */
  searchable?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Search debounce delay in ms */
  searchDebounceMs?: number;
  /** Columns to search in (default: all visible columns) */
  searchableColumns?: string[];
  /** Pagination configuration */
  pagination?: PaginationConfig;
  /** Custom loading component */
  loadingComponent?: React.ComponentType;
  /** Custom empty state component */
  emptyComponent?: React.ComponentType;
  /** Custom error component */
  errorComponent?: React.ComponentType<{ error: Error; retry?: () => void }>;
  /** Additional CSS class for grid container */
  className?: string;
  /** Get unique ID for each row (default: 'id' field) */
  getRowId?: (row: TData) => string;
  /** Callback when row is clicked */
  onRowClick?: (row: Row<TData>) => void;
  /** Whether to enable row hover effect */
  enableRowHover?: boolean;
  /** Initial sorting state */
  initialSorting?: SortingState;
  /** Whether to enable column sorting */
  enableSorting?: boolean;
  /** Whether to show table border */
  bordered?: boolean;
  /** Whether to show loading state */
  isLoading?: boolean;
}

/**
 * Combined props type for GCGrid component
 */
export type GCGridProps<TData> = GCGridCommonProps<TData> &
  (GCGridClientProps<TData> | GCGridServerProps<TData>);

/**
 * Internal state for the grid
 */
export interface GCGridState<TData> {
  data: TData[];
  filteredData: TData[];
  selectedRows: Row<TData>[];
  currentPage: number;
  pageSize: number;
  totalCount: number;
  pageCount: number;
  searchQuery: string;
  activeFilter: string | null;
  sorting: SortingState;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Toolbar action configuration for ToolbarCell
 */
export interface ToolbarAction<TData = any> {
  /** Icon component */
  icon: React.ComponentType<{ className?: string }>;
  /** Click handler */
  onClick: (row?: TData) => void | Promise<void>;
  /** Tooltip text */
  tooltip?: string;
  /** Whether this is a destructive action (red color) */
  destructive?: boolean;
  /** Whether the action is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

/**
 * Menu action configuration for MenuCell
 */
export interface MenuAction<TData = any> {
  /** Action label */
  label: string;
  /** Click handler */
  onClick: (row?: TData) => void | Promise<void>;
  /** Optional icon */
  icon?: React.ComponentType<{ className?: string }>;
  /** Whether this is a destructive action */
  destructive?: boolean;
  /** Whether to show a separator after this item */
  separator?: boolean;
  /** Whether the action is disabled */
  disabled?: boolean;
}
