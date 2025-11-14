/**
 * Mock API service for server-side mode demonstration
 */

import { mockTableEntities } from "./mockData";
import type { TableEntity } from "./mockData";
import type { ServerDataParams, ServerDataResponse } from "@/components/GCGrid";
import { delay } from "@/components/GCGrid/utils/api";

/**
 * Simulate server-side data fetching
 */
export async function fetchTableEntities(
  params: ServerDataParams
): Promise<ServerDataResponse<TableEntity>> {
  // Simulate network delay
  await delay(800);

  let data = [...mockTableEntities];

  // Apply filters
  if (params.filters && params.filters !== "all") {
    data = data.filter((item) => item.status === params.filters);
  }

  // Apply search
  if (params.search) {
    const searchLower = params.search.toLowerCase();
    data = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.email.toLowerCase().includes(searchLower) ||
        item.classYear.includes(searchLower) ||
        item.affiliation.toLowerCase().includes(searchLower)
    );
  }

  // Apply sorting
  if (params.sortBy) {
    data.sort((a, b) => {
      const aValue = (a as any)[params.sortBy!];
      const bValue = (b as any)[params.sortBy!];

      if (typeof aValue === "string") {
        return params.sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number") {
        return params.sortOrder === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }

  // Calculate pagination
  const totalCount = data.length;
  const pageCount = Math.ceil(totalCount / params.pageSize);
  const start = (params.page - 1) * params.pageSize;
  const end = start + params.pageSize;
  const paginatedData = data.slice(start, end);

  return {
    data: paginatedData,
    totalCount,
    pageCount,
    currentPage: params.page,
  };
}

/**
 * Simulate bulk delete operation
 */
export async function bulkDeleteEntities(ids: string[]): Promise<void> {
  await delay(1000);
  console.log("Bulk delete:", ids);
  // In a real app, this would make an API call
}

/**
 * Simulate bulk export operation
 */
export async function bulkExportEntities(ids: string[]): Promise<Blob> {
  await delay(1000);
  console.log("Bulk export:", ids);

  // Create mock CSV
  const csv = "id,name,email\n" + ids.map((id) => `${id},Name,Email`).join("\n");
  return new Blob([csv], { type: "text/csv" });
}
