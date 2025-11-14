import { GripVertical } from "lucide-react";

interface GripperCellProps {
  /** Optional CSS class */
  className?: string;
  /** Optional drag handlers (for implementing drag and drop) */
  onDragStart?: (e: React.DragEvent) => void;
  onDragEnd?: (e: React.DragEvent) => void;
}

/**
 * Gripper cell for drag handles
 */
export function GripperCell({ className, onDragStart, onDragEnd }: GripperCellProps) {
  return (
    <div
      className={`flex items-center cursor-grab active:cursor-grabbing ${className || ""}`}
      draggable={!!(onDragStart || onDragEnd)}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      role="button"
      aria-label="Drag handle"
    >
      <GripVertical className="h-4 w-4 text-muted-foreground" />
    </div>
  );
}
