/**
 * GCGrid - Production-Ready Data Grid Component
 *
 * A comprehensive, reusable data grid component for React applications.
 * Supports both client-side and server-side data operations.
 *
 * @example
 * ```tsx
 * import { GCGrid } from '@/components/GCGrid';
 *
 * function MyTable() {
 *   return (
 *     <GCGrid
 *       title="Users"
 *       data={users}
 *       columns={columns}
 *       mode="client"
 *       selectable
 *       searchable
 *     />
 *   );
 * }
 * ```
 */

// Main component
export { GCGrid } from "./GCGrid";

// Sub-components (for customization)
export { GCGridHeader } from "./GCGridHeader";
export { GCGridFilterTabs } from "./GCGridFilterTabs";
export { GCGridSearch } from "./GCGridSearch";
export { GCGridActionBar } from "./GCGridActionBar";
export { GCGridTable } from "./GCGridTable";
export { GCGridPagination } from "./GCGridPagination";
export { GCGridSkeleton } from "./GCGridSkeleton";
export { GCGridError } from "./GCGridError";
export { GCGridEmpty } from "./GCGridEmpty";

// Cell components
export * from "./cells";

// Types
export type {
  GCGridProps,
  GCGridMode,
  ActionButton,
  ClientFilterTab,
  ServerFilterTab,
  PaginationConfig,
  ServerDataParams,
  ServerDataResponse,
  BulkAction,
  ToolbarAction,
  MenuAction,
  GCGridClientProps,
  GCGridServerProps,
  GCGridCommonProps,
} from "./types";

// Hooks (for advanced customization)
export { useDebounce } from "./hooks/useDebounce";
export { useSelection } from "./hooks/useSelection";
export { usePagination } from "./hooks/usePagination";
export { useServerData } from "./hooks/useServerData";

// Utilities
export { formatNumber, formatPaginationLabel, getPageNumbers } from "./utils/formatting";
export { buildQueryString, delay } from "./utils/api";
