import { Button } from "@/components/ui/button";
import type { ButtonProps } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface ButtonCellProps {
  /** Button label */
  label: string;
  /** Click handler */
  onClick: () => void | Promise<void>;
  /** Button variant */
  variant?: ButtonProps["variant"];
  /** Button size */
  size?: ButtonProps["size"];
  /** Loading state */
  loading?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Optional icon */
  icon?: React.ComponentType<{ className?: string }>;
}

/**
 * Button cell for action buttons within cells
 */
export function ButtonCell({
  label,
  onClick,
  variant = "outline",
  size = "sm",
  loading,
  disabled,
  icon: Icon,
}: ButtonCellProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin mr-1" />
      ) : Icon ? (
        <Icon className="h-4 w-4 mr-1" />
      ) : null}
      {label}
    </Button>
  );
}
