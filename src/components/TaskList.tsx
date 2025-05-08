"use client";

import type React from "react";
import type { Task } from "../types";
import {
  StarRegular,
  StarFilled,
  CircleRegular,
  CheckmarkCircleRegular,
  IosChevronRightRegular,
  ChevronDownRegular,
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
import { useTodoContext } from "../context/TodoContext";
import DeletModal from "./DeletModal";

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
  // onDelete: (id: string) => void;
  onReorderTodos: (startIndex: number, endIndex: number) => void;
  viewMode: "grid" | "list";
  onTaskSelect: (todo: Todo) => void;
  selectedTaskId?: string;
  showCompleted?: boolean;
}

const DraggableTodoItem: React.FC<DraggableTodoItemProps> = ({
  index,
  todo,
  onToggleComplete,
  onToggleStar,
  onEdit,
  // onDelete,
  onReorderTodos,
  viewMode,
  onTaskSelect,
  selectedTaskId,
  showCompleted,
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
      className={`${showCompleted && "hidden"} ${
        viewMode === "grid" && "border-b h-10"
      }`}
    >
      <TodoItem
        todo={todo}
        onToggleComplete={onToggleComplete}
        onToggleStar={onToggleStar}
        onEdit={onEdit}
        // onDelete={onDelete}
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
    // onlyPlanned: boolean;
  };
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onUpdateTodo: (todo: Todo) => void;
  onDeleteTodo: (id: string) => void;
  onReorderTodos: (startIndex: number, endIndex: number) => void;
  // filteredTodos: Todo[];
  // setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
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
  // filteredTodos,
  // setFilteredTodos,
}) => {
  // const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const {
    editingTodo,
    setEditingTodo,
    deleteModal,
    setDeleteModal,
    handleCloseModal,
  } = useTodoContext();
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

  // State for delete modal
  // const [deleteModal, setDeleteModal] = useState<boolean>(true);

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

    // Filter by planned
    // if (filter.onlyPlanned) {
    //   result = result.filter((todo) => todo.dueDate !== undefined);
    // }
    // console.log(result);

    setFilteredTodos(result);
  }, [
    todos,
    setFilteredTodos,
    filter,
    // filter.onlyPlanned,
  ]);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  // const handleCloseModal = () => {
  //   setEditingTodo(null);
  // };

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
              {filteredTodos
                .filter((todo) => todo.completed === false)
                .map((todo, index) => (
                  <DraggableTodoItem
                    key={todo.id}
                    index={index}
                    todo={todo}
                    onToggleComplete={onToggleComplete}
                    onToggleStar={onToggleStar}
                    onEdit={handleEditTodo}
                    // onDelete={onDeleteTodo}
                    onReorderTodos={onReorderTodos}
                    viewMode={viewMode}
                    selectedTaskId={selectedTaskId}
                    onTaskSelect={onTaskSelect}
                  />
                ))}
              {filteredTodos.some((todo) => todo.completed === true) && (
                <>
                  <div className=" flex items-center gap-3 py-3">
                    <button
                      onClick={() => setShowCompleted(!showCompleted)}
                      className="mr-2"
                    >
                      {showCompleted ? (
                        <IosChevronRightRegular fontSize={20} />
                      ) : (
                        <ChevronDownRegular fontSize={20} />
                      )}
                    </button>
                    <p className="font-medium">Completed</p>{" "}
                    <span>
                      {
                        filteredTodos.filter((todo) => todo.completed === true)
                          .length
                      }
                    </span>
                  </div>
                  {/* <div className={`${!showCompleted && "hidden"} w-full`}> */}
                  {filteredTodos
                    .filter((todo) => todo.completed === true)
                    .map((todo, index) => (
                      <DraggableTodoItem
                        key={todo.id}
                        index={index}
                        todo={todo}
                        onToggleComplete={onToggleComplete}
                        onToggleStar={onToggleStar}
                        onEdit={handleEditTodo}
                        // onDelete={onDeleteTodo}
                        onReorderTodos={onReorderTodos}
                        viewMode={viewMode}
                        selectedTaskId={selectedTaskId}
                        onTaskSelect={onTaskSelect}
                        showCompleted={showCompleted}
                      />
                    ))}
                  {/* </div> */}
                </>
              )}
              {/* {filteredTodos.map((todo, index) => (
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
              ))} */}
            </tbody>
          </table>
        ) : (
          <div className="flex flex-col gap-2">
            {filteredTodos
              .filter((todo) => todo.completed === false)
              .map((todo, index) => (
                <DraggableTodoItem
                  key={todo.id}
                  index={index}
                  todo={todo}
                  onToggleComplete={onToggleComplete}
                  onToggleStar={onToggleStar}
                  onEdit={handleEditTodo}
                  // onDelete={onDeleteTodo}
                  onReorderTodos={onReorderTodos}
                  viewMode={viewMode}
                  selectedTaskId={selectedTaskId}
                  onTaskSelect={onTaskSelect}
                />
              ))}
            {filteredTodos.some((todo) => todo.completed === true) && (
              // <div
              //   className={`${
              //     !showCompleted ? "hidden" : "flex"
              //   } w-full flex-col gap-2`}
              // >
              <>
                <div
                  className={`flex items-center gap-3 py-3 ${
                    showCompleted && "border-b"
                  }`}
                >
                  <button
                    onClick={() => setShowCompleted(!showCompleted)}
                    className="mr-2"
                  >
                    {showCompleted ? (
                      <IosChevronRightRegular fontSize={20} />
                    ) : (
                      <ChevronDownRegular fontSize={20} />
                    )}
                  </button>
                  <p className="font-medium">Completed</p>{" "}
                  <span>
                    {
                      filteredTodos.filter((todo) => todo.completed === true)
                        .length
                    }
                  </span>
                </div>
                {/* <div
                  className={`${
                    !showCompleted ? "hidden" : "flex"
                  } w-full flex-col gap-2`}
                > */}
                {filteredTodos
                  .filter((todo) => todo.completed === true)
                  .map((todo, index) => (
                    <DraggableTodoItem
                      key={todo.id}
                      index={index}
                      todo={todo}
                      onToggleComplete={onToggleComplete}
                      onToggleStar={onToggleStar}
                      onEdit={handleEditTodo}
                      // onDelete={onDeleteTodo}
                      onReorderTodos={onReorderTodos}
                      viewMode={viewMode}
                      selectedTaskId={selectedTaskId}
                      onTaskSelect={onTaskSelect}
                      showCompleted={showCompleted}
                    />
                  ))}
                {/* </div> */}
              </>
              // </div>
            )}
            {/* {filteredTodos.map((todo, index) => (
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
            ))} */}
          </div>
        )}

        {editingTodo && (
          <TaskDetailsSidebar
            todo={editingTodo}
            onSave={handleSaveTodo}
            onClose={handleCloseModal}
            // onToggleComplete={onToggleComplete}
          />
        )}
        {/* delete modal */}
        {editingTodo && deleteModal && (
          <DeletModal
            todo={editingTodo}
            onClose={handleCloseModal}
            setDeleteModal={setDeleteModal}
            onDelete={onDeleteTodo}
          />
        )}
      </section>
    </DndProvider>
  );
};

export default TaskList;
