interface TextCellProps {
  /** Text value to display */
  value: string | number | null | undefined;
  /** Optional CSS class */
  className?: string;
}

/**
 * Simple text cell for displaying plain text
 */
export function TextCell({ value, className }: TextCellProps) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  return <span className={className}>{value}</span>;
}
