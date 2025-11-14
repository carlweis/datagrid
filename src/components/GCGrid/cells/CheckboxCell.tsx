import { Checkbox } from "@/components/ui/checkbox";

interface CheckboxCellProps {
  /** Whether the checkbox is checked */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Whether the checkbox is disabled */
  disabled?: boolean;
  /** Indeterminate state (for select all checkbox) */
  indeterminate?: boolean;
  /** ARIA label */
  ariaLabel?: string;
}

/**
 * Checkbox cell for selection
 */
export function CheckboxCell({
  checked,
  onChange,
  disabled,
  indeterminate,
  ariaLabel,
}: CheckboxCellProps) {
  return (
    <div className="flex items-center">
      <Checkbox
        checked={indeterminate ? "indeterminate" : checked}
        onCheckedChange={(checked) => onChange(checked === true)}
        disabled={disabled}
        aria-label={ariaLabel}
      />
    </div>
  );
}
