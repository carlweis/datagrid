import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { formatPaginationLabel, getPageNumbers } from "./utils/formatting";

interface GCGridPaginationProps {
  /** Current page (1-indexed) */
  currentPage: number;
  /** Total number of pages */
  pageCount: number;
  /** Current page size */
  pageSize: number;
  /** Available page size options */
  pageSizeOptions: number[];
  /** Total number of items */
  totalCount: number;
  /** Start row number */
  startRow: number;
  /** End row number */
  endRow: number;
  /** Whether can go to next page */
  canNextPage: boolean;
  /** Whether can go to previous page */
  canPreviousPage: boolean;
  /** Callback to change page */
  onPageChange: (page: number) => void;
  /** Callback to change page size */
  onPageSizeChange: (pageSize: number) => void;
}

/**
 * Pagination controls for the data grid
 */
export function GCGridPagination({
  currentPage,
  pageCount,
  pageSize,
  pageSizeOptions,
  totalCount,
  startRow,
  endRow,
  canNextPage,
  canPreviousPage,
  onPageChange,
  onPageSizeChange,
}: GCGridPaginationProps) {
  const pageNumbers = getPageNumbers(currentPage, pageCount);

  if (totalCount === 0) {
    return null;
  }

  return (
    <div className="flex items-center justify-between px-2 py-4">
      {/* Left side: Pagination label and page size selector */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-muted-foreground">
          {formatPaginationLabel(startRow, endRow, totalCount)}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((option) => (
                <SelectItem key={option} value={String(option)}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Right side: Page navigation */}
      <div className="flex items-center gap-1">
        {/* First page button */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(1)}
          disabled={!canPreviousPage}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Previous page button */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canPreviousPage}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {pageNumbers.map((pageNum, index) => {
          const prevPage = pageNumbers[index - 1];
          const showEllipsis = prevPage && pageNum - prevPage > 1;

          return (
            <div key={pageNum} className="flex items-center">
              {showEllipsis && (
                <span className="px-2 text-muted-foreground">...</span>
              )}
              <Button
                variant={currentPage === pageNum ? "default" : "outline"}
                size="icon-sm"
                onClick={() => onPageChange(pageNum)}
                aria-label={`Page ${pageNum}`}
                aria-current={currentPage === pageNum ? "page" : undefined}
              >
                {pageNum}
              </Button>
            </div>
          );
        })}

        {/* Next page button */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canNextPage}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last page button */}
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => onPageChange(pageCount)}
          disabled={!canNextPage}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
