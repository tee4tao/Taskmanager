"use client";

import type React from "react";
import type { Task } from "../types";
import {
  StarRegular,
  StarFilled,
  CircleRegular,
  CheckmarkCircleRegular,
} from "@fluentui/react-icons";
import { TooltipIcon } from "./TooltipIcon";
import TaskCompleteCheckMark from "./TaskCompleteCheckMark";

import { useState, useEffect } from "react";
import type { Todo, Priority, Category } from "../types/todo";
// import TodoItem from "./TodoItem";
// import EditTodoModal from "./EditTodoModal";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoItem from "./TodoItem";
import TaskDetailsSidebar from "./TaskDetailsSidebar";

interface TodoListProps {
  todos: Todo[];
  filter: {
    searchTerm: string;
    showCompleted: boolean;
    priority: Priority | "all";
    category: Category | "all";
    onlyStarred: boolean;
  };
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onReorderTodos: (startIndex: number, endIndex: number) => void;
}

interface DraggableTodoItemProps {
  index: number;
  todo: Todo;
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
  onReorderTodos: (startIndex: number, endIndex: number) => void;
  viewMode: "grid" | "list";
  onTaskSelect: (todo: Todo) => void;
  selectedTaskId?: string;
}

const DraggableTodoItem: React.FC<DraggableTodoItemProps> = ({
  index,
  todo,
  onToggleComplete,
  onToggleStar,
  onEdit,
  onDelete,
  onReorderTodos,
  viewMode,
  onTaskSelect,
  selectedTaskId,
}) => {
  const [{ isDragging }, drag] = useDrag({
    type: "TODO_ITEM",
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TODO_ITEM",
    hover(item: { index: number }) {
      if (item.index !== index) {
        onReorderTodos(item.index, index);
        item.index = index;
      }
    },
  });
  return (
    <tr
      ref={(node) => {
        if (node) {
          drag(drop(node));
        }
      }}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      className={`${viewMode === "grid" && "border-b h-10"}`}
    >
      <TodoItem
        todo={todo}
        onToggleComplete={onToggleComplete}
        onToggleStar={onToggleStar}
        onEdit={onEdit}
        onDelete={onDelete}
        viewMode={viewMode}
        selectedTaskId={selectedTaskId}
        onTaskSelect={onTaskSelect}
      />
    </tr>
  );
};

