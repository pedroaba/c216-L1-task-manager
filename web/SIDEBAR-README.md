# Notion-Style Sidebar

## 📋 What was implemented

A modern and responsive sidebar inspired by Notion, with the following features:

### ✨ Features

- **Collapsible**: Can be expanded or collapsed to icon mode
- **Header with Workspace**: Top section with dropdown to switch workspaces
- **Main Navigation**: Quick links for search, home, inbox, settings
- **Hierarchical Menu**: Support for submenus and expandable items (Projects, Tasks)
- **Footer with Profile**: User information with dropdown options
- **Badges**: Visual notifications (e.g., 3 items in Inbox)
- **Tooltips**: Visual hints when the sidebar is collapsed
- **Keyboard Shortcut**: `Cmd/Ctrl + B` to toggle the sidebar
- **Fully Responsive**: On mobile, the sidebar transforms into a drawer/sheet

## 🎨 File Structure

```
src/
├── components/
│   ├── app-sidebar.tsx          # Main sidebar component
│   └── ui/                       # shadcn/ui components (already existing)
│       ├── sidebar.tsx
│       ├── dropdown-menu.tsx
│       ├── avatar.tsx
│       ├── button.tsx
│       └── ...
└── app/
    └── (dashboard)/
        └── layout.tsx            # Layout updated with SidebarProvider
```

## 🚀 How to Use

The sidebar is already integrated into the dashboard layout and will work automatically on all pages within the `(dashboard)` group.

### Customizing Menu Items

Edit the `src/components/app-sidebar.tsx` file:

```typescript
// Main navigation
const mainNavItems = [
  {
    title: "Search",
    icon: SearchIcon,
    url: "/search",
  },
  {
    title: "Inbox",
    icon: InboxIcon,
    url: "/inbox",
    badge: "3", // Add optional badges
  },
  // Add more items here
];

// Workspace with submenus
const workspaceItems = [
  {
    title: "Projects",
    icon: InboxIcon,
    url: "/projects",
    isOpen: true, // Defines if it starts expanded
    items: [
      { title: "Project A", url: "/projects/a" },
      { title: "Project B", url: "/projects/b" },
    ],
  },
  // Add more sections here
];
```

### Adding New Icons

Import from `lucide-react`:

```typescript
import { CalendarIcon, FileIcon, UsersIcon } from "lucide-react";
```

### Customizing User Information

In the sidebar footer (`app-sidebar.tsx`), update:

```typescript
<Avatar className="size-8">
  <AvatarImage alt="User" src="/your-avatar.png" />
  <AvatarFallback>UN</AvatarFallback>
</Avatar>
<div>
  <span className="font-semibold">Your Name</span>
  <span className="text-xs">your@email.com</span>
</div>
```

### Customizing the Workspace

In the sidebar header:

```typescript
<div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
  <span className="font-semibold text-sm">YI</span> {/* Your initials */}
</div>
<div>
  <span className="font-semibold">Your Workspace</span>
  <span className="text-xs">Workspace</span>
</div>
```

## 🎯 Behaviors

### Desktop

- **Expanded State**: Shows all texts and icons
- **Collapsed State**: Shows only icons with tooltips
- **Toggle**: Click the header button or press `Cmd/Ctrl + B`

### Mobile

- The sidebar is hidden by default
- Opens as a side drawer when clicking the menu button
- Closes automatically when navigating

## 🎨 Style Customization

The sidebar uses theme colors defined in `app/globals.css`:

```css
--sidebar: /* Background color */
--sidebar-foreground: /* Text color */
--sidebar-accent: /* Hover/active color */
--sidebar-accent-foreground: /* Text on accent */
--sidebar-border: /* Border color */
```

### Available Variants

```typescript
<Sidebar
  collapsible="icon" // "offcanvas" | "icon" | "none"
  variant="sidebar" // "sidebar" | "floating" | "inset"
/>
```

## 📱 Responsiveness

- **Desktop (≥768px)**: Fixed side sidebar
- **Mobile (<768px)**: Sliding drawer

## 🔧 Components Used

- `Sidebar` - Main container
- `SidebarProvider` - Context and state
- `SidebarTrigger` - Toggle button
- `SidebarInset` - Main content area
- `SidebarMenu` - Navigation list
- `SidebarMenuButton` - Menu buttons
- `Collapsible` - Expandable submenus
- `DropdownMenu` - Context menus
- `Avatar` - User photo

## 💡 Tips

1. **Add tooltips**: Use the `tooltip` prop on `SidebarMenuButton` for better UX
2. **Use badges**: Show notifications with counters
3. **Organize by groups**: Use `SidebarGroup` to separate sections
4. **Deep links support**: Links work with Next.js Link
5. **Add loading states**: Use `SidebarMenuSkeleton` during loading

## 🐛 Troubleshooting

### Sidebar doesn't appear

- Check if `SidebarProvider` wraps your layout
- Confirm you're inside the `(dashboard)` group

### Icons don't appear

- Check if you imported from `lucide-react`
- Confirm the component is inside `SidebarMenuButton`

### Styles don't apply

- Run `pnpm run dev` again
- Clear Next.js cache: `rm -rf .next`

## 📚 Resources

- [Shadcn/ui Sidebar](https://ui.shadcn.com/docs/components/sidebar)
- [Lucide Icons](https://lucide.dev/icons/)
- [Next.js App Router](https://nextjs.org/docs/app)
