import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { GCGridProps } from "./types";

interface GCGridTableProps<TData> {
  /** Table columns */
  columns: GCGridProps<TData>["columns"];
  /** Table data */
  data: TData[];
  /** Whether rows are selectable */
  selectable?: boolean;
  /** Whether a row is selected */
  isRowSelected?: (row: Row<TData>) => boolean;
  /** Toggle row selection */
  onRowToggle?: (row: Row<TData>) => void;
  /** Whether all rows are selected */
  isAllSelected?: boolean;
  /** Whether selection is indeterminate */
  isIndeterminate?: boolean;
  /** Toggle all rows */
  onToggleAll?: (rows: Row<TData>[]) => void;
  /** Row click handler */
  onRowClick?: (row: Row<TData>) => void;
  /** Enable row hover effect */
  enableRowHover?: boolean;
  /** Sorting state */
  sorting?: SortingState;
  /** Sorting change handler */
  onSortingChange?: (sorting: SortingState) => void;
  /** Enable sorting */
  enableSorting?: boolean;
  /** Show table border */
  bordered?: boolean;
  /** Get row ID */
  getRowId?: (row: TData) => string;
}

/**
 * Table component using TanStack Table
 */
export function GCGridTable<TData>({
  columns: columnsProp,
  data,
  selectable,
  isRowSelected,
  onRowToggle,
  isAllSelected,
  isIndeterminate,
  onToggleAll,
  onRowClick,
  enableRowHover = true,
  sorting = [],
  onSortingChange,
  enableSorting = true,
  bordered = true,
  getRowId,
}: GCGridTableProps<TData>) {
  // Add selection column if selectable
  const columns = selectable
    ? [
        {
          id: "select",
          header: ({ table }: any) => {
            const rows = table.getRowModel().rows;
            return (
              <Checkbox
                checked={
                  isIndeterminate
                    ? "indeterminate"
                    : isAllSelected
                }
                onCheckedChange={() => onToggleAll?.(rows)}
                aria-label="Select all rows"
              />
            );
          },
          cell: ({ row }: any) => (
            <Checkbox
              checked={isRowSelected?.(row)}
              onCheckedChange={() => onRowToggle?.(row)}
              aria-label={`Select row ${row.id}`}
            />
          ),
          enableSorting: false,
          size: 40,
        },
        ...columnsProp,
      ]
    : columnsProp;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: onSortingChange as any,
    state: {
      sorting,
    },
    enableSorting,
    getRowId: getRowId as any,
    manualSorting: false, // Will be overridden for server-side mode
  });

  return (
    <div className={`rounded-md ${bordered ? "border" : ""}`}>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort();
                const sortDirection = header.column.getIsSorted();

                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : (
                      <div
                        className={
                          canSort
                            ? "flex items-center gap-2 cursor-pointer select-none"
                            : ""
                        }
                        onClick={
                          canSort
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {canSort && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            className="h-4 w-4 p-0"
                          >
                            {sortDirection === "asc" ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : sortDirection === "desc" ? (
                              <ArrowDown className="h-3 w-3" />
                            ) : (
                              <ArrowUpDown className="h-3 w-3 opacity-50" />
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const selected = isRowSelected?.(row);
              return (
                <TableRow
                  key={row.id}
                  data-state={selected ? "selected" : undefined}
                  className={
                    onRowClick || enableRowHover
                      ? "cursor-pointer"
                      : undefined
                  }
                  onClick={() => onRowClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
