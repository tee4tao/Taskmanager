"use client";

import type React from "react";
import { useState, useEffect, useReducer } from "react";
import Sidebar from "./components/Sidebar";
import TaskHeader from "./components/TaskHeader";
import TaskList from "./components/TodoList";
import TaskDetailsSidebar from "./components/TaskDetailsSidebar";
import TaskInput from "./components/TaskInput";
import type { Todo, Category } from "./types/todo";
import { Priority } from "./types/todo";
import { User } from "./types/user";
import { todoService } from "./services/todoService";
import { authService } from "./services/authService";
import { useTodoContext } from "./context/TodoContext";
import Navbar from "./components/Navbar";
import { SortOption } from "./components/sortOptions";
import { useUser } from "./context/UserContext";
import { motion, AnimatePresence } from "framer-motion";

const App: React.FC = () => {
  const { editingTodo, setEditingTodo, updateTodo, todos, handleCloseModal } =
    useTodoContext();
  const { authModal } = useUser();

  const [showSidebar, setShowSidebar] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">(() =>
    localStorage.getItem("viewMode") === "list" ? "list" : "grid"
  );
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);

  // State for filters
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompleted, setShowCompleted] = useState(true);
  const [priorityFilter, setPriorityFilter] = useState<Priority | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [onlyStarred, setOnlyStarred] = useState(false);

  // State for sorting
  const [sortOption, setSortOption] = useState<SortOption>("none");
  const [sortAscending, setSortAscending] = useState(true);

  // State for sidebar navigation
  const [activeNavFilter, setActiveNavFilter] = useState("all");

  // State for user
  const [user, setUser] = useState<User | null>(null);

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

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

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
        // This is a placeholder - in a real app, there will be a "myDay" flag
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

    return getSortedTodos(getFilteredTodos());
  };
  const handleSaveTodo = (updatedTodo: Todo) => {
    updateTodo(updatedTodo);
    setEditingTodo(null);
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
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${
            authModal
              ? "block opacity-100 fixed top-0 w-full h-full bg-[#0000008e]  transition-all duration-300 z-30"
              : "opacity-0 hidden"
          }`}
        />
      </AnimatePresence>

      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        todos={todos}
      />
      <div className="w-full flex">
        {/* sidebar */}
        {showSidebar && (
          <Sidebar
            toggleSidebar={toggleSidebar}
            editingTodo={editingTodo}
            todos={todos}
            activeFilter={activeNavFilter}
            onFilterChange={handleNavFilterChange}
          />
        )}

        {/* TaskDetailsSidebar */}
        {editingTodo && (
          <TaskDetailsSidebar
            todo={editingTodo}
            onSave={handleSaveTodo}
            onClose={handleCloseModal}
          />
        )}
        <div className="flex-1 flex flex-col overflow-hidden px-8 min-h-[35rem]">
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
          <TaskInput />
          <TaskList
            onTaskSelect={handleTaskSelect}
            selectedTaskId={selectedTask?.id}
            viewMode={viewMode}
            todos={getFilteredAndSortedTodos()}
            filter={{
              searchTerm,
              showCompleted,
              priority: priorityFilter,
              category: categoryFilter,
              onlyStarred,
            }}
          />
        </div>
      </div>
    </main>
  );
};

export default App;
