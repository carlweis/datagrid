import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ToolbarCell - Row of icon buttons for quick actions.
 *
 * @example
 * ```tsx
 * <ToolbarCell actions={[{ icon: Star, onClick: () => {} }]} />
 * ```
 */
export interface ToolbarCellProps {
  /** Actions to render as icons */
  actions: Array<{
    icon: React.ComponentType<{ className?: string }>;
    onClick: () => void | Promise<void>;
    tooltip?: string;
    destructive?: boolean;
    disabled?: boolean;
    loading?: boolean;
  }>;
  /** Optional wrapper class name */
  className?: string;
}

export const ToolbarCell: React.FC<ToolbarCellProps> = ({ actions, className }) => {
  const [loadingIndex, setLoadingIndex] = React.useState<number | null>(null);

  const handleClick = async (actionIndex: number, action: ToolbarCellProps["actions"][number]) => {
    if (action.disabled || action.loading) return;
    setLoadingIndex(actionIndex);
    try {
      await action.onClick();
    } catch (error) {
      console.error("ToolbarCell action failed", error);
    } finally {
      setLoadingIndex(null);
    }
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {actions.map((action, index) => {
        const Icon = action.icon;
        const showLoading = action.loading || loadingIndex === index;

        return (
          <button
            key={index}
            type="button"
            aria-label={action.tooltip || "Action"}
            title={action.tooltip}
            onClick={(e) => {
              e.stopPropagation();
              handleClick(index, action);
            }}
            disabled={action.disabled || showLoading}
            className={cn(
              "inline-flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015FA3]/50",
              action.destructive && "text-red-600 hover:text-red-700",
              (action.disabled || showLoading) && "cursor-not-allowed opacity-60"
            )}
          >
            {showLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Icon className="h-4 w-4" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
};

ToolbarCell.displayName = "ToolbarCell";
