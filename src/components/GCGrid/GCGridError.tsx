import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface GCGridErrorProps {
  /** Error object */
  error: Error;
  /** Retry callback */
  onRetry?: () => void;
  /** Whether to show retry button */
  retryable?: boolean;
}

/**
 * Error display component for the data grid
 */
export function GCGridError({
  error,
  onRetry,
  retryable = true,
}: GCGridErrorProps) {
  return (
    <div className="flex items-center justify-center p-8">
      <Alert variant="destructive" className="max-w-lg">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error Loading Data</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-4">{error.message}</p>
          {retryable && onRetry && (
            <Button onClick={onRetry} variant="outline" size="sm">
              Retry
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
