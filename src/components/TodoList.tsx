import type React from "react";
import { useState, useEffect } from "react";
import {
  StarRegular,
  StarFilled,
  IosChevronRightRegular,
  ChevronDownRegular,
} from "@fluentui/react-icons";
import { TooltipIcon } from "./TooltipIcon";
import type { Todo, Priority, Category } from "../types/todo";
import TodoItem from "./TodoItem";
import { useTodoContext } from "../context/TodoContext";
import DeletModal from "./DeletModal";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface SortableTodoItemProps {
  id: string;
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  onReorderTodos: (startIndex: number, endIndex: number) => void;
  viewMode: "grid" | "list";
  onTaskSelect: (todo: Todo) => void;
  selectedTaskId?: string;
  showCompleted?: boolean;
}

const SortableTodoItem: React.FC<SortableTodoItemProps> = ({
  id,
  todo,
  onEdit,
  selectedTaskId,
  onTaskSelect,
  viewMode,
}) => {
  const { toggleComplete, toggleStar } = useTodoContext();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    // Set default transition that will be used when not dragging
    transition: {
      duration: 250,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    // Disable transition during drag for better performance
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
    // Important for mobile - prevents the browser from handling touch events
    touchAction: "none",
    zIndex: isDragging ? 1000 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        display: viewMode === "grid" ? "table-row" : undefined,
      }}
      {...attributes}
      {...listeners}
      // className="sortable-todo-item"
    >
      <TodoItem
        todo={todo}
        onToggleComplete={() => toggleComplete(todo.id)}
        onToggleStar={() => toggleStar(todo.id)}
        onEdit={onEdit}
        viewMode={viewMode}
        selectedTaskId={selectedTaskId}
        onTaskSelect={onTaskSelect}
      />
    </div>
  );
};

interface TaskListProps {
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
}

