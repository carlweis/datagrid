import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { GCGrid } from "@/components/GCGrid";
import { TextCell, LinkCell, BadgeCell, ToolbarCell } from "@/components/GCGrid";
import type { TableEntity } from "./mockData";
import { mockTableEntities } from "./mockData";
import { fetchTableEntities, bulkDeleteEntities, bulkExportEntities } from "./mockApi";
import { Button } from "@/components/ui/button";
import { Download, Plus, Star, Edit, Trash, Mail } from "lucide-react";
import "./App.css";

function App() {
  const [mode, setMode] = useState<"client" | "server">("client");
  const [showDemo, setShowDemo] = useState(false);

  // Column definitions
  const columns: ColumnDef<TableEntity>[] = [
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: (info) => (
        <LinkCell
          value={info.getValue() as string}
          href={`#/entity/${info.row.original.id}`}
          onClick={(e) => {
            e.preventDefault();
            alert(`Clicked: ${info.getValue()}`);
          }}
        />
      ),
      enableSorting: true,
    },
    {
      id: "email",
      accessorKey: "email",
      header: "Email",
      cell: (info) => <TextCell value={info.getValue() as string} />,
      enableSorting: true,
    },
    {
      id: "classYear",
      accessorKey: "classYear",
      header: "Class Year",
      cell: (info) => <TextCell value={info.getValue() as string} />,
      enableSorting: true,
    },
    {
      id: "status",
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        return (
          <BadgeCell
            value={status}
            variant={
              status === "Active"
                ? "default"
                : status === "Inactive"
                ? "secondary"
                : "outline"
            }
          />
        );
      },
      enableSorting: true,
    },
    {
      id: "affiliation",
      accessorKey: "affiliation",
      header: "Affiliation",
      cell: (info) => <TextCell value={info.getValue() as string} />,
    },
    {
      id: "totalDonations",
      accessorKey: "totalDonations",
      header: "Total Donations",
      cell: (info) => (
        <TextCell value={`$${(info.getValue() as number).toLocaleString()}`} />
      ),
      enableSorting: true,
    },
    {
      id: "actions",
      header: "",
      cell: (info) => (
        <ToolbarCell
          actions={[
            {
              icon: Star,
              onClick: () => alert(`Starred: ${info.row.original.name}`),
              tooltip: "Favorite",
            },
            {
              icon: Mail,
              onClick: () => alert(`Email: ${info.row.original.email}`),
              tooltip: "Send Email",
            },
            {
              icon: Edit,
              onClick: () => alert(`Edit: ${info.row.original.name}`),
              tooltip: "Edit",
            },
            {
              icon: Trash,
              onClick: async () => {
                if (confirm(`Delete ${info.row.original.name}?`)) {
                  alert("Deleted!");
                }
              },
              tooltip: "Delete",
              destructive: true,
            },
          ]}
          row={info.row.original}
        />
      ),
      enableSorting: false,
    },
  ];

  if (!showDemo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-background">
        <div className="max-w-2xl text-center space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">GCGrid Component</h1>
          <p className="text-xl text-muted-foreground">
            Production-ready data grid with client and server-side modes
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button
              size="lg"
              onClick={() => {
                setMode("client");
                setShowDemo(true);
              }}
            >
              View Client-Side Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => {
                setMode("server");
                setShowDemo(true);
              }}
            >
              View Server-Side Demo
            </Button>
          </div>
          <div className="pt-8 text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Client-Side Mode:</strong> All data loaded upfront, filtering and
              sorting in browser
            </p>
            <p>
              <strong>Server-Side Mode:</strong> Async data fetching with loading states
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Mode switcher */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button
              variant={mode === "client" ? "default" : "outline"}
              onClick={() => setMode("client")}
            >
              Client-Side Mode
            </Button>
            <Button
              variant={mode === "server" ? "default" : "outline"}
              onClick={() => setMode("server")}
            >
              Server-Side Mode
            </Button>
          </div>
          <Button variant="ghost" onClick={() => setShowDemo(false)}>
            ← Back to Home
          </Button>
        </div>

        {/* Demo description */}
        <div className="rounded-lg border bg-card p-4">
          <h2 className="font-semibold mb-2">
            {mode === "client" ? "Client-Side Mode Demo" : "Server-Side Mode Demo"}
          </h2>
          <p className="text-sm text-muted-foreground">
            {mode === "client"
              ? "All data is loaded upfront. Filtering, sorting, and pagination happen in the browser. Fast and responsive for smaller datasets."
              : "Data is fetched from a mock API. Try searching, filtering, sorting, and pagination to see the loading states. Simulates 800ms network delay."}
          </p>
        </div>

        {/* Client-side mode */}
        {mode === "client" && (
          <GCGrid
            title="Table Entities (Client-Side)"
            data={mockTableEntities}
            columns={columns}
            mode="client"
            selectable
            searchable
            searchPlaceholder="Search by name, email, class year..."
            actionButtons={[
              {
                label: "Add Entity",
                icon: Plus,
                onClick: () => alert("Add entity clicked!"),
                variant: "default",
              },
              {
                label: "Download CSV",
                icon: Download,
                onClick: () => alert("Download CSV clicked!"),
                variant: "outline",
              },
            ]}
            filterTabs={[
              {
                label: "All Results",
                query: null,
              },
              {
                label: "Active",
                query: (row) => row.status === "Active",
              },
              {
                label: "Inactive",
                query: (row) => row.status === "Inactive",
              },
              {
                label: "Draft",
                query: (row) => row.status === "Draft",
              },
            ]}
            onBulkDelete={(ids) => {
              if (confirm(`Delete ${ids.length} entities?`)) {
                alert(`Deleted: ${ids.join(", ")}`);
              }
            }}
            onBulkExport={(ids) => {
              alert(`Exporting ${ids.length} entities`);
            }}
            pagination={{
              pageSize: 5,
              pageSizeOptions: [5, 10, 25, 50],
            }}
          />
        )}

        {/* Server-side mode */}
        {mode === "server" && (
          <GCGrid
            title="Table Entities (Server-Side)"
            columns={columns}
            mode="server"
            selectable
            searchable
            searchPlaceholder="Search by name, email, class year..."
            onFetchData={fetchTableEntities}
            actionButtons={[
              {
                label: "Add Entity",
                icon: Plus,
                onClick: () => alert("Add entity clicked!"),
                variant: "default",
              },
              {
                label: "Download CSV",
                icon: Download,
                onClick: () => alert("Download CSV clicked!"),
                variant: "outline",
              },
            ]}
            filterTabs={[
              {
                label: "All Results",
                value: "all",
              },
              {
                label: "Active",
                value: "Active",
              },
              {
                label: "Inactive",
                value: "Inactive",
              },
              {
                label: "Draft",
                value: "Draft",
              },
            ]}
            onBulkDelete={async (ids) => {
              if (confirm(`Delete ${ids.length} entities?`)) {
                await bulkDeleteEntities(ids);
                alert("Deleted successfully!");
              }
            }}
            onBulkExport={async (ids) => {
              const blob = await bulkExportEntities(ids);
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "entities.csv";
              a.click();
            }}
            pagination={{
              pageSize: 5,
              pageSizeOptions: [5, 10, 25, 50],
            }}
            retryable
            onError={(error) => {
              console.error("Error fetching data:", error);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default App;
