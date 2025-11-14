import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "./hooks/useDebounce";

interface GCGridSearchProps {
  /** Placeholder text */
  placeholder?: string;
  /** Callback when search query changes (debounced) */
  onSearch: (query: string) => void;
  /** Debounce delay in milliseconds */
  debounceMs?: number;
  /** Initial search value */
  initialValue?: string;
}

/**
 * Search input component with debouncing
 */
export function GCGridSearch({
  placeholder = "Search",
  onSearch,
  debounceMs = 300,
  initialValue = "",
}: GCGridSearchProps) {
  const [value, setValue] = useState(initialValue);
  const debouncedValue = useDebounce(value, debounceMs);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className="relative mb-4">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pl-9 max-w-sm"
      />
    </div>
  );
}
