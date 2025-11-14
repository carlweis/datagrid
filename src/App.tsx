import { useState } from "react";
import { GCGrid } from "@/components/GCGrid";
import type { Column } from "@/components/GCGrid";
import "./App.css";

interface TableEntity {
  id: number;
  name: string;
  dataType: string;
  status: string;
  affiliation: string;
}

// Generate sample data that matches the mockup
const generateSampleData = (count: number): TableEntity[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: "Table Cell",
    dataType: "Table Cell",
    status: "N/A",
    affiliation: "N/A",
  }));
};

const sampleData = generateSampleData(3657);

const columns: Column<TableEntity>[] = [
  {
    key: "name",
    header: "Name",
    accessor: "name",
  },
  {
    key: "dataType",
    header: "Data Type",
    accessor: "dataType",
  },
  {
    key: "status",
    header: "Status",
    render: (row) => (
      <div className="flex items-center gap-1">
        <span className="text-gray-900">{row.status}</span>
      </div>
    ),
  },
  {
    key: "affiliation",
    header: "Affiliation",
    render: () => (
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
          Export
        </span>
        <span className="inline-flex items-center rounded bg-gray-800 px-2 py-0.5 text-xs font-medium text-white">
          Delete
        </span>
      </div>
    ),
  },
];

function App() {
  const [selectedItems, setSelectedItems] = useState<TableEntity[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const handleExport = () => {
    console.log("Exporting selected items:", selectedItems);
    alert(`Exporting ${selectedItems.length} items`);
  };

  const handleAdd = () => {
    console.log("Add contributors clicked");
    alert("Add contributors functionality");
  };

  const handleEdit = () => {
    console.log("Editing selected items:", selectedItems);
    alert(`Editing ${selectedItems.length} items`);
  };

  const handleDelete = () => {
    console.log("Deleting selected items:", selectedItems);
    if (confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      alert("Items deleted");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GiveCampus DataGrid</h1>
          <p className="mt-2 text-gray-600">
            A production-ready data grid component matching the design specifications
          </p>
        </div>

        <GCGrid
          data={sampleData}
          columns={columns}
          title="Table Entities"
          enableSelection={true}
          enablePagination={true}
          pageSize={10}
          onSelectionChange={setSelectedItems}
          onExport={handleExport}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDelete}
          tabs={[
            { label: "All Results", value: "all" },
            { label: "Fields", value: "fields" },
            { label: "Draft", value: "draft" },
            { label: "Archived", value: "archived" },
          ]}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Debug Info */}
        {selectedItems.length > 0 && (
          <div className="mt-6 rounded-lg border border-gray-300 bg-white p-4">
            <h3 className="mb-2 text-sm font-semibold text-gray-900">
              Debug: Selected Items ({selectedItems.length})
            </h3>
            <p className="text-xs text-gray-600">
              Check the console for full details of selected items
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
