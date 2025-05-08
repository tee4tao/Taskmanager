"use client";

import type React from "react";
import type { SidebarItem } from "../types";
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
import { useMemo } from "react";

interface SidebarProps {
  toggleSidebar: () => void;
  todos: Todo[];
  // filteredTodos: Todo[];
  // setFilteredTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  toggleSidebar,
  todos,
  // setFilteredTodos,
  activeFilter,
  onFilterChange,
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

  const sidebarItems: SidebarItem[] = [
    {
      id: "myDay",
      icon: <WeatherSunnyRegular fontSize={20} />,
      label: "My Day",
      count: todos.filter(
        (todo) =>
          !todo.completed &&
          todo.dueDate?.toISOString().split("T")[0] ===
            new Date().toISOString().split("T")[0]
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

  return (
    <aside className="w-56 bg-white border-r flex flex-col h-screen z-20">
      <div className="w-full p-4 flex items-center justify-between">
        <button className="" onClick={toggleSidebar}>
          <NavigationRegular fontSize={20} className="text-gray-600" />
        </button>
        <button className="">
          <SettingsRegular fontSize={20} className="text-gray-600" />
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
    </aside>
  );
};

export default Sidebar;
