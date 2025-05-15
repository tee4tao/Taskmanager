"use client";

import type React from "react";
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
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import TodoItem from "./TodoItem";
import TaskDetailsSidebar from "./TaskDetailsSidebar";
import { useTodoContext } from "../context/TodoContext";
import DeletModal from "./DeletModal";
import { TouchBackend } from "react-dnd-touch-backend";
import { MultiBackend, TouchTransition } from "dnd-multi-backend";
import { useLongPressDrag } from "../hooks/useLongPressDrag";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core"
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

const HTML5toTouch = {
  backends: [
    {
      backend: HTML5Backend,
      transition: undefined,
    },
    {
      backend: TouchBackend,
      options: {
        enableTouchEvents: true,
        enableMouseEvents: false,
        delayTouchStart: 0,
      },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

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

// const DraggableTodoItem: React.FC<DraggableTodoItemProps> = ({
//   index,
//   todo,
//   onToggleComplete,
//   onToggleStar,
//   onEdit,
//   // onDelete,
//   onReorderTodos,
//   viewMode,
//   onTaskSelect,
//   selectedTaskId,
//   showCompleted,
// }) => {
//   const { canDrag, onTouchStart, onTouchEnd } = useLongPressDrag(300);
//   const [{ isDragging }, drag] = useDrag({
//     type: "TODO_ITEM",
//     item: { index },
//     canDrag: canDrag,
//     collect: (monitor) => ({
//       isDragging: monitor.isDragging(),
//     }),
//   });

//   const [, drop] = useDrop({
//     accept: "TODO_ITEM",
//     hover(item: { index: number }) {
//       if (item.index !== index) {
//         onReorderTodos(item.index, index);
//         item.index = index;
//       }
//     },
//   });
//   return (
//     <tr
//       ref={(node) => {
//         if (node) {
//           drag(drop(node));
//         }
//       }}
//       onTouchStart={onTouchStart}
//       onTouchEnd={onTouchEnd}
//       onTouchCancel={onTouchEnd}
//       style={{ opacity: isDragging ? 0.5 : 1, touchAction: "none" }}
//       className={`touch-none ${showCompleted && "hidden"} ${
//         viewMode === "grid" && "border-b h-10"
//       }`}
//     >
//       <TodoItem
//         todo={todo}
//         onToggleComplete={onToggleComplete}
//         onToggleStar={onToggleStar}
//         onEdit={onEdit}
//         // onDelete={onDelete}
//         viewMode={viewMode}
//         selectedTaskId={selectedTaskId}
//         onTaskSelect={onTaskSelect}
//       />
//     </tr>
//   );
// };
interface SortableTodoItemProps {
  id: string
  todo: Todo
  onEdit: (todo: Todo) => void
  onToggleComplete: (id: string) => void;
  onToggleStar: (id: string) => void;
  // onDelete: (id: string) => void;
  onReorderTodos: (startIndex: number, endIndex: number) => void;
  viewMode: "grid" | "list";
  onTaskSelect: (todo: Todo) => void;
  selectedTaskId?: string;
  showCompleted?: boolean;
}

const SortableTodoItem: React.FC<SortableTodoItemProps> = ({ id, todo, onEdit,selectedTaskId,onTaskSelect, viewMode }) => {
  const { toggleComplete, toggleStar, deleteTodo } = useTodoContext()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <tr ref={setNodeRef} style={style} {...attributes} {...listeners} className="sortable-todo-item">
      <TodoItem
        todo={todo}
        onToggleComplete={() => toggleComplete(todo.id)}
        onToggleStar={() => toggleStar(todo.id)}
        onEdit={onEdit}
        // onDelete={() => deleteTodo(todo.id)}
        viewMode={viewMode}
         selectedTaskId={selectedTaskId}
         onTaskSelect={onTaskSelect}
      />
    </tr>
  )
}

interface TaskListProps {
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
  // onToggleComplete: (id: string) => void;
  // onToggleStar: (id: string) => void;
  // onUpdateTodo: (todo: Todo) => void;
  // onDeleteTodo: (id: string) => void;
  // onReorderTodos: (startIndex: number, endIndex: number) => void;
  // filteredTodos: Todo[];
  // setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
}

const TaskList: React.FC<TaskListProps> = ({
  // toggleTaskImportance,
  // toggleTaskCompletion,
  onTaskSelect,
  selectedTaskId,
  viewMode,
  todos,
  filter,
  // onToggleComplete,
  // onToggleStar,
  // onUpdateTodo,
  // onDeleteTodo,
  // onReorderTodos,
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
    toggleComplete,
    toggleStar,
    deleteTodo,
    reorderTodos,
    updateTodo,
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

    // // Filter by completion status
    // if (!filter.showCompleted) {
    //   result = result.filter((todo) => !todo.completed);
    // }

    // // Filter by priority
    // if (filter.priority !== "all") {
    //   result = result.filter((todo) => todo.priority === filter.priority);
    // }

    // // Filter by category
    // if (filter.category !== "all") {
    //   result = result.filter((todo) => todo.category === filter.category);
    // }

    // // Filter by starred status
    // if (filter.onlyStarred) {
    //   result = result.filter((todo) => todo.isStarred);
    // }

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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Lower activationConstraint for better mobile experience
      activationConstraint: {
        distance: 5, // 5px movement before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
  };

  // const handleCloseModal = () => {
  //   setEditingTodo(null);
  // };

  const handleSaveTodo = (updatedTodo: Todo) => {
    updateTodo(updatedTodo);
    setEditingTodo(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id)
      const newIndex = todos.findIndex((todo) => todo.id === over.id)

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderTodos(oldIndex, newIndex)
      }
    }
  }

  if (filteredTodos.length === 0) {
    return (
      <div className="empty-todo-list">
        <p>No tasks match your current filters</p>
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map((todo) => todo.id)} strategy={verticalListSortingStrategy}>
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
                  <SortableTodoItem
                    key={todo.id}
                    id={todo.id}
                    // index={index}
                    todo={todo}
                    onToggleComplete={toggleComplete}
                    onToggleStar={toggleStar}
                    onEdit={handleEditTodo}
                    // onDelete={onDeleteTodo}
                    onReorderTodos={reorderTodos}
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
                      <SortableTodoItem
                        key={todo.id}
                        id={todo.id}
                        // index={index}
                        todo={todo}
                        onToggleComplete={toggleComplete}
                        onToggleStar={toggleStar}
                        onEdit={handleEditTodo}
                        // onDelete={onDeleteTodo}
                        onReorderTodos={reorderTodos}
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
          <div className="flex flex-col gap-2 mt-2">
            {filteredTodos
              .filter((todo) => todo.completed === false)
              .map((todo, index) => (
                <SortableTodoItem
                  key={todo.id}
                  id={todo.id}
                  // index={index}
                  todo={todo}
                  onToggleComplete={toggleComplete}
                  onToggleStar={toggleStar}
                  onEdit={handleEditTodo}
                  // onDelete={onDeleteTodo}
                  onReorderTodos={reorderTodos}
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
                    <SortableTodoItem
                      key={todo.id}
                      id={todo.id}
                      // index={index}
                      todo={todo}
                      onToggleComplete={toggleComplete}
                      onToggleStar={toggleStar}
                      onEdit={handleEditTodo}
                      // onDelete={onDeleteTodo}
                      onReorderTodos={reorderTodos}
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

        {/* {editingTodo && (
          <TaskDetailsSidebar
            todo={editingTodo}
            onSave={handleSaveTodo}
            onClose={handleCloseModal}
            // onToggleComplete={onToggleComplete}
          />
        )} */}
        {/* delete modal */}
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
