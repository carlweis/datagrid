import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import type { ToolbarAction } from "../types";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolbarCellProps<TData = any> {
  /** Toolbar actions */
  actions: ToolbarAction<TData>[];
  /** Row data (passed to action handlers) */
  row?: TData;
}

/**
 * Toolbar cell with a row of icon buttons
 */
export function ToolbarCell<TData = any>({ actions, row }: ToolbarCellProps<TData>) {
  return (
    <div className="flex items-center gap-1">
      <TooltipProvider delayDuration={300}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          const button = (
            <Button
              key={index}
              variant="ghost"
              size="icon-sm"
              onClick={() => action.onClick(row)}
              disabled={action.disabled || action.loading}
              className={action.destructive ? "text-destructive hover:text-destructive" : ""}
            >
              {action.loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
            </Button>
          );

          if (action.tooltip) {
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>{button}</TooltipTrigger>
                <TooltipContent>{action.tooltip}</TooltipContent>
              </Tooltip>
            );
          }

          return button;
        })}
      </TooltipProvider>
    </div>
  );
}
