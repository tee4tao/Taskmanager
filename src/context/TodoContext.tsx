import React, {
  createContext,
  useContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { Todo, Priority, Category } from "../types/todo";
import { todoService } from "../services/todoService";
import { playCompletionSound } from "../utils/sound";

// Define action types for the reducer
export type TodoAction =
  | { type: "SET_TODOS"; payload: Todo[] }
  | { type: "ADD_TODO"; payload: Todo }
  | { type: "UPDATE_TODO"; payload: Todo }
  | { type: "DELETE_TODO"; payload: string }
  | { type: "TOGGLE_COMPLETE"; payload: string }
  | { type: "TOGGLE_STAR"; payload: string }
  | {
      type: "REORDER_TODOS";
      payload: { startIndex: number; endIndex: number };
    };

// Reducer function for todos
const todoReducer = (state: Todo[], action: TodoAction): Todo[] => {
  switch (action.type) {
    case "SET_TODOS":
      return action.payload;
    case "ADD_TODO":
      return [...state, action.payload];
    case "UPDATE_TODO":
      return state.map((todo) =>
        todo.id === action.payload.id ? action.payload : todo
      );
    case "DELETE_TODO":
      return state.filter((todo) => todo.id !== action.payload);
    case "TOGGLE_COMPLETE":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    case "TOGGLE_STAR":
      return state.map((todo) =>
        todo.id === action.payload
          ? { ...todo, isStarred: !todo.isStarred }
          : todo
      );
    case "REORDER_TODOS": {
      const { startIndex, endIndex } = action.payload;
      const result = Array.from(state);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    }
    default:
      return state;
  }
};

interface TodoContextType {
  editingTodo: Todo | null;
  setEditingTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  deleteModal: boolean;
  setDeleteModal: React.Dispatch<React.SetStateAction<boolean>>;
  handleCloseModal: () => void;
  todos: Todo[];
  dispatch: React.Dispatch<TodoAction>;
  addTodo: (
    title: string,
    description?: string,
    dueDate?: Date,
    priority?: Priority,
    category?: Category
  ) => Promise<void>;
  updateTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  reorderTodos: (startIndex: number, endIndex: number) => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({
  children,
  initialTodos = [],
}: {
  children: React.ReactNode;
  initialTodos?: Todo[];
}) => {
  const [todos, dispatch] = useReducer(todoReducer, initialTodos);

  // Load todos from localStorage on initial render
  useEffect(() => {
    if (initialTodos.length === 0) {
      const loadTodos = async () => {
        try {
          const loadedTodos = await todoService.getTodos();
          dispatch({ type: "SET_TODOS", payload: loadedTodos });
        } catch (error) {
          console.error("Error loading todos:", error);
        }
      };

      loadTodos();
    }
  }, [initialTodos.length]);

  // Handle adding a new todo
  const addTodo = async (
    title: string,
    description?: string,
    dueDate?: Date,
    priority?: Priority,
    category?: Category
  ) => {
    try {
      const newTodo = await todoService.addTodo(
        title,
        description,
        dueDate,
        priority,
        category
      );
      dispatch({ type: "ADD_TODO", payload: newTodo });
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Handle updating a todo
  const updateTodo = async (updatedTodo: Todo) => {
    try {
      await todoService.updateTodo(updatedTodo);
      dispatch({ type: "UPDATE_TODO", payload: updatedTodo });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Handle deleting a todo
  const deleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      dispatch({ type: "DELETE_TODO", payload: id });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Handle toggling todo completion
  const toggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      try {
        await todoService.updateTodo(updatedTodo);
        dispatch({ type: "TOGGLE_COMPLETE", payload: id });
        // Play appropriate sound based on the new completion state
        if (updatedTodo.completed) {
          playCompletionSound();
        }
      } catch (error) {
        console.error("Error toggling todo completion:", error);
      }
    }
  };

  // Handle toggling todo star
  const toggleStar = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, isStarred: !todo.isStarred };
      try {
        await todoService.updateTodo(updatedTodo);
        dispatch({ type: "TOGGLE_STAR", payload: id });
      } catch (error) {
        console.error("Error toggling todo star:", error);
      }
    }
  };

  // Handle reordering todos (drag and drop)
  const reorderTodos = (startIndex: number, endIndex: number) => {
    dispatch({
      type: "REORDER_TODOS",
      payload: { startIndex, endIndex },
    });
  };

  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  // State for delete modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const handleCloseModal = () => {
    setEditingTodo(null);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        dispatch,
        addTodo,
        updateTodo,
        deleteTodo,
        toggleComplete,
        toggleStar,
        reorderTodos,
        editingTodo,
        setEditingTodo,
        deleteModal,
        setDeleteModal,
        handleCloseModal,
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};

export const useTodoContext = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error("useTodoContext must be used within a TodoProvider");
  }
  return context;
};
