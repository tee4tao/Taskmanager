"use client";

import type React from "react";
import { useState, useEffect, useReducer } from "react";
import Sidebar from "./components/Sidebar";
import TaskHeader from "./components/TaskHeader";
import TaskList from "./components/TaskList";
import TaskDetailsSidebar from "./components/TaskDetailsSidebar";
import type { Task } from "./types";
import TaskInput from "./components/TaskInput";
import type { Todo, Category } from "./types/todo";
import { Priority } from "./types/todo";
import { useNotifications } from "./hooks/useNotifications";
import { User } from "./types/user";
import { todoService } from "./services/todoService";
import { authService } from "./services/authService";
import { useTodoContext } from "./context/TodoContext";
import Navbar from "./components/Navbar";
import { SortOption } from "./components/sortOptions";

// Define action types for the reducer
type TodoAction =
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

const App: React.FC = () => {
  // State for todos using reducer
  const [todos, dispatch] = useReducer(todoReducer, []);

  const [showSidebar, setShowSidebar] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [onlyStarred, setOnlyStarred] = useState(false);
  // const [onlyPlanned, setOnlyPlanned] = useState(false);
  // const [filteredTodos, setFilteredTodos] = useState<Todo[]>(todos);

  // State for sorting
  const [sortOption, setSortOption] = useState<SortOption>("none");
  const [sortAscending, setSortAscending] = useState(true);

  // State for sidebar navigation
  const [activeNavFilter, setActiveNavFilter] = useState("all");

  // State for user
  const [user, setUser] = useState<User | null>(null);

  // Get notifications using custom hook
  // const {
  //   notifications,
  //   markAsRead,
  //   clearNotification,
  //   clearAllNotifications,
  //   unreadCount,
  // } = useNotifications(todos);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const loadedTodos = await todoService.getTodos();
        dispatch({ type: "SET_TODOS", payload: loadedTodos });
      } catch (error) {
        console.error("Error loading todos:", error);
      }
    };

    loadTodos();
  }, []);

  // Check for logged in user on initial render
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Handle adding a new todo
  const handleAddTodo = async (
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
  const handleUpdateTodo = async (updatedTodo: Todo) => {
    try {
      await todoService.updateTodo(updatedTodo);
      dispatch({ type: "UPDATE_TODO", payload: updatedTodo });
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Handle deleting a todo
  const handleDeleteTodo = async (id: string) => {
    try {
      await todoService.deleteTodo(id);
      dispatch({ type: "DELETE_TODO", payload: id });
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  // Handle toggling todo completion
  const handleToggleComplete = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };

      try {
        await todoService.updateTodo(updatedTodo);
        dispatch({ type: "TOGGLE_COMPLETE", payload: id });
      } catch (error) {
        console.error("Error toggling todo completion:", error);
      }
    }
  };

  // Handle toggling todo star
  const handleToggleStar = async (id: string) => {
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
  const handleReorderTodos = (startIndex: number, endIndex: number) => {
    dispatch({
      type: "REORDER_TODOS",
      payload: { startIndex, endIndex },
    });
  };

  // Handle clearing all filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setShowCompleted(true);
    setPriorityFilter("all");
    setCategoryFilter("all");
    setOnlyStarred(false);
    setActiveNavFilter("all");
  };

  // Handle sort option change
  const handleSortChange = (option: SortOption) => {
    setSortOption(option);
    // Reset to default direction when changing sort option
    setSortAscending(option === "alphabetically");
  };

  // Handle toggling sort direction
  const handleToggleSortDirection = () => {
    setSortAscending(!sortAscending);
  };

  // Handle clearing sort
  const handleClearSort = () => {
    setSortOption("none");
    setSortAscending(true);
  };

  // Handle user login
  const handleLogin = async (username: string, password: string) => {
    try {
      const loggedInUser = await authService.login(username, password);
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    }
  };

  // Handle user logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // Handle sidebar navigation filter change
  const handleNavFilterChange = (filter: string) => {
    setActiveNavFilter(filter);

    // Reset other filters
    setSearchTerm("");
    setPriorityFilter("all");
    setCategoryFilter("all");

    // Set appropriate filters based on navigation selection
    if (filter === "myDay") {
      setShowCompleted(true);
      setOnlyStarred(false);
    } else if (filter === "important") {
      setShowCompleted(false);
      setOnlyStarred(true);
    } else if (filter === "planned") {
      setShowCompleted(true);
      setOnlyStarred(false);
    } else if (filter === "all") {
      setShowCompleted(true);
      setOnlyStarred(false);
    }
  };

  // Filter todos based on active navigation filter
  // const getFilteredTodos = () => {
  //   let filteredTodos = [...todos];

  //   // Apply navigation filters
  //   if (activeNavFilter === "myDay") {
  //     const today = new Date();
  //     today.setHours(0, 0, 0, 0);

  //     filteredTodos = filteredTodos.filter((todo) => {
  //       if (!todo.dueDate) return false;
  //       const dueDate = new Date(todo.dueDate);
  //       dueDate.setHours(0, 0, 0, 0);
  //       return dueDate.getTime() === today.getTime();
  //     });
  //   } else if (activeNavFilter === "important") {
  //     filteredTodos = filteredTodos.filter((todo) => todo.isStarred);
  //   } else if (activeNavFilter === "planned") {
  //     filteredTodos = filteredTodos.filter((todo) => todo.dueDate);
  //   } else if (activeNavFilter === "assigned") {
  //     // For now, just return all tasks
  //     filteredTodos = filteredTodos;
  //   }

  //   return filteredTodos;
  // };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const { editingTodo } = useTodoContext();

  const handleTaskSelect = (todo: Todo) => {
    setSelectedTask(todo);
  };

  // Sort todos based on current sort option and direction
  const getSortedTodos = (todoList: Todo[]): Todo[] => {
    if (sortOption === "none") return todoList;

    const sorted = [...todoList];

    switch (sortOption) {
      case "importance":
        sorted.sort((a, b) => {
          // Sort by starred status first
          if (a.isStarred !== b.isStarred) {
            return a.isStarred ? 1 : -1;
          }
          // Then by priority
          const priorityOrder = {
            [Priority.High]: 0,
            [Priority.Medium]: 1,
            [Priority.Low]: 2,
          };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        break;
      case "dueDate":
        sorted.sort((a, b) => {
          // Tasks without due dates go to the end
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case "addedToMyDay":
        // This is a placeholder - in a real app, you'd have a "myDay" flag
        // For now, we'll use isStarred as a substitute
        sorted.sort((a, b) =>
          a.isStarred === b.isStarred ? 0 : a.isStarred ? -1 : 1
        );
        break;
      case "alphabetically":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "creationDate":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
    }

    // Reverse the order if not ascending
    return sortAscending ? sorted : sorted.reverse();
  };
  const getFilteredAndSortedTodos = () => {
    // Filter todos based on active navigation filter
    const getFilteredTodos = () => {
      let filteredTodos = [...todos];

      // Apply navigation filters
      if (activeNavFilter === "myDay") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        filteredTodos = filteredTodos.filter((todo) => {
          if (!todo.dueDate) return false;
          const dueDate = new Date(todo.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return dueDate.getTime() === today.getTime();
        });
      } else if (activeNavFilter === "important") {
        filteredTodos = filteredTodos.filter((todo) => todo.isStarred);
      } else if (activeNavFilter === "planned") {
        filteredTodos = filteredTodos.filter((todo) => todo.dueDate);
      } else if (activeNavFilter === "assigned") {
        // For now, just return all tasks
        filteredTodos = filteredTodos;
      }

      return filteredTodos;
    };

    // First apply the navigation filters
    // const filteredTodos = todos.filter((todo) => {
    //   const searchTextMatch = todo.title.toLowerCase().includes(searchTerm.toLowerCase())

    //   const completedMatch = showCompleted || !todo.completed

    //   const priorityMatch = priorityFilter === "all" || todo.priority === priorityFilter

    //   const categoryMatch = categoryFilter === "all" || todo.category === categoryFilter

    //   const starredMatch = !onlyStarred || todo.isStarred

    //   return searchTextMatch && completedMatch && priorityMatch && categoryMatch && starredMatch
    // })

    // Then apply sorting to the filtered results
    return getSortedTodos(getFilteredTodos());
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-50">
      <div
        className={`${
          showSidebar
            ? "block lg:hidden opacity-100 fixed top-[var(--navbar-height)] w-full h-full bg-[#0000008e]  transition-all duration-300 z-10"
            : "opacity-0 hidden"
        }`}
      />
      <div
        className={`${
          editingTodo
            ? "block lg:hidden opacity-100 fixed top-[var(--navbar-height)] w-full h-full bg-[#0000008e]  transition-all duration-300 z-10"
            : "opacity-0 hidden"
        }`}
      />

      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        todos={todos}
        // notifications={notifications}
        // unreadCount={unreadCount}
        // onMarkAsRead={markAsRead}
        // onClearNotification={clearNotification}
        // onClearAll={clearAllNotifications}
      />
      <div className="w-full flex">
        {/* sidebar */}
        {showSidebar && (
          <Sidebar
            toggleSidebar={toggleSidebar}
            editingTodo={editingTodo}
            todos={todos}
            // filteredTodos={filteredTodos}
            // setFilteredTodos={setFilteredTodos}
            activeFilter={activeNavFilter}
            onFilterChange={handleNavFilterChange}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden px-8">
          <TaskHeader
            toggleSidebar={toggleSidebar}
            viewMode={viewMode}
            toggleViewMode={toggleViewMode}
            showSidebar={showSidebar}
            currentSort={sortOption}
            isAscending={sortAscending}
            onSortChange={handleSortChange}
            onToggleSortDirection={handleToggleSortDirection}
            onClearSort={handleClearSort}
            activeNavFilter={activeNavFilter}
          />
          <TaskInput onAddTodo={handleAddTodo} />
          <TaskList
            // toggleTaskImportance={toggleTaskImportance}
            // toggleTaskCompletion={toggleTaskCompletion}
            onTaskSelect={handleTaskSelect}
            selectedTaskId={selectedTask?.id}
            viewMode={viewMode}
            // todos={todos}
            todos={getFilteredAndSortedTodos()}
            filter={{
              searchTerm,
              showCompleted,
              priority: priorityFilter,
              category: categoryFilter,
              onlyStarred,
              // onlyPlanned,
            }}
            onToggleComplete={handleToggleComplete}
            onToggleStar={handleToggleStar}
            onUpdateTodo={handleUpdateTodo}
            onDeleteTodo={handleDeleteTodo}
            onReorderTodos={handleReorderTodos}
            // filteredTodos={filteredTodos}
            // setFilteredTodos={setFilteredTodos}
          />
        </div>
      </div>

      {/* {selectedTask && (
        <TaskDetailsSidebar
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleTaskUpdate}
        />
      )} */}
    </main>
  );
};

export default App;
