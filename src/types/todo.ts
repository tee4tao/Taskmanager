import { v4 as uuidv4 } from "uuid";

export enum Priority {
  Low = "low",
  Medium = "medium",
  High = "high",
}

export enum Category {
  Personal = "personal",
  Work = "work",
  Shopping = "shopping",
  Health = "health",
  Other = "other",
}

export interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: Date;
  priority: Priority;
  category: Category;
  isStarred: boolean;
}

export const createTodo = (
  title: string,
  description = "",
  dueDate?: Date,
  priority: Priority = Priority.Medium,
  category: Category = Category.Other
): Todo => {
  return {
    id: uuidv4(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
    dueDate,
    priority,
    category,
    isStarred: false,
  };
};
