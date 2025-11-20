import React from "react";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GripperCell - Drag handle for row reordering.
 *
 * @example
 * ```tsx
 * <GripperCell onDragStart={...} onDragEnd={...} />
 * ```
 */
export interface GripperCellProps {
  /** Called when dragging starts */
  onDragStart?: (e: React.DragEvent) => void;
  /** Called when dragging ends */
  onDragEnd?: (e: React.DragEvent) => void;
  /** Disable dragging */
  disabled?: boolean;
  /** Optional class names */
  className?: string;
}

export const GripperCell: React.FC<GripperCellProps> = ({
  onDragStart,
  onDragEnd,
  disabled = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex cursor-grab items-center justify-center text-gray-400 hover:text-gray-600",
        disabled && "cursor-not-allowed opacity-60",
        className
      )}
      draggable={!disabled}
      aria-label="Drag row"
      onDragStart={(e) => {
        onDragStart?.(e);
      }}
      onDragEnd={(e) => {
        onDragEnd?.(e);
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <GripVertical className="h-5 w-5" aria-hidden />
    </div>
  );
};

GripperCell.displayName = "GripperCell";
