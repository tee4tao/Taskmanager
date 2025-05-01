import type React from "react";
export interface Task {
  id: number;
  title: string;
  dueDate: string;
  isImportant: boolean;
  isCompleted: boolean;
  notes?: string;
  category?: string;
}

export interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
}
