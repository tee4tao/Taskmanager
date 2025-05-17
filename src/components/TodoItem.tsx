"use client";

import type React from "react";
import { useState } from "react";
import { type Todo, Priority, type Category } from "../types/todo";
import {
  CheckmarkCircleRegular,
  CircleRegular,
  StarRegular,
  StarFilled,
  EditRegular,
  DeleteRegular,
  CalendarMonthRegular,
  WarningRegular,
  NoteRegular,
} from "@fluentui/react-icons";
import TaskCompleteCheckMark from "./TaskCompleteCheckMark";
import { TooltipIcon } from "./TooltipIcon";

interface TodoItemProps {
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onEdit: (todo: Todo) => void;
  viewMode?: "grid" | "list";
  onTaskSelect: (todo: Todo) => void;
  selectedTaskId?: string;
  dragHandle?: React.ReactNode;
  isDragOverlay?: boolean;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onToggleStar,
  onEdit,
  viewMode,
  onTaskSelect,
  selectedTaskId,
  dragHandle,
  isDragOverlay = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Determine if the task is due soon (within 24 hours)
  const isDueSoon =
    todo.dueDate &&
    !todo.completed &&
    new Date(todo.dueDate).getTime() - new Date().getTime() <=
      24 * 60 * 60 * 1000;

  // Format the due date
  const formatDueDate = (date?: Date) => {
    if (!date) return "";

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dueDate = new Date(date);

    if (
      dueDate.toDateString() === today.toDateString() &&
      viewMode !== "grid"
    ) {
      return "Today";
    } else if (
      dueDate.toDateString() === tomorrow.toDateString() &&
      viewMode !== "grid"
    ) {
      return "Tomorrow";
    } else if (viewMode === "grid") {
      return dueDate.toLocaleDateString("en-GB").replace(/\//g, "/");
    } else {
      return dueDate.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year:
          dueDate.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
      });
    }
  };

  // Get priority color
  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case Priority.High:
        return "task-priority-high";
      case Priority.Medium:
        return "task-priority-medium";
      case Priority.Low:
        return "task-priority-low";
      default:
        return "";
    }
  };

  // Get category badge
  const getCategoryBadge = (category: Category) => {
    return (
      <span className={`task-category task-category-${category.toLowerCase()}`}>
        {category}
      </span>
    );
  };

  // Handle click events
  const handleItemClick = (e: React.MouseEvent) => {
    if (!isDragOverlay) {
      onEdit(todo);
    }
  };

  return (
    <>
      {viewMode === "grid" ? (
        <div
          className={`grid grid-cols-[auto_auto_1fr_auto_auto] items-center w-full ${
            selectedTaskId === todo.id
              ? "bg-blue-50 border-l-4 border-blue-500"
              : todo.completed
              ? "text-gray-500"
              : ""
          }`}
          onClick={handleItemClick}
        >
          {/* Drag handle column */}
          <div className="py-2 px-1">{dragHandle}</div>

          {/* Checkbox column */}
          <div className="py-2 px-1" onClick={(e) => e.stopPropagation()}>
            <TaskCompleteCheckMark
              todo={todo}
              onToggleComplete={onToggleComplete}
              className="hover:border border-gray-400 p-1"
            />
          </div>

          {/* Title column */}
          <div
            className={`py-2 px-4 text-sm ${
              todo.completed ? "line-through text-[#605e5c]" : ""
            }`}
          >
            {todo.title}
          </div>

          {/* Due date column */}
          <div className="py-2 px-4 text-sm whitespace-nowrap">
            {todo.dueDate && (
              <div
                className={`flex items-center gap-2 font-semibold ${
                  isDueSoon ? "text-red-600" : ""
                }`}
              >
                <div className="flex items-center gap-1">
                  <CalendarMonthRegular className="text-sm" />
                  <span>{formatDueDate(todo.dueDate)}</span>
                </div>
                {isDueSoon && <WarningRegular className="text-sm" />}
              </div>
            )}
          </div>

          {/* Star column */}
          <div className="py-2 px-4" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleStar(todo.id)}
              className="text-gray-400 hover:text-blue-600 hover:border border-gray-400 px-2"
            >
              {todo.isStarred ? (
                <TooltipIcon
                  icon={StarFilled}
                  tooltipText="Remove importance"
                  className="text-blue-600"
                  tipClassName="left-0 -translate-x-full bottom-full"
                />
              ) : (
                <TooltipIcon
                  icon={StarRegular}
                  tooltipText="Mark task as important"
                  className="text-blue-600"
                  tipClassName="left-0 -translate-x-full bottom-full"
                />
              )}
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`flex justify-between px-2 items-center h-14 shadow-md bg-white hover:bg-gray-100 ${
            isDragOverlay ? "" : "cursor-pointer"
          } ${
            selectedTaskId === todo.id
              ? "bg-blue-100 border-l-4 border-blue-500"
              : ""
          }`}
          onClick={handleItemClick}
        >
          <div className="flex items-center gap-2">
            {/* Drag handle for list view */}
            {dragHandle}

            <div className="" onClick={(e) => e.stopPropagation()}>
              <TaskCompleteCheckMark
                todo={todo}
                onToggleComplete={onToggleComplete}
                className=""
              />
            </div>
            <div>
              <div
                className={`text-sm font-medium ${
                  todo.completed ? " line-through text-[#605e5c]" : ""
                }`}
              >
                {todo.title}
              </div>
              <div className="flex items-center gap-2">
                {todo.dueDate && (
                  <p
                    className={`text-xs flex items-center gap-2 font-semibold ${
                      isDueSoon ? "text-red-600" : ""
                    }`}
                  >
                    <div className="flex items-center">
                      <CalendarMonthRegular className="text-sm" />
                      <span>{formatDueDate(todo.dueDate)}</span>
                    </div>
                    {isDueSoon && <WarningRegular className="text-sm" />}
                  </p>
                )}
                {todo.dueDate && todo.description && (
                  <span className="mx-1">•</span>
                )}
                {todo.description && (
                  <p className="task-description flex items-center gap-1 text-sm text-[#605e5c]">
                    <NoteRegular /> <span>Note</span>
                  </p>
                )}
                {(todo.dueDate || todo.description) && (
                  <span className="mx-1">•</span>
                )}
                {getCategoryBadge(todo.category)}
              </div>
            </div>
          </div>
          <div className="" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleStar(todo.id)}
              className="text-gray-400 hover:text-blue-600"
            >
              {todo.isStarred ? (
                <TooltipIcon
                  icon={StarFilled}
                  tooltipText="Remove importance"
                  className="text-blue-600"
                  tipClassName="left-0 -translate-x-full bottom-full"
                />
              ) : (
                <TooltipIcon
                  icon={StarRegular}
                  tooltipText="Mark task as important"
                  className="text-blue-600"
                  tipClassName="left-0 -translate-x-full bottom-full"
                />
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoItem;
