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
import SortOptions, { SortOption } from "./sortOptions";
import { useEffect } from "react";

interface TaskHeaderProps {
  toggleSidebar: () => void;
  viewMode: "grid" | "list";
  toggleViewMode: (mode: "grid" | "list") => void;
  showSidebar: boolean;
  onSortChange: (option: SortOption) => void;
  currentSort: SortOption;
  isAscending: boolean;
  onToggleSortDirection: () => void;
  onClearSort: () => void;
  activeNavFilter: string;
}

const TaskHeader: React.FC<TaskHeaderProps> = ({
  toggleSidebar,
  viewMode,
  toggleViewMode,
  showSidebar,
  onSortChange,
  currentSort,
  isAscending,
  onToggleSortDirection,
  onClearSort,
  activeNavFilter,
}) => {
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);
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
          <div className="flex items-center gap-2">
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
        {activeNavFilter !== "myDay" && (
          <div className="flex items-center gap-2 lg:gap-8">
            <SortOptions
              currentSort={currentSort}
              isAscending={isAscending}
              onSortChange={onSortChange}
              onToggleSortDirection={onToggleSortDirection}
              onClearSort={onClearSort}
              activeNavFilter={activeNavFilter}
            />
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
        )}
      </div>
    </header>
  );
};

export default TaskHeader;