interface TaskListProps {
  tasks: Task[];
  // toggleTaskImportance: (taskId: number) => void;
  // toggleTaskCompletion: (taskId: number) => void;
  onTaskSelect: (todo: Todo) => void;
  selectedTaskId?: string;
  viewMode: "grid" | "list";
  todos: Todo[];
  filter: {
    searchTerm: string;
    showCompleted: boolean;
    priority: Priority | "all";
    category: Category | "all";
    onlyStarred: boolean;
  };
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onReorderTodos: (startIndex: number, endIndex: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  // toggleTaskImportance,
  // toggleTaskCompletion,
  onTaskSelect,
  selectedTaskId,
  viewMode,
  todos,
  filter,
  onToggleComplete,
  onToggleStar,
  onUpdateTodo,
  onDeleteTodo,
  onReorderTodos,
}) => {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  // Apply filters to todos
  useEffect(() => {
    let result = [...todos];

    // Filter by search term
    if (filter.searchTerm) {
      const searchLower = filter.searchTerm.toLowerCase();
      result = result.filter(
        (todo) =>
          todo.title.toLowerCase().includes(searchLower) ||
          (todo.description &&
            todo.description.toLowerCase().includes(searchLower))
      );
    }

    // Filter by completion status
    if (!filter.showCompleted) {
      result = result.filter((todo) => !todo.completed);
    }

    // Filter by priority
    if (filter.priority !== "all") {
      result = result.filter((todo) => todo.priority === filter.priority);
    }

    // Filter by category
    if (filter.category !== "all") {
      result = result.filter((todo) => todo.category === filter.category);
    }

    // Filter by starred status
    if (filter.onlyStarred) {
      result = result.filter((todo) => todo.isStarred);
    }

    setFilteredTodos(result);
  }, [todos, filter]);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleCloseModal = () => {
    setEditingTodo(null);
  };

  const handleSaveTodo = (updatedTodo: Todo) => {
    onUpdateTodo(updatedTodo);
    setEditingTodo(null);
  };

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-todo-list">
        <p>No tasks match your current filters</p>
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <section className="flex-1 overflow-auto">
        {viewMode === "grid" ? (
          <table className="min-w-full bg-white shadow-lg">
            <thead className=" border-b">
              <tr>
                <th className="text-left py-3 px-4 font-normal text-sm text-gray-600 w-8"></th>
                <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
                  Due Date
                </th>
                <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
                  Importance
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos.map((todo, index) => (
                <DraggableTodoItem
                  key={todo.id}
                  index={index}
                  todo={todo}
                  onToggleComplete={onToggleComplete}
                  onToggleStar={onToggleStar}
                  onEdit={handleEditTodo}
                  onDelete={onDeleteTodo}
                  onReorderTodos={onReorderTodos}
                  viewMode={viewMode}
                  selectedTaskId={selectedTaskId}
                  onTaskSelect={onTaskSelect}
                />
              ))}
              {/* {tasks.map((task) => (
              <tr key={task.id} className={`border-b h-10  `}>
                <td className="py-1 px-4" onClick={(e) => e.stopPropagation()}>
                  <TaskCompleteCheckMark
                    task={task}
                    toggleTaskCompletion={toggleTaskCompletion}
                    className="hover:border border-gray-400 p-1 w-8"
                  />
                </td>
                <td
                  className={`py-1 px-4 text-sm hover:border-2 hover:border-gray-400 ${
                    selectedTaskId === task.id
                      ? "border-2 border-blue-600 hover:border-blue-600"
                      : ""
                  }`}
                  onClick={() => onTaskSelect(task)}
                >
                  {task.title}
                </td>
                <td className="py-1 px-4 text-sm text-red-500">
                  {task.dueDate}
                </td>
                <td className="py-1 px-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleTaskImportance(task.id)}
                    className="text-gray-400 hover:text-blue-600 hover:border border-gray-400 px-2"
                  >
                    {task.isImportant ? (
                      <TooltipIcon
                        icon={StarFilled}
                        tooltipText="Remove importance"
                        className="text-blue-600"
                      />
                    ) : (
                      <TooltipIcon
                        icon={StarRegular}
                        tooltipText="Mark task as important"
                        className="text-blue-600"
                      />
                    )}
                  </button>
                </td>
              </tr>
            ))} */}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredTodos.map((todo, index) => (
              <DraggableTodoItem
                key={todo.id}
                index={index}
                todo={todo}
                onToggleComplete={onToggleComplete}
                onToggleStar={onToggleStar}
                onEdit={handleEditTodo}
                onDelete={onDeleteTodo}
                onReorderTodos={onReorderTodos}
                viewMode={viewMode}
                selectedTaskId={selectedTaskId}
                onTaskSelect={onTaskSelect}
              />
            ))}
            {/* {tasks.map((task) => (
              <article
                key={task.id}
                className={`flex justify-between px-4 items-center h-14 shadow-md bg-white hover:bg-gray-100 cursor-pointer ${
                  selectedTaskId === task.id
                    ? "bg-blue-300 hover:bg-blue-300"
                    : ""
                }`}
                onClick={() => onTaskSelect(task)}
              >
                <div className="flex items-center gap-2">
                  <div className="" onClick={(e) => e.stopPropagation()}>
                    <TaskCompleteCheckMark
                      todo={task}
                      toggleTaskCompletion={toggleTaskCompletion}
                      className=""
                    />
                  </div>
                  <div>
                    <div className={` text-sm `}>{task.title}</div>
                    <p className=" text-xs text-red-500">{task.dueDate}</p>
                  </div>
                </div>
                <div className="" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleTaskImportance(task.id)}
                    className="text-gray-400 hover:text-blue-600 "
                  >
                    {task.isImportant ? (
                      <TooltipIcon
                        icon={StarFilled}
                        tooltipText="Remove importance"
                        className="text-blue-600"
                        tipClassName="left-0 -translate-x-full"
                      />
                    ) : (
                      <TooltipIcon
                        icon={StarRegular}
                        tooltipText="Mark task as important"
                        className="text-blue-600"
                        tipClassName="left-0 -translate-x-full"
                      />
                    )}
                  </button>
                </div>
              </article>
            ))} */}
          </div>
        )}
        {/* <table className="min-w-full bg-white shadow-lg">
        <thead className=" border-b">
          <tr>
            <th className="text-left py-3 px-4 font-normal text-sm text-gray-600 w-8"></th>
            <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
              Title
            </th>
            <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
              Due Date
            </th>
            <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
              Importance
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={`border-b h-10  `}>
              <td className="py-1 px-4" onClick={(e) => e.stopPropagation()}>
                <TaskCompleteCheckMark
                  task={task}
                  toggleTaskCompletion={toggleTaskCompletion}
                  className="hover:border border-gray-400 p-1 w-8"
                />
              </td>
              <td
                className={`py-1 px-4 text-sm hover:border-2 hover:border-gray-400 ${
                  selectedTaskId === task.id
                    ? "border-2 border-blue-600 hover:border-blue-600"
                    : ""
                }`}
                onClick={() => onTaskSelect(task)}
              >
                {task.title}
              </td>
              <td className="py-1 px-4 text-sm text-red-500">{task.dueDate}</td>
              <td className="py-1 px-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => toggleTaskImportance(task.id)}
                  className="text-gray-400 hover:text-blue-600 hover:border border-gray-400 px-2"
                >
                  {task.isImportant ? (
                    <TooltipIcon
                      icon={StarFilled}
                      tooltipText="Remove importance"
                      className="text-blue-600"
                    />
                  ) : (
                    <TooltipIcon
                      icon={StarRegular}
                      tooltipText="Mark task as important"
                      className="text-blue-600"
                    />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
        {editingTodo && (
          <TaskDetailsSidebar
            todo={editingTodo}
            onSave={handleSaveTodo}
            onClose={handleCloseModal}
          />
        )}
      </section>
    </DndProvider>
  );
};

export default TaskList;
