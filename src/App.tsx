import { useState } from "react";
import { GCGrid } from "@/components/GCGrid";
import type { Column } from "@/components/GCGrid";
import "./App.css";

interface TableEntity {
  id: number;
  name: string;
  classYear1: string;
  classYear2: string;
  affiliation: string;
  classYear3: string;
}

// Generate sample data that matches the mockup (9,999 entries)
const generateSampleData = (count: number): TableEntity[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: "Table Cell",
    classYear1: "Table Cell",
    classYear2: "Table Cell",
    affiliation: "Table Cell",
    classYear3: "Table Cell",
  }));
};

const sampleData = generateSampleData(9999);

const columns: Column<TableEntity>[] = [
  {
    key: "name",
    header: "Name",
    render: (row) => (
      <a href="#" className="font-medium text-[#015FA3] hover:underline">
        {row.name}
      </a>
    ),
  },
  {
    key: "classYear1",
    header: "Class Year",
    accessor: "classYear1",
  },
  {
    key: "classYear2",
    header: "Class Year",
    accessor: "classYear2",
  },
  {
    key: "affiliation",
    header: "Affiliation",
    render: () => (
      <div className="flex items-center gap-1.5">
        <span className="inline-flex items-center rounded bg-[#4E4E4E] px-2.5 py-1 text-xs font-medium text-white">
          Badge
        </span>
        <span className="inline-flex items-center rounded bg-[#4E4E4E] px-2.5 py-1 text-xs font-medium text-white">
          Badge
        </span>
      </div>
    ),
  },
  {
    key: "classYear3",
    header: "Class Year",
    accessor: "classYear3",
  },
];

function App() {
  const [selectedItems, setSelectedItems] = useState<TableEntity[]>([]);
  const [activeTab, setActiveTab] = useState("all");

  const handleExport = () => {
    console.log("Exporting selected items:", selectedItems);
  };

  const handleAdd = () => {
    console.log("Add constituent clicked");
  };

  const handleEdit = () => {
    console.log("Editing selected items:", selectedItems);
  };

  const handleDelete = () => {
    console.log("Deleting selected items:", selectedItems);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GiveCampus DataGrid</h1>
          <p className="mt-2 text-gray-600">
            Clean, simple design matching mockup specifications
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
      </div>
    </div>
  );
}

export default App;
