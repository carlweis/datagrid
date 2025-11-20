import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * SwitchCell - Toggle switch for boolean values.
 *
 * @example
 * ```tsx
 * <SwitchCell checked={true} onCheckedChange={(v) => console.log(v)} />
 * ```
 */
export interface SwitchCellProps {
  /** Current checked state */
  checked: boolean;
  /** Change handler - supports async operations */
  onCheckedChange: (checked: boolean) => void | Promise<void>;
  /** Disable interactions */
  disabled?: boolean;
  /** Optional aria-label */
  label?: string;
  /** Force loading indicator */
  loading?: boolean;
}

export const SwitchCell: React.FC<SwitchCellProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  label = "Toggle",
  loading = false,
}) => {
  const [isLoading, setIsLoading] = React.useState(false);

  const handleToggle = async () => {
    if (disabled || loading || isLoading) return;
    const next = !checked;
    setIsLoading(true);
    try {
      await onCheckedChange(next);
    } catch (error) {
      console.error("SwitchCell: onCheckedChange failed", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled || loading || isLoading}
      onClick={(e) => {
        e.stopPropagation();
        handleToggle();
      }}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border border-gray-300 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015FA3]/50",
        checked ? "bg-[#015FA3]" : "bg-gray-200",
        (disabled || loading || isLoading) && "cursor-not-allowed opacity-60"
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0.5 inline-flex h-5 w-5 transform items-center justify-center rounded-full bg-white shadow transition",
          checked && "translate-x-5"
        )}
      >
        {(loading || isLoading) && (
          <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-500" />
        )}
      </span>
    </button>
  );
};

SwitchCell.displayName = "SwitchCell";