const TaskList: React.FC<TaskListProps> = ({
  onTaskSelect,
  selectedTaskId,
  viewMode,
  todos,
  filter,
}) => {
  const {
    editingTodo,
    setEditingTodo,
    deleteModal,
    setDeleteModal,
    handleCloseModal,
    toggleComplete,
    toggleStar,
    deleteTodo,
    reorderTodos,
    updateTodo,
  } = useTodoContext();
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [showCompleted, setShowCompleted] = useState<boolean>(false);

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

    setFilteredTodos(result);
  }, [todos, filter]);

  // Configure sensors for DnD
  const sensors = useSensors(
    // PointerSensor works for both mouse and touch on modern browsers
    useSensor(PointerSensor, {
      // Don't start dragging on every tiny movement
      activationConstraint: {
        distance: 8, // Minimum distance in pixels before drag starts
      },
    }),
    // TouchSensor as a fallback for older browsers
    useSensor(TouchSensor, {
      // Make touch dragging more intentional with a delay
      activationConstraint: {
        delay: 150, // ms before drag starts
        tolerance: 8, // Allow slight movement during delay
      },
    }),
    // Support keyboard accessibility
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  const handleSaveTodo = (updatedTodo: Todo) => {
    updateTodo(updatedTodo);
    setEditingTodo(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTodos(oldIndex, newIndex);
      }
    }
  };

  if (filteredTodos.length === 0) {
    return (
      <div className="flex items-center justify-center h-52 bg-white rounded-md text-[#605e5c]">
        <p>No tasks match your current filters</p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      // Improve performance by canceling drag when leaving window
      autoScroll={true}
    >
      <SortableContext
        items={todos.map((todo) => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        <section className="flex-1 overflow-auto">
          {viewMode === "grid" ? (
            <table className="min-w-full bg-white shadow-lg">
              <thead className="border-b">
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
                  .map((todo) => (
                    <SortableTodoItem
                      key={todo.id}
                      id={todo.id}
                      todo={todo}
                      onToggleComplete={toggleComplete}
                      onToggleStar={toggleStar}
                      onEdit={handleEditTodo}
                      onReorderTodos={reorderTodos}
                      viewMode={viewMode}
                      selectedTaskId={selectedTaskId}
                      onTaskSelect={onTaskSelect}
                    />
                  ))}
                {filteredTodos.some((todo) => todo.completed === true) && (
                  <>
                    <tr>
                      <td colSpan={4}>
                        <div className="flex items-center gap-3 py-3 px-4">
                          <button
                            onClick={() => setShowCompleted(!showCompleted)}
                            className="mr-2 focus:outline-none"
                            aria-label={
                              showCompleted
                                ? "Hide completed tasks"
                                : "Show completed tasks"
                            }
                          >
                            {showCompleted ? (
                              <ChevronDownRegular fontSize={20} />
                            ) : (
                              <IosChevronRightRegular fontSize={20} />
                            )}
                          </button>
                          <p className="font-medium">Completed</p>
                          <span>
                            {
                              filteredTodos.filter(
                                (todo) => todo.completed === true
                              ).length
                            }
                          </span>
                        </div>
                      </td>
                    </tr>
                    {showCompleted &&
                      filteredTodos
                        .filter((todo) => todo.completed === true)
                        .map((todo) => (
                          <SortableTodoItem
                            key={todo.id}
                            id={todo.id}
                            todo={todo}
                            onToggleComplete={toggleComplete}
                            onToggleStar={toggleStar}
                            onEdit={handleEditTodo}
                            onReorderTodos={reorderTodos}
                            viewMode={viewMode}
                            selectedTaskId={selectedTaskId}
                            onTaskSelect={onTaskSelect}
                            showCompleted={showCompleted}
                          />
                        ))}
                  </>
                )}
              </tbody>
            </table>
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              {filteredTodos
                .filter((todo) => todo.completed === false)
                .map((todo) => (
                  <SortableTodoItem
                    key={todo.id}
                    id={todo.id}
                    todo={todo}
                    onToggleComplete={toggleComplete}
                    onToggleStar={toggleStar}
                    onEdit={handleEditTodo}
                    onReorderTodos={reorderTodos}
                    viewMode={viewMode}
                    selectedTaskId={selectedTaskId}
                    onTaskSelect={onTaskSelect}
                  />
                ))}
              {filteredTodos.some((todo) => todo.completed === true) && (
                <>
                  <div
                    className={`flex items-center gap-3 py-3 ${
                      showCompleted && "border-b"
                    }`}
                  >
                    <button
                      onClick={() => setShowCompleted(!showCompleted)}
                      className="mr-2 focus:outline-none"
                      aria-label={
                        showCompleted
                          ? "Hide completed tasks"
                          : "Show completed tasks"
                      }
                    >
                      {showCompleted ? (
                        <ChevronDownRegular fontSize={20} />
                      ) : (
                        <IosChevronRightRegular fontSize={20} />
                      )}
                    </button>
                    <p className="font-medium">Completed</p>
                    <span>
                      {
                        filteredTodos.filter((todo) => todo.completed === true)
                          .length
                      }
                    </span>
                  </div>
                  {showCompleted &&
                    filteredTodos
                      .filter((todo) => todo.completed === true)
                      .map((todo) => (
                        <SortableTodoItem
                          key={todo.id}
                          id={todo.id}
                          todo={todo}
                          onToggleComplete={toggleComplete}
                          onToggleStar={toggleStar}
                          onEdit={handleEditTodo}
                          onReorderTodos={reorderTodos}
                          viewMode={viewMode}
                          selectedTaskId={selectedTaskId}
                          onTaskSelect={onTaskSelect}
                          showCompleted={showCompleted}
                        />
                      ))}
                </>
              )}
            </div>
          )}

          {editingTodo && deleteModal && (
            <DeletModal
              todo={editingTodo}
              onClose={handleCloseModal}
              setDeleteModal={setDeleteModal}
              onDelete={deleteTodo}
            />
          )}
        </section>
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;
