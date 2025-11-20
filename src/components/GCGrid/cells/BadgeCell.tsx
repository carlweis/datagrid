import React from "react";
import { cn } from "@/lib/utils";

const badgeVariants: Record<
  NonNullable<BadgeCellProps["variant"]>,
  string
> = {
  default: "bg-gray-700 text-white",
  secondary: "bg-gray-200 text-gray-800",
  outline: "border border-gray-300 text-gray-700 bg-white",
  destructive: "bg-red-50 text-red-700 border border-red-200",
};

/**
 * BadgeCell - Display status or category badges.
 *
 * @example
 * ```tsx
 * <BadgeCell value="Badge" variant="secondary" />
 * ```
 */
export interface BadgeCellProps {
  /** Text to display inside the badge */
  value: string;
  /** Visual style for the badge */
  variant?: "default" | "secondary" | "outline" | "destructive";
  /** Optional extra class names */
  className?: string;
}

export const BadgeCell: React.FC<BadgeCellProps> = React.memo(
  ({ value, variant = "default", className }) => {
    const classes = badgeVariants[variant] ?? badgeVariants.default;
    return (
      <span
        className={cn(
          "inline-flex items-center rounded px-2.5 py-1 text-xs font-medium",
          classes,
          className
        )}
      >
        {value}
      </span>
    );
  }
);

BadgeCell.displayName = "BadgeCell";
