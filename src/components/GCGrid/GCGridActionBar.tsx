import { Button } from "@/components/ui/button";
import { Download, MoreHorizontal, Trash, X } from "lucide-react";
import type { BulkAction } from "./types";
import { Loader2 } from "lucide-react";

interface GCGridActionBarProps {
  /** Number of selected rows */
  selectedCount: number;
  /** Callback to clear selection */
  onClearSelection: () => void;
  /** Custom bulk actions */
  bulkActions?: BulkAction[];
  /** Default bulk delete action */
  onBulkDelete?: (selectedIds: string[]) => void | Promise<void>;
  /** Default bulk export action */
  onBulkExport?: (selectedIds: string[]) => void | Promise<void>;
  /** Selected row IDs */
  selectedIds: string[];
}

/**
 * Action bar that appears when rows are selected
 */
export function GCGridActionBar({
  selectedCount,
  onClearSelection,
  bulkActions,
  onBulkDelete,
  onBulkExport,
  selectedIds,
}: GCGridActionBarProps) {
  if (selectedCount === 0) {
    return null;
  }

  // Default actions if not using custom bulkActions
  const defaultActions: BulkAction[] = [];

  if (onBulkExport) {
    defaultActions.push({
      label: "Export",
      icon: Download,
      onClick: () => onBulkExport(selectedIds),
      variant: "outline",
    });
  }

  if (onBulkDelete) {
    defaultActions.push({
      label: "Delete",
      icon: Trash,
      onClick: () => onBulkDelete(selectedIds),
      variant: "destructive",
      destructive: true,
    });
  }

  const actions = bulkActions || defaultActions;

  return (
    <div className="bg-muted/50 border-y py-3 px-4 mb-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {selectedCount} {selectedCount === 1 ? "Row" : "Rows"} Selected
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearSelection}
          className="h-7"
        >
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {actions.map((action, index) => {
          const Icon = action.icon || MoreHorizontal;
          return (
            <Button
              key={index}
              variant={action.variant || "outline"}
              size="sm"
              onClick={() => action.onClick(selectedIds)}
              disabled={action.loading}
            >
              {action.loading ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Icon className="h-4 w-4 mr-1" />
              )}
              {action.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
