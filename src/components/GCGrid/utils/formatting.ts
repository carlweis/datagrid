/**
 * Format a number with commas for thousands
 */
export function formatNumber(num: number): string {
  return num.toLocaleString();
}

/**
 * Format pagination label (e.g., "Showing 1-10 of 100 Entries")
 */
export function formatPaginationLabel(
  startRow: number,
  endRow: number,
  totalCount: number
): string {
  if (totalCount === 0) {
    return "No entries";
  }
  return `Showing ${formatNumber(startRow)}-${formatNumber(endRow)} of ${formatNumber(totalCount)} ${totalCount === 1 ? "Entry" : "Entries"}`;
}

/**
 * Get page numbers to display in pagination
 * Shows current page, one before, and one after
 */
export function getPageNumbers(currentPage: number, pageCount: number): number[] {
  const pages: number[] = [];

  // Always include first page
  if (pageCount >= 1) {
    pages.push(1);
  }

  // Add pages around current page
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(pageCount - 1, currentPage + 1); i++) {
    if (!pages.includes(i)) {
      pages.push(i);
    }
  }

  // Always include last page
  if (pageCount > 1 && !pages.includes(pageCount)) {
    pages.push(pageCount);
  }

  return pages;
}
