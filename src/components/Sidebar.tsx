"use client";

import type React from "react";
import {
  NavigationRegular,
  WeatherSunnyRegular,
  StarRegular,
  CalendarRegular,
  PersonRegular,
  CheckboxCheckedRegular,
  AddRegular,
  SettingsRegular,
  HomeRegular,
  DualScreenGroupRegular,
  CalendarWeekStartRegular,
  CheckmarkRegular,
  CalendarMonthRegular,
  StarFilled,
} from "@fluentui/react-icons";
import { TooltipIcon } from "./TooltipIcon";
import { Todo } from "../types/todo";
import { useEffect } from "react";
import { motion } from "framer-motion";

interface SidebarItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
}

interface SidebarProps {
  toggleSidebar: () => void;
  editingTodo: Todo | null;
  todos: Todo[];
  // filteredTodos: Todo[];
  // setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  showSidebar: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  toggleSidebar,
  editingTodo,
  todos,
  // setFilteredTodos,
  activeFilter,
  onFilterChange,
  showSidebar,
}) => {
  // Calculate counts for each filter
  // const counts = useMemo(() => {
  //   const today = new Date();
  //   today.setHours(0, 0, 0, 0);

  //   return {
  //     myDay: todos.filter((todo) => {
  //       if (!todo.dueDate) return false;
  //       const dueDate = new Date(todo.dueDate);
  //       dueDate.setHours(0, 0, 0, 0);
  //       return dueDate.getTime() === today.getTime();
  //     }).length,
  //     important: todos.filter((todo) => todo.isStarred).length,
  //     planned: todos.filter((todo) => todo.dueDate).length,
  //     all: todos.length,
  //   };
  // }, [todos]);
  const getLocalDateString = (date: Date): string => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: "myDay",
      icon: <WeatherSunnyRegular fontSize={20} />,
      label: "My Day",
      count: todos.filter(
        (todo) =>
          !todo.completed &&
          todo.dueDate &&
          getLocalDateString(todo.dueDate) === getLocalDateString(new Date())
      ).length,
    },
    {
      id: "important",
      icon: <StarRegular fontSize={20} />,
      label: "Important",
      count: todos.filter((todo) => !todo.completed && todo.isStarred).length,
    },
    {
      id: "planned",
      icon: <CalendarRegular fontSize={20} />,
      label: "Planned",
      count: todos.filter((todo) => !todo.completed && todo.dueDate).length,
    },
    {
      id: "assigned",
      icon: <PersonRegular fontSize={20} />,
      label: "Assigned to me",
    },
    {
      id: "all",
      icon: <HomeRegular fontSize={20} />,
      label: "Tasks",
      count: todos.filter((todo) => !todo.completed).length,
      isActive: true,
    },
  ];

  // To close the sidebar when the screen sizes less than lg and a todo is being edited
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && editingTodo) {
        toggleSidebar();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [editingTodo, toggleSidebar]);

  return (
    <motion.aside
      initial={{ opacity: 0, x: showSidebar ? -50 : 0 }}
      animate={{ opacity: 1, x: showSidebar ? 0 : -50 }}
      transition={{ duration: 0.5 }}
      className="fixed lg:relative left-0 top-[var(--navbar-height)] lg:top-0 w-56 bg-white border-r flex flex-col h-screen z-20"
    >
      <div className="w-full p-4 flex items-center justify-between">
        <button className="" onClick={toggleSidebar}>
          <NavigationRegular fontSize={22} className="text-black" />
        </button>
        <button className="">
          <SettingsRegular fontSize={20} className="text-black" />
        </button>
      </div>

      <div className="mb-2 overflow-y-auto">
        <ul>
          {sidebarItems.map((item) => (
            <button key={item.id} className="w-full">
              <div
                onClick={() => {
                  if (item.id === "important") {
                    onFilterChange("important");
                  } else if (item.id === "planned") {
                    onFilterChange("planned");
                  } else if (item.id === "myDay") {
                    onFilterChange("myDay");
                  } else if (item.id === "assigned") {
                    onFilterChange("assigned");
                  } else {
                    onFilterChange("all");
                  }
                  if (window.innerWidth < 1024) {
                    // close the sidebar on mobile
                    toggleSidebar();
                  }
                }}
                className={`w-full flex items-center px-4 py-2 text-sm ${
                  activeFilter === item.id
                    ? "bg-blue-50 border-l-4 border-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                <span>{item.label}</span>
                {item.count !== undefined && item.count !== 0 && (
                  <span className="ml-auto">{item.count}</span>
                )}
              </div>
            </button>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t flex items-center gap-2">
        <button className="flex items-center text-sm text-blue-600 hover:bg-gray-100 p-2 rounded w-full">
          <AddRegular fontSize={16} className="mr-2" />
          <span>New list</span>
        </button>
        <TooltipIcon
          icon={CalendarWeekStartRegular}
          tooltipText="Create group"
          className="text-blue-600"
          tipClassName="left-1/2 -translate-x-1/2"
        />
      </div>
    </motion.aside>
  );
};

export default Sidebar;
