import { Badge } from "@/components/ui/badge";
import type { BadgeProps } from "@/components/ui/badge";

interface BadgeCellProps {
  /** Badge text */
  value: string | null | undefined;
  /** Badge variant */
  variant?: BadgeProps["variant"];
  /** Optional CSS class */
  className?: string;
}

/**
 * Badge cell for displaying status badges
 */
export function BadgeCell({ value, variant = "default", className }: BadgeCellProps) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <Badge variant={variant} className={className}>
      {value}
    </Badge>
  );
}
