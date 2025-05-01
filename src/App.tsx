"use client";

import type React from "react";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import TaskHeader from "./components/TaskHeader";
import TaskList from "./components/TaskList";
import TaskDetailsSidebar from "./components/TaskDetailsSidebar";
import type { Task } from "./types";
import TaskInput from "./components/TaskInput";

const App: React.FC = () => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const initialTasks: Task[] = [
    {
      id: 1,
      title: "Category",
      dueDate: "",
      isImportant: false,
      isCompleted: false,
      notes: "",
      category: "",
    },
    {
      id: 2,
      title: "Task0",
      dueDate: "",
      isImportant: true,
      isCompleted: false,
      notes: "",
      category: "",
    },
    {
      id: 3,
      title: "Task6",
      dueDate: "",
      isImportant: false,
      isCompleted: false,
      notes: "",
      category: "",
    },
    {
      id: 4,
      title: "Task5",
      dueDate: "04/24/2025",
      isImportant: false,
      isCompleted: false,
      notes: "",
      category: "",
    },
    {
      id: 5,
      title: "Task4",
      dueDate: "04/23/2025",
      isImportant: false,
      isCompleted: false,
      notes: "",
      category: "",
    },
    {
      id: 6,
      title: "Test1",
      dueDate: "04/23/2025",
      isImportant: false,
      isCompleted: false,
      notes: "",
      category: "",
    },
    {
      id: 7,
      title: "Task3",
      dueDate: "",
      isImportant: false,
      isCompleted: false,
      notes: "",
      category: "",
    },
    {
      id: 8,
      title: "Test2",
      dueDate: "",
      isImportant: false,
      isCompleted: false,
      notes: "testing 123",
      category: "Red category",
    },
  ];

  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleViewMode = (mode: "grid" | "list") => {
    setViewMode(mode);
  };

  const toggleTaskImportance = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isImportant: !task.isImportant } : task
      )
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({
        ...selectedTask,
        isImportant: !selectedTask.isImportant,
      });
    }
  };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({
        ...selectedTask,
        isCompleted: !selectedTask.isCompleted,
      });
    }
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
  };

  const handleTaskUpdate = (taskId: number, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, ...updates });
    }
  };

  return (
    <main className="flex min-h-screen bg-gray-50">
      <div
        className={`${
          showSidebar
            ? "block lg:hidden opacity-100 fixed inset-0 w-full h-full bg-[#0000008e]  transition-all duration-300 z-10"
            : "opacity-0 hidden"
        }`}
      />
      <div
        className={`${
          selectedTask
            ? "block lg:hidden opacity-100 fixed inset-0 w-full h-full bg-[#0000008e]  transition-all duration-300 z-10"
            : "opacity-0 hidden"
        }`}
      />
      {showSidebar && <Sidebar toggleSidebar={toggleSidebar} />}

      <div className="flex-1 flex flex-col overflow-hidden px-8">
        <TaskHeader
          toggleSidebar={toggleSidebar}
          viewMode={viewMode}
          toggleViewMode={toggleViewMode}
          showSidebar={showSidebar}
        />
        <TaskInput />
        <TaskList
          tasks={tasks}
          toggleTaskImportance={toggleTaskImportance}
          toggleTaskCompletion={toggleTaskCompletion}
          onTaskSelect={handleTaskSelect}
          selectedTaskId={selectedTask?.id}
          viewMode={viewMode}
        />
      </div>

      {selectedTask && (
        <TaskDetailsSidebar
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdateTask={handleTaskUpdate}
        />
      )}
    </main>
  );
};

export default App;
