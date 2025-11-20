import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * ButtonCell - Action button within a table cell.
 *
 * @example
 * ```tsx
 * <ButtonCell label="Edit" onClick={() => alert('Edit')} variant="outline" size="sm" />
 * ```
 */
export interface ButtonCellProps {
  /** Button label text */
  label: string;
  /** Click handler - supports async operations */
  onClick: (e: React.MouseEvent) => void | Promise<void>;
  /** Button variant from shadcn */
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  /** Button size */
  size?: "default" | "sm" | "lg" | "icon";
  /** Disabled state */
  disabled?: boolean;
  /** Loading state during async operations */
  loading?: boolean;
  /** Optional icon component */
  icon?: React.ComponentType<{ className?: string }>;
  /** Optional extra classes */
  className?: string;
}

export const ButtonCell: React.FC<ButtonCellProps> = ({
  label,
  onClick,
  variant = "outline",
  size = "sm",
  disabled = false,
  loading = false,
  icon: Icon,
  className,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (loading || isLoading || disabled) return;
    setIsLoading(true);
    try {
      await onClick(e);
    } catch (error) {
      console.error("ButtonCell onClick failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showSpinner = loading || isLoading;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || showSpinner}
      className={cn("min-w-[80px]", className)}
    >
      {showSpinner && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {!showSpinner && Icon && <Icon className="h-4 w-4" aria-hidden />}
      <span>{label}</span>
    </Button>
  );
};

ButtonCell.displayName = "ButtonCell";
