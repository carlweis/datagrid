import React from "react";
import { cn } from "@/lib/utils";

/**
 * LinkCell - Clickable link with blue styling.
 *
 * @example
 * ```tsx
 * <LinkCell value="Details" href="/entity/1" />
 * ```
 */
export interface LinkCellProps {
  /** Text of the link */
  value: string;
  /** Href for navigation */
  href: string;
  /** Optional class name overrides */
  className?: string;
  /** Optional click handler */
  onClick?: (e: React.MouseEvent) => void;
  /** Open link in a new tab */
  external?: boolean;
}

export const LinkCell: React.FC<LinkCellProps> = React.memo(
  ({ value, href, className, onClick, external = false }) => {
    return (
      <a
        href={href}
        className={cn(
          "text-sm font-medium text-[#015FA3] hover:underline focus-visible:underline outline-none",
          className
        )}
        onClick={(e) => {
          onClick?.(e);
          e.stopPropagation();
        }}
        rel={external ? "noreferrer noopener" : undefined}
        target={external ? "_blank" : undefined}
      >
        {value}
      </a>
    );
  }
);

LinkCell.displayName = "LinkCell";
