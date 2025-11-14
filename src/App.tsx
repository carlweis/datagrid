import { useState } from "react";
import { Button } from "@/components/ui/button";
import { GCGrid } from "@/components/GCGrid";
import type { Column } from "@/components/GCGrid";
import "./App.css";

interface SampleData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
}

const sampleData: SampleData[] = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "Active" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", role: "User", status: "Active" },
  { id: 3, name: "Carol White", email: "carol@example.com", role: "User", status: "Inactive" },
  { id: 4, name: "David Brown", email: "david@example.com", role: "Moderator", status: "Active" },
  { id: 5, name: "Eve Davis", email: "eve@example.com", role: "User", status: "Active" },
];

const columns: Column<SampleData>[] = [
  {
    key: "id",
    header: "ID",
    accessor: "id",
  },
  {
    key: "name",
    header: "Name",
    accessor: "name",
  },
  {
    key: "email",
    header: "Email",
    accessor: "email",
  },
  {
    key: "role",
    header: "Role",
    render: (row) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        row.role === "Admin" ? "bg-purple-100 text-purple-800" :
        row.role === "Moderator" ? "bg-blue-100 text-blue-800" :
        "bg-gray-100 text-gray-800"
      }`}>
        {row.role}
      </span>
    ),
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        row.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {row.status}
      </span>
    ),
  },
];

function App() {
  const [selectedItems, setSelectedItems] = useState<SampleData[]>([]);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-4xl font-bold text-gray-900">GiveCampus DataGrid</h1>
        <p className="mt-4 text-lg text-gray-600">
          A robust data grid component with selection support and proper error handling.
        </p>

        <div className="mt-8">
          <GCGrid
            data={sampleData}
            columns={columns}
            enableSelection={true}
            onSelectionChange={setSelectedItems}
          />
        </div>

        {selectedItems.length > 0 && (
          <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="mb-2 font-semibold text-gray-900">Selected Items:</h3>
            <ul className="space-y-1 text-sm text-gray-600">
              {selectedItems.map((item) => (
                <li key={item.id}>
                  {item.name} ({item.email})
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-6">
          <Button
            onClick={() => {
              console.log("Selected items:", selectedItems);
              alert(`${selectedItems.length} items selected. Check console for details.`);
            }}
            disabled={selectedItems.length === 0}
          >
            Process Selected Items
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
