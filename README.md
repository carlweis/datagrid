# GCGrid - Production-Ready Data Grid Component

A comprehensive, reusable data grid component built with React, TypeScript, TanStack Table, and shadcn/ui. Designed to replace all existing table implementations across GiveCampus products.

## Features

- ✅ **Dual Operating Modes**: Client-side and server-side data management
- ✅ **Row Selection**: Multi-select with bulk actions
- ✅ **Filtering**: Tab-based filters with auto-count
- ✅ **Search**: Debounced search across columns
- ✅ **Sorting**: Column sorting (client and server-side)
- ✅ **Pagination**: Full pagination with customizable page sizes
- ✅ **Cell Components**: 10 pre-built cell renderers
- ✅ **Loading States**: Skeleton loaders and async operation indicators
- ✅ **Error Handling**: Built-in error display with retry
- ✅ **TypeScript**: Full type safety
- ✅ **Accessible**: ARIA labels and keyboard navigation
- ✅ **Responsive**: Mobile-friendly design

## Installation

The component is already installed in this repository. Dependencies:

```json
{
  "@tanstack/react-table": "^8.x",
  "@radix-ui/react-*": "various",
  "lucide-react": "^0.553.0",
  "tailwindcss": "^4.1.17"
}
```

## Quick Start

### Client-Side Mode

```tsx
import { GCGrid } from "@/components/GCGrid";
import type { ColumnDef } from "@tanstack/react-table";

const columns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: (info) => <TextCell value={info.getValue()} />,
  },
  // ... more columns
];

function MyTable() {
  return (
    <GCGrid
      title="Users"
      data={users}
      columns={columns}
      mode="client"
      selectable
      searchable
      filterTabs={[
        { label: "All", query: null },
        { label: "Active", query: (row) => row.status === "active" },
      ]}
      pagination={{
        pageSize: 10,
        pageSizeOptions: [10, 25, 50, 100],
      }}
    />
  );
}
```

### Server-Side Mode

```tsx
import { GCGrid } from "@/components/GCGrid";
import type { ServerDataParams, ServerDataResponse } from "@/components/GCGrid";

async function fetchUsers(
  params: ServerDataParams
): Promise<ServerDataResponse<User>> {
  const response = await fetch(`/api/users?${new URLSearchParams(params)}`);
  const json = await response.json();
  return {
    data: json.data,
    totalCount: json.total_count,
    pageCount: json.page_count,
  };
}

function MyTable() {
  return (
    <GCGrid
      title="Users"
      columns={columns}
      mode="server"
      onFetchData={fetchUsers}
      selectable
      searchable
      filterTabs={[
        { label: "All", value: null },
        { label: "Active", value: "active" },
      ]}
      pagination={{
        pageSize: 10,
        pageSizeOptions: [10, 25, 50, 100],
      }}
    />
  );
}
```

## API Reference

### GCGrid Props

#### Common Props (Both Modes)

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Grid title displayed in header |
| `columns` | `ColumnDef<TData>[]` | TanStack Table column definitions |
| `mode` | `"client" \| "server"` | Operating mode |
| `selectable` | `boolean?` | Enable row selection |
| `searchable` | `boolean?` | Enable search functionality |
| `searchPlaceholder` | `string?` | Search input placeholder |
| `searchDebounceMs` | `number?` | Search debounce delay (default: 300ms) |
| `actionButtons` | `ActionButton[]?` | Header action buttons |
| `filterTabs` | `FilterTab[]?` | Filter tabs configuration |
| `pagination` | `PaginationConfig?` | Pagination settings |
| `onRowSelect` | `(rows) => void` | Row selection callback |
| `onBulkDelete` | `(ids) => void` | Bulk delete handler |
| `onBulkExport` | `(ids) => void` | Bulk export handler |

#### Client-Mode Specific Props

| Prop | Type | Description |
|------|------|-------------|
| `data` | `TData[]` | Array of data items |
| `filterTabs` | `ClientFilterTab[]?` | Tabs with predicate functions |

#### Server-Mode Specific Props

| Prop | Type | Description |
|------|------|-------------|
| `onFetchData` | `(params) => Promise<Response>` | Data fetching function |
| `filterTabs` | `ServerFilterTab[]?` | Tabs with filter values |
| `onError` | `(error) => void` | Error callback |
| `retryable` | `boolean?` | Show retry button on error |

## Cell Components

GCGrid includes 10 pre-built cell components:

### TextCell
Simple text display with null handling.

```tsx
<TextCell value="Hello World" />
```

### LinkCell
Clickable links with optional onClick handler.

```tsx
<LinkCell
  value="View Profile"
  href="/profile/123"
  onClick={(e) => {
    e.preventDefault();
    navigate("/profile/123");
  }}
/>
```

