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
} from "@fluentui/react-icons";
import { TooltipIcon } from "./TooltipIcon";

interface SidebarProps {
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleSidebar }) => {
  const sidebarItems: SidebarItem[] = [
    {
      id: "my-day",
      icon: <WeatherSunnyRegular fontSize={20} />,
      label: "My Day",
    },
    {
      id: "important",
      icon: <StarRegular fontSize={20} />,
      label: "Important",
      count: 1,
    },
    {
      id: "planned",
      icon: <CalendarRegular fontSize={20} />,
      label: "Planned",
      count: 3,
    },
    {
      id: "assigned",
      icon: <PersonRegular fontSize={20} />,
      label: "Assigned to me",
    },
    {
      id: "tasks",
      icon: <HomeRegular fontSize={20} />,
      label: "Tasks",
      count: 8,
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
            <li key={item.id}>
              <a
                href="#"
                className={`flex items-center px-4 py-2 text-sm ${
                  item.isActive
                    ? "bg-blue-50 border-l-4 border-blue-600 font-semibold"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <span className="mr-3 text-gray-500">{item.icon}</span>
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span className="ml-auto">{item.count}</span>
                )}
              </a>
            </li>
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
