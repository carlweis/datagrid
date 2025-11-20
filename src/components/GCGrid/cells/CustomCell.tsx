import React from "react";
import { cn } from "@/lib/utils";

/**
 * CustomCell - Flexible wrapper for custom content.
 *
 * @example
 * ```tsx
 * <CustomCell>
 *   <div>Custom content</div>
 * </CustomCell>
 * ```
 */
export interface CustomCellProps {
  /** Child content to render inside the cell */
  children: React.ReactNode;
  /** Optional class names */
  className?: string;
}

export const CustomCell: React.FC<CustomCellProps> = ({ children, className }) => {
  return <div className={cn("flex items-center gap-2", className)}>{children}</div>;
};

CustomCell.displayName = "CustomCell";
