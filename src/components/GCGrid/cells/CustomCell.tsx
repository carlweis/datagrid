interface CustomCellProps {
  /** Custom content to render */
  children: React.ReactNode;
  /** Optional CSS class */
  className?: string;
}

/**
 * Custom cell for rendering arbitrary content
 */
export function CustomCell({ children, className }: CustomCellProps) {
  return <div className={className}>{children}</div>;
}
