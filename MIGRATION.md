# GCGrid Migration Guide

This guide will help you migrate existing table implementations to use the GCGrid component.

## Why Migrate?

- **Consistency**: Unified table experience across all products
- **Features**: Built-in search, filtering, sorting, and pagination
- **Performance**: Optimized for both small and large datasets
- **Maintenance**: Single source of truth for table logic
- **Accessibility**: ARIA-compliant and keyboard navigable

## Migration Checklist

- [ ] Identify table type (client-side or server-side)
- [ ] Create column definitions
- [ ] Replace existing table component
- [ ] Test all functionality
- [ ] Update backend API (if server-side)
- [ ] Remove old table code

## Step-by-Step Migration

### Step 1: Analyze Current Implementation

Identify what type of table you're replacing:

**Client-Side Tables** (all data loaded upfront):
- Simple tables with < 1000 rows
- Tables using `Array.filter()`, `Array.sort()`, etc.
- No API calls for pagination/filtering

**Server-Side Tables** (data fetched from API):
- Large datasets (> 1000 rows)
- API calls for search, filter, sort, pagination
- Backend handles data operations

### Step 2: Create Column Definitions

Transform your existing columns into TanStack Table format.

#### Before (Old Table):

```jsx
<Table>
  <TableHead>
    <TableRow>
      <TableHeader>Name</TableHeader>
      <TableHeader>Email</TableHeader>
      <TableHeader>Status</TableHeader>
    </TableRow>
  </TableHead>
  <TableBody>
    {data.map((row) => (
      <TableRow key={row.id}>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.email}</TableCell>
        <TableCell>
          <Badge>{row.status}</Badge>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### After (GCGrid):

```tsx
import type { ColumnDef } from "@tanstack/react-table";
import { GCGrid, TextCell, BadgeCell } from "@/components/GCGrid";

const columns: ColumnDef<User>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: (info) => <TextCell value={info.getValue()} />,
    enableSorting: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: (info) => <TextCell value={info.getValue()} />,
    enableSorting: true,
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: (info) => (
      <BadgeCell
        value={info.getValue()}
        variant={info.getValue() === "Active" ? "default" : "secondary"}
      />
    ),
  },
];

<GCGrid
  title="Users"
  data={data}
  columns={columns}
  mode="client"
  searchable
  pagination={{ pageSize: 10, pageSizeOptions: [10, 25, 50] }}
/>
```

### Step 3: Migrate Client-Side Tables

#### Before:

```jsx
function UsersTable() {
  const [data, setData] = useState(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("all");

  const filteredData = useMemo(() => {
    let result = data;

    // Apply filter
    if (filter !== "all") {
      result = result.filter((user) => user.status === filter);
    }

    // Apply search
    if (searchTerm) {
      result = result.filter(
        (user) =>
          user.name.includes(searchTerm) || user.email.includes(searchTerm)
      );
    }

    return result;
  }, [data, filter, searchTerm]);

  // Manual pagination logic
  const paginatedData = filteredData.slice(
    (currentPage - 1) * 10,
    currentPage * 10
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("active")}>Active</button>
        <button onClick={() => setFilter("inactive")}>Inactive</button>
      </div>

      <Table>
        {/* Table markup... */}
      </Table>

      <Pagination
        currentPage={currentPage}
        totalPages={Math.ceil(filteredData.length / 10)}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
```

#### After:

```tsx
import { GCGrid } from "@/components/GCGrid";

function UsersTable() {
  return (
    <GCGrid
      title="Users"
      data={users}
      columns={columns}
      mode="client"
      searchable
      searchPlaceholder="Search users..."
      filterTabs={[
        { label: "All", query: null },
        { label: "Active", query: (row) => row.status === "active" },
        { label: "Inactive", query: (row) => row.status === "inactive" },
      ]}
      pagination={{
        pageSize: 10,
        pageSizeOptions: [10, 25, 50],
      }}
    />
  );
}
```

**Benefits**:
- Reduced from ~60 lines to ~20 lines
- Built-in search debouncing
- Automatic filter counts
- No manual state management

### Step 4: Migrate Server-Side Tables

#### Before:

```tsx
function UsersTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(page),
          search,
          filter,
        });
        const response = await fetch(`/api/users?${params}`);
        const json = await response.json();
        setData(json.data);
        setTotalCount(json.total_count);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [page, search, filter]);

  if (loading) return <Loading />;

  return (
    <div>
      {/* Search, filters, table, pagination... */}
    </div>
  );
}
```

#### After:

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

function UsersTable() {
  return (
    <GCGrid
      title="Users"
      columns={columns}
      mode="server"
      onFetchData={fetchUsers}
      searchable
      filterTabs={[
        { label: "All", value: null },
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ]}
      pagination={{
        pageSize: 10,
        pageSizeOptions: [10, 25, 50],
      }}
    />
  );
}
```

