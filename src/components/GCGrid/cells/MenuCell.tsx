import React from "react";
import { MoreVertical, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * MenuCell - Dropdown menu with ellipsis trigger.
 *
 * @example
 * ```tsx
 * <MenuCell actions={[{ label: "Edit", onClick: onEdit }]} />
 * ```
 */
export interface MenuCellProps {
  /** List of actions to render */
  actions: Array<{
    label: string;
    onClick: () => void | Promise<void>;
    icon?: React.ComponentType<{ className?: string }>;
    destructive?: boolean;
    disabled?: boolean;
    separator?: boolean;
  }>;
  /** Menu alignment */
  align?: "start" | "end";
}

export const MenuCell: React.FC<MenuCellProps> = ({ actions, align = "end" }) => {
  const [open, setOpen] = React.useState(false);
  const [loadingIndex, setLoadingIndex] = React.useState<number | null>(null);
  const menuRef = React.useRef<HTMLDivElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement | null>(null);

  React.useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", onClickOutside);
    }
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [open]);

  const handleAction = async (action: MenuCellProps["actions"][number], index: number) => {
    if (action.disabled) return;
    setLoadingIndex(index);
    try {
      await action.onClick();
    } catch (error) {
      console.error("MenuCell action failed", error);
    } finally {
      setLoadingIndex(null);
      setOpen(false);
    }
  };

  return (
    <div className="relative flex justify-end">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#015FA3]/50"
      >
        <MoreVertical className="h-5 w-5" aria-hidden />
        <span className="sr-only">Open menu</span>
      </button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className={cn(
            "absolute z-20 mt-2 w-44 rounded-md border border-gray-200 bg-white shadow-lg focus:outline-none",
            align === "end" ? "right-0" : "left-0"
          )}
        >
          {actions.map((action, index) => (
            <React.Fragment key={action.label + index}>
              <button
                type="button"
                role="menuitem"
                className={cn(
                  "flex w-full items-center gap-2 px-3 py-2 text-sm text-left transition hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none",
                  action.destructive ? "text-red-600 hover:text-red-700" : "text-gray-800",
                  action.disabled && "cursor-not-allowed opacity-60"
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  if (action.disabled) return;
                  handleAction(action, index);
                }}
                disabled={action.disabled}
              >
                {loadingIndex === index ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  action.icon && <action.icon className="h-4 w-4" aria-hidden />
                )}
                <span>{action.label}</span>
              </button>
              {action.separator && index < actions.length - 1 && (
                <div className="border-t border-gray-200" role="separator" />
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

MenuCell.displayName = "MenuCell";
