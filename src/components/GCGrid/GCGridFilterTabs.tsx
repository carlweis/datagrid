import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface FilterTab {
  label: string;
  value: string;
  count?: number;
}

interface GCGridFilterTabsProps {
  /** Filter tabs */
  tabs: FilterTab[];
  /** Active tab value */
  activeTab: string;
  /** Callback when tab changes */
  onTabChange: (value: string) => void;
}

/**
 * Filter tabs component for data segmentation
 */
export function GCGridFilterTabs({
  tabs,
  activeTab,
  onTabChange,
}: GCGridFilterTabsProps) {
  if (!tabs || tabs.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <Tabs value={activeTab} onValueChange={onTabChange}>
        <TabsList>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-2">
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                  {tab.count}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
