import React from "react";
import { cn } from "@/lib/utils";

/**
 * CheckboxCell - Checkbox input for row selection.
 *
 * @example
 * ```tsx
 * <CheckboxCell checked={info.row.getIsSelected()} onChange={info.row.getToggleSelectedHandler()} />
 * ```
 */
export interface CheckboxCellProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Indeterminate visual state */
  indeterminate?: boolean;
  /** Optional aria-label */
  label?: string;
}

export const CheckboxCell: React.FC<CheckboxCellProps> = ({
  checked,
  onChange,
  disabled = false,
  indeterminate = false,
  label = "Select",
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  return (
    <div className="flex items-center justify-center">
      <input
        ref={inputRef}
        type="checkbox"
        aria-label={label}
        className={cn(
          "h-4 w-4 cursor-pointer rounded border border-gray-300 text-[#015FA3] transition focus-visible:border-[#015FA3] focus-visible:ring-2 focus-visible:ring-[#015FA3]/50",
          disabled && "cursor-not-allowed opacity-50"
        )}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
    </div>
  );
};

CheckboxCell.displayName = "CheckboxCell";
