"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  StarRegular,
  StarFilled,
  IosChevronRightRegular,
  ChevronDownRegular,
  DragRegular,
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
  DragOverlay,
  defaultDropAnimationSideEffects,
  type DragEndEvent,
  type DragStartEvent,
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
    transition: {
      duration: 250,
      easing: "cubic-bezier(0.25, 1, 0.5, 1)",
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? undefined : transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
    position: "relative" as const,
    touchAction: "manipulation" as const, // Better for mobile scrolling
  };

  // Create drag handle component
  const DragHandle = () => (
    <div
      {...attributes}
      {...listeners}
      className="flex items-center justify-center w-8 h-8 cursor-grab active:cursor-grabbing touch-none"
      onClick={(e) => e.stopPropagation()}
    >
      <DragRegular className="text-gray-400" fontSize={16} />
    </div>
  );

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full ${
        viewMode === "grid" ? "border-b last:border-b-0" : ""
      }`}
    >
      <TodoItem
        todo={todo}
        onToggleComplete={() => toggleComplete(todo.id)}
        onToggleStar={() => toggleStar(todo.id)}
        onEdit={onEdit}
        viewMode={viewMode}
        selectedTaskId={selectedTaskId}
        onTaskSelect={onTaskSelect}
        dragHandle={<DragHandle />}
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
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTodo, setActiveTodo] = useState<Todo | null>(null);

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

    // Filter by priority if not "all"
    if (filter.priority !== "all") {
      result = result.filter((todo) => todo.priority === filter.priority);
    }

    // Filter by category if not "all"
    if (filter.category !== "all") {
      result = result.filter((todo) => todo.category === filter.category);
    }

    // Filter by starred status
    if (filter.onlyStarred) {
      result = result.filter((todo) => todo.isStarred);
    }

    setFilteredTodos(result);
  }, [todos, filter]);

  // Configure sensors for DnD
  const sensors = useSensors(
    // For desktop and mobile, the PointerSensor is generally enough
    useSensor(PointerSensor, {
      // Increase activation constraint for better mobile experience
      activationConstraint: {
        distance: 8, // Minimum distance before drag starts (px)
        tolerance: 5, // Allow slight movement during the delay
        delay: 250, // Add a small delay for mobile (ms)
      },
    }),
    // Keyboard accessibility
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

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);

    // Find the active todo
    const draggedTodo = todos.find((todo) => todo.id === active.id);
    if (draggedTodo) {
      setActiveTodo(draggedTodo);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);
    setActiveTodo(null);

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTodos(oldIndex, newIndex);
      }
    }
  };

  // Define custom drop animation
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-todo-list p-4 text-center text-gray-500">
        <p>No tasks match your current filters</p>
      </div>
    );
  }

  // Separate incomplete and completed todos
  const incompleteTodos = filteredTodos.filter((todo) => !todo.completed);
  const completedTodos = filteredTodos.filter((todo) => todo.completed);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      autoScroll={{
        threshold: {
          x: 0.2,
          y: 0.2,
        },
        acceleration: 10,
        interval: 5,
      }}
    >
      <SortableContext
        items={todos.map((todo) => todo.id)}
        strategy={verticalListSortingStrategy}
      >
        <section className="flex-1 overflow-auto">
          {viewMode === "grid" ? (
            <div className="min-w-full bg-white shadow-lg">
              {/* Table header */}
              <div className="grid grid-cols-[auto_auto_1fr_auto_auto] border-b">
                <div className="py-3 px-2 font-normal text-sm text-gray-600 w-8"></div>
                <div className="py-3 px-2 font-normal text-sm text-gray-600 w-8"></div>
                <div className="py-3 px-4 font-normal text-sm text-gray-600">
                  Title
                </div>
                <div className="py-3 px-4 font-normal text-sm text-gray-600">
                  Due Date
                </div>
                <div className="py-3 px-4 font-normal text-sm text-gray-600">
                  Importance
                </div>
              </div>
              {/* Incomplete todos */}
              <div>
                {incompleteTodos.map((todo) => (
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
              </div>
              {/* Completed todos section */}
              {completedTodos.length > 0 && (
                <>
                  <div className="border-t border-b">
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
                      <span>{completedTodos.length}</span>
                    </div>
                  </div>
                  {showCompleted &&
                    completedTodos.map((todo) => (
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
          ) : (
            <div className="flex flex-col gap-2 mt-2">
              {incompleteTodos.map((todo) => (
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
              {completedTodos.length > 0 && (
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
                    <span>{completedTodos.length}</span>
                  </div>
                  {showCompleted &&
                    completedTodos.map((todo) => (
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

          {/* Drag overlay for better visual feedback during drag operations */}
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId && activeTodo ? (
              <div className="opacity-80 bg-white shadow-lg border border-blue-400 rounded-md p-2 w-[90%] max-w-sm">
                <TodoItem
                  todo={activeTodo}
                  onToggleComplete={() => {}}
                  onToggleStar={() => {}}
                  onEdit={() => {}}
                  viewMode="list"
                  onTaskSelect={() => {}}
                  isDragOverlay={true}
                />
              </div>
            ) : null}
          </DragOverlay>
        </section>
      </SortableContext>
    </DndContext>
  );
};

export default TaskList;
