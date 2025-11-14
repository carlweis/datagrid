import { Inbox } from "lucide-react";

interface GCGridEmptyProps {
  /** Optional custom message */
  message?: string;
  /** Optional custom description */
  description?: string;
}

/**
 * Empty state component for the data grid
 */
export function GCGridEmpty({
  message = "No data available",
  description = "There are no entries to display at this time.",
}: GCGridEmptyProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="rounded-full bg-muted p-4 mb-4">
        <Inbox className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{message}</h3>
      <p className="text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}
