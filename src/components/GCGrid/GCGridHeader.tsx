import { Button } from "@/components/ui/button";
import type { ActionButton } from "./types";
import { Loader2 } from "lucide-react";

interface GCGridHeaderProps {
  /** Grid title */
  title: string;
  /** Action buttons */
  actionButtons?: ActionButton[];
}

/**
 * Header component with title and action buttons
 */
export function GCGridHeader({ title, actionButtons }: GCGridHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {actionButtons && actionButtons.length > 0 && (
        <div className="flex gap-2">
          {actionButtons.map((button, index) => {
            const Icon = button.icon;
            return (
              <Button
                key={index}
                variant={button.variant || (index === 0 ? "default" : "outline")}
                onClick={button.onClick}
                disabled={button.disabled || button.loading}
              >
                {button.loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : Icon ? (
                  <Icon className="h-4 w-4" />
                ) : null}
                {button.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
