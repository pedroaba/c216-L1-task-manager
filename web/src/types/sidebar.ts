import type { ElementType, ReactNode } from "react";

export type SidebarItem = {
  title: string;
  icon: ReactNode | ElementType;
  url: string;
  badge?: string;
  items?: SidebarItem[];
};
