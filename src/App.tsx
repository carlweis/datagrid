import { useMemo, useState } from "react";
import { Bookmark, Pencil, Trash2 } from "lucide-react";
import {
  BadgeCell,
  ButtonCell,
  CheckboxCell,
  CustomCell,
  GCGrid,
  GripperCell,
  LinkCell,
  MenuCell,
  SwitchCell,
  TextCell,
  ToolbarCell,
  type Column,
} from "@/components/GCGrid";
import "./App.css";

interface TableEntity {
  id: number;
  name: string;
  status: "Active" | "Inactive" | "Archived";
  classYear: string;
  affiliation: string[];
  active: boolean;
}

const makeData = (count: number): TableEntity[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Table Cell ${i + 1}`,
    status: i % 3 === 0 ? "Archived" : i % 2 === 0 ? "Inactive" : "Active",
    classYear: "Table Cell",
    affiliation: ["Badge", "Badge"],
    active: i % 2 === 0,
  }));

const statusVariant = (status: TableEntity["status"]) => {
  switch (status) {
    case "Active":
      return "default";
    case "Archived":
      return "outline";
    default:
      return "secondary";
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function App() {
  const [entities, setEntities] = useState<TableEntity[]>(() => makeData(20));
  const [selectedItems, setSelectedItems] = useState<TableEntity[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [switchLoadingId, setSwitchLoadingId] = useState<number | null>(null);
  const [buttonLoadingId, setButtonLoadingId] = useState<number | null>(null);

  const handleToggleActive = async (id: number, next: boolean) => {
    setSwitchLoadingId(id);
    await sleep(350);
    setEntities((prev) => prev.map((row) => (row.id === id ? { ...row, active: next } : row)));
    setSwitchLoadingId(null);
  };

  const handleRowAction = async (id: number, action: string) => {
    setButtonLoadingId(id);
    await sleep(300);
    console.log(`${action} row ${id}`);
    setButtonLoadingId(null);
  };

  const columns: Column<TableEntity>[] = useMemo(
    () => [
      {
        key: "drag",
        header: "",
        render: () => <GripperCell />,
        width: "40px",
      },
      {
        key: "name",
        header: "Name",
        render: (row) => (
          <LinkCell value={row.name} href={`/entity/${row.id}`} className="font-semibold" />
        ),
      },
      {
        key: "status",
        header: "Status",
        render: (row) => (
          <CustomCell>
            <span className="h-2 w-2 rounded-full bg-gray-400" aria-hidden />
            <TextCell value={row.status} />
          </CustomCell>
        ),
      },
      {
        key: "classYear",
        header: "Class Year",
        render: (row) => <TextCell value={row.classYear} />,
      },
      {
        key: "affiliation",
        header: "Affiliation",
        render: (row) => (
          <CustomCell>
            {row.affiliation.map((tag, idx) => (
              <BadgeCell key={`${row.id}-${idx}`} value={tag} variant="outline" />
            ))}
          </CustomCell>
        ),
      },
      {
        key: "checkbox",
        header: "Checkbox",
        render: (row) => (
          <CheckboxCell
            checked={selectedItems.some((item) => item.id === row.id)}
            onChange={() => {}}
            disabled
            label="Disabled selection example"
          />
        ),
      },
      {
        key: "active",
        header: "Active",
        render: (row) => (
          <SwitchCell
            checked={row.active}
            loading={switchLoadingId === row.id}
            onCheckedChange={(next) => handleToggleActive(row.id, next)}
            label={`Toggle ${row.name}`}
          />
        ),
      },
      {
        key: "actions",
        header: "Actions",
        render: (row) => (
          <ToolbarCell
            actions={[
              {
                icon: Bookmark,
                onClick: () => handleRowAction(row.id, "Bookmark"),
                tooltip: "Favorite",
              },
              {
                icon: Pencil,
                onClick: () => handleRowAction(row.id, "Edit"),
                tooltip: "Edit",
              },
              {
                icon: Trash2,
                onClick: () => handleRowAction(row.id, "Delete"),
                tooltip: "Delete",
                destructive: true,
              },
            ]}
          />
        ),
      },
      {
        key: "menu",
        header: "Menu",
        render: (row) => (
          <MenuCell
            actions={[
              { label: "Edit", onClick: () => handleRowAction(row.id, "Menu Edit") },
              {
                label: "Archive",
                onClick: () => handleRowAction(row.id, "Archive"),
                separator: true,
              },
              {
                label: "Delete",
                onClick: () => handleRowAction(row.id, "Menu Delete"),
                destructive: true,
              },
            ]}
          />
        ),
      },
      {
        key: "badge",
        header: "Badge",
        render: (row) => <BadgeCell value={row.status} variant={statusVariant(row.status)} />,
      },
      {
        key: "button",
        header: "Button",
        render: (row) => (
          <ButtonCell
            label="Edit"
            size="sm"
            onClick={() => handleRowAction(row.id, "Inline Edit")}
            loading={buttonLoadingId === row.id}
          />
        ),
      },
    ],
    [selectedItems, switchLoadingId, buttonLoadingId]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GiveCampus DataGrid</h1>
          <p className="mt-2 text-gray-600">Clean, simple design matching mockup specifications</p>
        </div>

        <GCGrid
          data={entities}
          columns={columns}
          title="Table Entities"
          enableSelection
          enablePagination
          pageSize={10}
          onSelectionChange={setSelectedItems}
          onExport={() => console.log("Exporting selected items:", selectedItems)}
          onAdd={() => console.log("Add constituent clicked")}
          onEdit={() => console.log("Editing selected items:", selectedItems)}
          onDelete={() => console.log("Deleting selected items:", selectedItems)}
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