**Benefits**:
- No manual loading state management
- Automatic request cancellation
- Built-in error handling
- Optimistic updates

### Step 5: Update Backend API (Server-Side Only)

Ensure your Rails API supports these query parameters:

```ruby
# app/controllers/api/users_controller.rb
class Api::UsersController < ApplicationController
  def index
    @users = User.all

    # GCGrid sends these parameters:
    # - page: integer
    # - page_size: integer
    # - search: string
    # - filters: string
    # - sort_by: string
    # - sort_order: "asc" | "desc"

    # Filtering
    if params[:filters].present? && params[:filters] != "all"
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
      direction = params[:sort_order] || "asc"
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
      current_page: page,
    }
  end
end
```

### Step 6: Migrate Special Features

#### Row Actions

Before:
```jsx
<TableCell>
  <button onClick={() => handleEdit(row)}>Edit</button>
  <button onClick={() => handleDelete(row)}>Delete</button>
</TableCell>
```

After:
```tsx
{
  id: "actions",
  header: "",
  cell: (info) => (
    <ToolbarCell
      actions={[
        { icon: Edit, onClick: () => handleEdit(info.row.original), tooltip: "Edit" },
        { icon: Trash, onClick: () => handleDelete(info.row.original), tooltip: "Delete", destructive: true },
      ]}
    />
  ),
}
```

#### Selection & Bulk Actions

Before:
```jsx
const [selectedRows, setSelectedRows] = useState([]);
// Manual checkbox management...
```

After:
```tsx
<GCGrid
  // ... other props
  selectable
  onBulkDelete={async (ids) => {
    await fetch("/api/users/bulk_delete", {
      method: "DELETE",
      body: JSON.stringify({ ids }),
    });
  }}
  onBulkExport={async (ids) => {
    // Handle export
  }}
/>
```

#### Custom Cells

Use the appropriate cell component:

```tsx
// Text
<TextCell value={row.name} />

// Link
<LinkCell value={row.name} href={`/users/${row.id}`} />

// Badge
<BadgeCell value={row.status} variant="default" />

// Switch
<SwitchCell checked={row.enabled} onChange={handleToggle} />

// Custom
<CustomCell>
  <div className="flex items-center gap-2">
    <Avatar src={row.avatar} />
    <span>{row.name}</span>
  </div>
</CustomCell>
```

## Common Migration Patterns

### Pattern 1: Nested Data

**Before**: Flattening nested data manually

**After**: Use `accessorFn` instead of `accessorKey`

```tsx
{
  id: "company_name",
  accessorFn: (row) => row.company.name,
  header: "Company",
  cell: (info) => <TextCell value={info.getValue()} />,
}
```

### Pattern 2: Conditional Rendering

**Before**: Complex conditional logic in JSX

**After**: Handle in cell renderer

```tsx
{
  id: "status",
  accessorKey: "status",
  header: "Status",
  cell: (info) => {
    const value = info.getValue();
    return (
      <BadgeCell
        value={value}
        variant={
          value === "active" ? "default" :
          value === "pending" ? "secondary" :
          "outline"
        }
      />
    );
  },
}
```

### Pattern 3: Formatted Values

**Before**: Manual formatting in JSX

**After**: Format in accessor or cell

```tsx
{
  id: "created_at",
  accessorKey: "created_at",
  header: "Created",
  cell: (info) => (
    <TextCell value={new Date(info.getValue()).toLocaleDateString()} />
  ),
}
```

## Testing Your Migration

1. **Visual Testing**: Verify the table looks correct
2. **Functional Testing**: Test all features (search, sort, filter, pagination)
3. **Performance Testing**: Ensure it's not slower than before
4. **Accessibility Testing**: Test with keyboard and screen reader
5. **Mobile Testing**: Verify responsive behavior

## Rollback Plan

If issues arise:

1. Keep old table code commented out initially
2. Add feature flag to toggle between old/new
3. Monitor for errors in production
4. Have rollback deploy ready

## Need Help?

- Check the [README.md](./README.md) for full API documentation
- Review [App.tsx](./src/App.tsx) for example implementations
- Contact the GiveCampus engineering team

## Next Steps After Migration

1. Remove old table component code
2. Update tests
3. Update documentation
4. Share learnings with team
5. Identify other tables to migrate

Good luck with your migration!
