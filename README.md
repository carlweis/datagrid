# GiveCampus DataGrid Demo

This project now ships a reusable GCGrid plus a suite of shadcn-style cell components you can drop into any column definition. The demo (`src/App.tsx`) exercises every cell type with async and accessibility behaviors.

## Cell Components (in `src/components/GCGrid/cells`)
- `TextCell` – simple text with optional truncation.  
  ```tsx
  <TextCell value={info.getValue()} truncate />
  ```
- `LinkCell` – blue link with optional external target.  
  ```tsx
  <LinkCell value="Details" href={`/entity/${info.row.original.id}`} />
  ```
- `CheckboxCell` – selection checkbox (indeterminate supported).  
  ```tsx
  <CheckboxCell checked={info.row.getIsSelected()} onChange={info.row.getToggleSelectedHandler()} />
  ```
- `BadgeCell` – status/category badges with variants (`default | secondary | outline | destructive`).  
  ```tsx
  <BadgeCell value={status} variant="secondary" />
  ```
- `SwitchCell` – async-friendly toggle switch with loading and `role="switch"`.  
  ```tsx
  <SwitchCell checked={info.getValue()} onCheckedChange={setActive} />
  ```
- `ButtonCell` – action button with async loading and optional icon.  
  ```tsx
  <ButtonCell label="Edit" onClick={() => handleEdit(info.row.original)} variant="outline" />
  ```
- `MenuCell` – ellipsis dropdown with separators and destructive styling.  
  ```tsx
  <MenuCell actions={[{ label: "Edit", onClick: onEdit }, { label: "Delete", destructive: true, onClick: onDelete }]} />
  ```
- `ToolbarCell` – row of icon buttons (tooltips, destructive, loading).  
  ```tsx
  <ToolbarCell actions={[{ icon: Star, onClick: onStar }]} />
  ```
- `GripperCell` – drag handle (six dots) for reordering.  
  ```tsx
  <GripperCell />
  ```
- `CustomCell` – simple wrapper for arbitrary content.  
  ```tsx
  <CustomCell><Avatar /> <span>{info.getValue()}</span></CustomCell>
  ```

Barrel export: `import { GCGrid, TextCell, LinkCell, ... } from "@/components/GCGrid";`

## Example usage (from `src/App.tsx`)
```tsx
const columns: Column<Entity>[] = [
  { key: "name", header: "Name", render: (row) => <LinkCell value={row.name} href={`/entity/${row.id}`} /> },
  { key: "status", header: "Status", render: (row) => <BadgeCell value={row.status} /> },
  { key: "active", header: "Active", render: (row) => <SwitchCell checked={row.active} onCheckedChange={(v) => toggle(row.id, v)} /> },
  { key: "actions", header: "Actions", render: (row) => <ToolbarCell actions={[{ icon: Pencil, onClick: () => onEdit(row) }]} /> },
  { key: "menu", header: "Menu", render: (row) => <MenuCell actions={[{ label: "Delete", destructive: true, onClick: () => onDelete(row.id) }]} /> },
];
```

Run the demo:
```bash
npm install
npm run dev
```

The demo shows:
- keyboard-friendly search toggle (Esc closes, focus handling)
- pagination with only the active page outlined
- interactive cells with loading/error handling hooks