### BadgeCell
Status badges using shadcn Badge.

```tsx
<BadgeCell
  value="Active"
  variant="default"
/>
```

### CheckboxCell
Checkbox input with indeterminate support.

```tsx
<CheckboxCell
  checked={isChecked}
  onChange={setChecked}
/>
```

### SwitchCell
Toggle switch using shadcn Switch.

```tsx
<SwitchCell
  checked={isEnabled}
  onChange={setEnabled}
/>
```

### ButtonCell
Action button within cell.

```tsx
<ButtonCell
  label="Edit"
  icon={Edit}
  onClick={handleEdit}
  variant="outline"
/>
```

### ToolbarCell
Row of icon buttons with tooltips.

```tsx
<ToolbarCell
  actions={[
    { icon: Star, onClick: handleStar, tooltip: "Favorite" },
    { icon: Edit, onClick: handleEdit, tooltip: "Edit" },
    { icon: Trash, onClick: handleDelete, tooltip: "Delete", destructive: true },
  ]}
  row={rowData}
/>
```

### MenuCell
Dropdown menu with actions.

```tsx
<MenuCell
  actions={[
    { label: "Edit", icon: Edit, onClick: handleEdit },
    { label: "Delete", icon: Trash, onClick: handleDelete, destructive: true },
  ]}
  row={rowData}
/>
```

### GripperCell
Drag handle for row reordering.

```tsx
<GripperCell
  onDragStart={handleDragStart}
  onDragEnd={handleDragEnd}
/>
```

### CustomCell
Flexible wrapper for custom content.

```tsx
<CustomCell>
  <div className="flex items-center gap-2">
    <Avatar />
    <span>{name}</span>
  </div>
</CustomCell>
```

## Rails Backend Integration

### Controller Example

```ruby
# app/controllers/api/users_controller.rb
class Api::UsersController < ApplicationController
  def index
    @users = User.all

    # Filtering
    if params[:filters].present?
      @users = @users.where(status: params[:filters])
    end

    # Search
    if params[:search].present?
      @users = @users.where(
        "name ILIKE :search OR email ILIKE :search",
        search: "%#{params[:search]}%"
      )
    end

    # Sorting
    if params[:sort_by].present?
      direction = params[:sort_order] || 'asc'
      @users = @users.order("#{params[:sort_by]} #{direction}")
    end

    # Pagination
    page = params[:page]&.to_i || 1
    per_page = params[:page_size]&.to_i || 10
    @users = @users.page(page).per(per_page)

    render json: {
      data: @users,
      total_count: @users.total_count,
      page_count: @users.total_pages,
      current_page: page
    }
  end
end
```

### API Request Format

Server-side mode sends these parameters:

```
GET /api/users?
  page=1
  &page_size=10
  &search=john
  &filters=active
  &sort_by=created_at
  &sort_order=desc
```

### API Response Format

```json
{
  "data": [...],
  "total_count": 100,
  "page_count": 10,
  "current_page": 1
}
```

## Advanced Usage

### Custom Loading Component

```tsx
<GCGrid
  // ... other props
  loadingComponent={<MyCustomLoader />}
/>
```

### Custom Empty State

```tsx
<GCGrid
  // ... other props
  emptyComponent={<MyEmptyState />}
/>
```

### Custom Error Handler

```tsx
<GCGrid
  // ... other props
  mode="server"
  onError={(error) => {
    toast.error(error.message);
    logError(error);
  }}
  errorComponent={<MyErrorComponent />}
/>
```

### Row Click Handler

```tsx
<GCGrid
  // ... other props
  onRowClick={(row) => {
    navigate(`/users/${row.original.id}`);
  }}
/>
```

## Performance Best Practices

1. **Memoize Columns**: Wrap column definitions in `useMemo` to prevent re-renders
2. **Optimize Cell Renderers**: Keep cell components lightweight
3. **Server-Side for Large Datasets**: Use server-side mode for >1000 rows
4. **Debounce Search**: Default 300ms is good for most cases
5. **Lazy Load Images**: Use lazy loading for images in cells
6. **Virtual Scrolling**: For extremely large datasets, consider adding virtual scrolling

## Testing

Run the development server to test:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

## TypeScript

The component is fully typed. Import types as needed:

```tsx
import type {
  GCGridProps,
  ServerDataParams,
  ServerDataResponse,
  ActionButton,
  FilterTab,
  ToolbarAction,
  MenuAction,
} from "@/components/GCGrid";
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

See [MIGRATION.md](./MIGRATION.md) for guidelines on migrating existing tables to use GCGrid.

## Support

For issues or questions, please contact the GiveCampus engineering team.
