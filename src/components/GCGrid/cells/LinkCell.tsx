// import { Link } from "lucide-react";

interface LinkCellProps {
  /** Text value to display */
  value: string | null | undefined;
  /** Link URL */
  href: string;
  /** Optional CSS class */
  className?: string;
  /** Whether to open in new tab */
  target?: "_blank" | "_self";
  /** Optional click handler (use instead of href for programmatic navigation) */
  onClick?: (e: React.MouseEvent) => void;
}

/**
 * Link cell for clickable links
 */
export function LinkCell({
  value,
  href,
  className,
  target,
  onClick,
}: LinkCellProps) {
  if (value === null || value === undefined) {
    return <span className="text-muted-foreground">—</span>;
  }

  if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`text-primary hover:underline cursor-pointer bg-transparent border-none p-0 ${className || ""}`}
      >
        {value}
      </button>
    );
  }

  return (
    <a
      href={href}
      target={target}
      rel={target === "_blank" ? "noopener noreferrer" : undefined}
      className={`text-primary hover:underline ${className || ""}`}
    >
      {value}
    </a>
  );
}
