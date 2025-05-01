"use client";

import type React from "react";
import {
  NavigationRegular,
  GridRegular,
  ListRegular,
  ChevronDownRegular,
  FilterRegular,
  AddRegular,
  ArrowSortRegular,
  DualScreenGroupRegular,
  GridFilled,
  HomeRegular,
  CalendarWeekStartRegular,
} from "@fluentui/react-icons";
import { TooltipIcon } from "./TooltipIcon";

interface TaskHeaderProps {
  toggleSidebar: () => void;
  viewMode: "grid" | "list";
  toggleViewMode: (mode: "grid" | "list") => void;
  showSidebar: boolean;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  toggleSidebar,
  viewMode,
  toggleViewMode,
  showSidebar,
}) => {
  return (
    <header className="py-4">
      <div className="w-full flex items-center justify-between">
        <div className="flex items-center gap-14">
          <div className="flex items-center gap-1">
            {!showSidebar ? (
              <button onClick={toggleSidebar} className="p-1">
                <NavigationRegular fontSize={22} className="text-black" />
              </button>
            ) : (
              <HomeRegular fontSize={24} className="text-blue-600" />
            )}

            <h2 className="text-xl font-semibold text-blue-600">Tasks</h2>
          </div>
          <div className="space-x-4">
            <button
              onClick={() => toggleViewMode("grid")}
              className={`p-1 ${
                viewMode === "grid"
                  ? " border-b-4 border-blue-600 text-blue-600"
                  : "text-blue-600"
              }`}
            >
              <TooltipIcon
                icon={GridFilled}
                tooltipText="Grid view"
                className="text-blue-600"
                tipClassName="left-1/2 -translate-x-1/2 top-full"
              />{" "}
              <span className="hidden lg:inline-block text-sm">Grid</span>
            </button>
            <button
              onClick={() => toggleViewMode("list")}
              className={`p-1 ${
                viewMode === "list"
                  ? " border-b-4 border-blue-600 text-blue-600"
                  : "text-blue-600"
              }`}
            >
              <TooltipIcon
                icon={ListRegular}
                tooltipText="List view"
                className="text-blue-600"
                tipClassName="left-1/2 -translate-x-1/2 top-full"
              />{" "}
              <span className="hidden lg:inline-block">List</span>
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 lg:gap-8">
          <button className="text-blue-600">
            <TooltipIcon
              icon={ArrowSortRegular}
              tooltipText="Sort"
              className="text-blue-600"
              tipClassName="left-1/2 -translate-x-1/2"
            />{" "}
            <span className="hidden lg:inline-block text-sm">Sort</span>
          </button>
          <button className="text-blue-600">
            <TooltipIcon
              icon={CalendarWeekStartRegular}
              tooltipText="Group"
              className="text-blue-600"
              tipClassName="left-1/2 -translate-x-1/2 top-full"
            />{" "}
            <span className="hidden lg:inline-block text-sm">Group</span>
          </button>
        </div>
      </div>
      {/* <div className="flex items-center px-4 py-2">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-gray-100 mr-2"
        >
          <NavigationRegular fontSize={20} className="text-gray-600" />
        </button>

        <div className="flex items-center">
          <h1 className="text-lg font-semibold text-blue-600">Tasks</h1>
          <button className="ml-1 text-blue-600 opacity-70">
            <ChevronDownRegular fontSize={16} />
          </button>
        </div>

        <div className="ml-auto flex items-center space-x-1">
          <div className="border rounded-md overflow-hidden flex">
            <button
              onClick={() => toggleViewMode("grid")}
              className={`p-1 ${
                viewMode === "grid"
                  ? "bg-blue-50 border-b-2 border-blue-600"
                  : "bg-white"
              }`}
            >
              <GridRegular
                fontSize={18}
                className={
                  viewMode === "grid" ? "text-blue-600" : "text-gray-500"
                }
              />
            </button>
            <button
              onClick={() => toggleViewMode("list")}
              className={`p-1 ${
                viewMode === "list"
                  ? "bg-blue-50 border-b-2 border-blue-600"
                  : "bg-white"
              }`}
            >
              <ListRegular
                fontSize={18}
                className={
                  viewMode === "list" ? "text-blue-600" : "text-gray-500"
                }
              />
            </button>
          </div>

          <button className="flex items-center text-sm text-gray-600 px-2 py-1 hover:bg-gray-100 rounded">
            <FilterRegular fontSize={14} className="mr-1" />
            <span>Sort</span>
          </button>

          <button className="flex items-center text-sm text-gray-600 px-2 py-1 hover:bg-gray-100 rounded">
            <span>Group</span>
          </button>
        </div>
      </div> */}

      {/* <div className="px-4 py-3 bg-white shadow-xl my-4">
        <button className="flex items-center text-blue-600 hover:bg-blue-50 rounded px-2 py-1">
          <AddRegular fontSize={16} className="mr-2" />
          <span>Add a task</span>
        </button>
      </div> */}
    </header>
  );
};

export default TaskHeader;
