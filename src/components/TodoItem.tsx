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
  // onDelete: (id: string) => void;
  viewMode?: "grid" | "list";
  onTaskSelect: (todo: Todo) => void;
  selectedTaskId?: string;
}

const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onToggleComplete,
  onToggleStar,
  onEdit,
  // onDelete,
  viewMode,
  onTaskSelect,
  selectedTaskId,
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

  return (
    <>
      {viewMode === "grid" ? (
        <>
          <td className="py-1 px-4" onClick={(e) => e.stopPropagation()}>
            <TaskCompleteCheckMark
              todo={todo}
              onToggleComplete={onToggleComplete}
              className="hover:border border-gray-400 p-1 w-8}"
            />
          </td>
          <td
            className={`py-1 px-4 text-sm hover:border-2 hover:border-gray-400 ${
              selectedTaskId === todo.id
                ? "border-2 border-blue-600 hover:border-blue-600"
                : todo.completed
                ? " line-through text-[#605e5c]"
                : ""
            }`}
            // onClick={() => onTaskSelect(todo)}
            onClick={() => onEdit(todo)}
          >
            {todo.title}
          </td>
          <td className="py-1 px-4 text-sm ">
            {todo.dueDate && (
              <div
                className={`flex items-center gap-2 font-semibold ${
                  isDueSoon ? "text-red-600" : ""
                }`}
              >
                <div className="flex items-center">
                  <CalendarMonthRegular className="text-sm" />
                  <span>{formatDueDate(todo.dueDate)}</span>
                </div>
                {isDueSoon && <WarningRegular className="text-sm" />}
              </div>
            )}
          </td>
          <td className="py-1 px-4" onClick={(e) => e.stopPropagation()}>
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
          </td>
        </>
      ) : (
        <article
          className={`flex justify-between px-4 items-center h-14 shadow-md bg-white hover:bg-gray-100 cursor-pointer ${
            selectedTaskId === todo.id ? "bg-blue-300 hover:bg-blue-300" : ""
          }`}
          // onClick={() => onTaskSelect(task)}
          onClick={() => onEdit(todo)}
        >
          <div className="flex items-center gap-2">
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
              {/* <p className=" text-xs text-red-500">{todo.dueDate}</p> */}
            </div>
          </div>
          <div className="" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => onToggleStar(todo.id)}
              className="text-gray-400 hover:text-blue-600 "
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
        </article>
      )}
    </>
    // <div
    //   className={`task-item ${todo.completed ? "task-completed" : ""}`}
    //   onMouseEnter={() => setIsHovered(true)}
    //   onMouseLeave={() => setIsHovered(false)}
    // >
    //   <div className="task-checkbox" onClick={() => onToggleComplete(todo.id)}>
    //     {todo.completed ? (
    //       <CheckmarkCircleRegular className="checkbox-icon checkbox-checked" />
    //     ) : (
    //       <CircleRegular className="checkbox-icon" />
    //     )}
    //   </div>

    //   <div className="task-content">
    //     <div className="task-title-row">
    //       <span
    //         className={`task-title ${
    //           todo.completed ? "task-title-completed" : ""
    //         }`}
    //       >
    //         {todo.title}
    //       </span>

    //       <div className="task-actions">
    //         {isHovered && (
    //           <>
    //             <button
    //               className="task-action-btn"
    //               onClick={() => onEdit(todo)}
    //               aria-label="Edit task"
    //             >
    //               <EditRegular />
    //             </button>
    //             <button
    //               className="task-action-btn"
    // onClick={() => onDelete(todo.id)}
    //               aria-label="Delete task"
    //             >
    //               <DeleteRegular />
    //             </button>
    //           </>
    //         )}

    //         <button
    //           className="task-star-btn"
    //           onClick={() => onToggleStar(todo.id)}
    //           aria-label={todo.isStarred ? "Unstar task" : "Star task"}
    //         >
    //           {todo.isStarred ? (
    //             <StarFilled className="star-filled" />
    //           ) : (
    //             <StarRegular className="star-outline" />
    //           )}
    //         </button>
    //       </div>
    //     </div>

    //     {todo.description && (
    //       <p className="task-description">{todo.description}</p>
    //     )}

    //     <div className="task-meta">
    //       {todo.dueDate && (
    //         <div
    //           className={`task-due-date ${isDueSoon ? "task-due-soon" : ""}`}
    //         >
    //           <CalendarMonthRegular className="due-date-icon" />
    //           <span>{formatDueDate(todo.dueDate)}</span>
    //           {isDueSoon && <WarningRegular className="due-soon-icon" />}
    //         </div>
    //       )}

    //       <div className={`task-priority ${getPriorityColor(todo.priority)}`}>
    //         {todo.priority}
    //       </div>

    //       {getCategoryBadge(todo.category)}
    //     </div>
    //   </div>
    // </div>
  );
};

export default TodoItem;
