import { Switch } from "@/components/ui/switch";

interface SwitchCellProps {
  /** Whether the switch is checked */
  checked: boolean;
  /** Change handler */
  onChange: (checked: boolean) => void;
  /** Whether the switch is disabled */
  disabled?: boolean;
  /** ARIA label */
  ariaLabel?: string;
}

/**
 * Switch cell for toggle switches
 */
export function SwitchCell({
  checked,
  onChange,
  disabled,
  ariaLabel,
}: SwitchCellProps) {
  return (
    <div className="flex items-center">
      <Switch
        checked={checked}
        onCheckedChange={onChange}
        disabled={disabled}
        aria-label={ariaLabel}
      />
    </div>
  );
}
