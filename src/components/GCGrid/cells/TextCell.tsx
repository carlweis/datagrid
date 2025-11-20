import React from "react";
import { cn } from "@/lib/utils";

/**
 * TextCell - Display simple text content within a table cell.
 *
 * @example
 * ```tsx
 * <TextCell value="Table Cell" />
 * ```
 */
export interface TextCellProps {
  /** Text or numeric content to display */
  value: string | number | null | undefined;
  /** Optional additional class names */
  className?: string;
  /** Enable truncation with ellipsis */
  truncate?: boolean;
}

export const TextCell: React.FC<TextCellProps> = React.memo(
  ({ value, className, truncate = false }) => {
    const display = value ?? "";
    return (
      <span
        className={cn(
          "text-sm text-gray-900",
          truncate && "max-w-full truncate",
          className
        )}
        title={truncate ? String(display) : undefined}
      >
        {display}
      </span>
    );
  }
);

TextCell.displayName = "TextCell";
