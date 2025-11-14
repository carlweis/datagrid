import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import type { MenuAction } from "../types";

interface MenuCellProps<TData = any> {
  /** Menu actions */
  actions: MenuAction<TData>[];
  /** Row data (passed to action handlers) */
  row?: TData;
}

/**
 * Menu cell with ellipsis dropdown
 */
export function MenuCell<TData = any>({ actions, row }: MenuCellProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Open menu">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action, index) => {
          const Icon = action.icon;
          const isLast = index === actions.length - 1;

          return (
            <div key={index}>
              <DropdownMenuItem
                onClick={() => action.onClick(row)}
                disabled={action.disabled}
                className={action.destructive ? "text-destructive" : ""}
              >
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                {action.label}
              </DropdownMenuItem>
              {action.separator && !isLast && <DropdownMenuSeparator />}
            </div>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
