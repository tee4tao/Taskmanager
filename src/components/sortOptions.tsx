import type React from "react";

import { useState, useRef, useEffect } from "react";
import {
  ArrowSortDownRegular,
  ArrowSortUpRegular,
  DismissRegular,
  ArrowSortRegular,
  StarRegular,
  CalendarMonthRegular,
  WeatherSunnyRegular,
  TextSortAscendingRegular,
  CalendarAddRegular,
  ChevronDownRegular,
  ChevronUpRegular,
} from "@fluentui/react-icons";
import { TooltipIcon } from "./TooltipIcon";

export type SortOption =
  | "importance"
  | "dueDate"
  | "addedToMyDay"
  | "alphabetically"
  | "creationDate"
  | "none";

interface SortOptionsProps {
  onSortChange: (option: SortOption) => void;
  currentSort: SortOption;
  isAscending: boolean;
  onToggleSortDirection: () => void;
  onClearSort: () => void;
  activeNavFilter: string;
}

const SortOptions: React.FC<SortOptionsProps> = ({
  onSortChange,
  currentSort,
  isAscending,
  onToggleSortDirection,
  onClearSort,
  activeNavFilter,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSortClick = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionSelect = (option: SortOption) => {
    onSortChange(option);
    setIsOpen(false);
  };

  const getSortLabel = (option: SortOption): string => {
    switch (option) {
      case "importance":
        return "Importance";
      case "dueDate":
        return "Due date";
      case "addedToMyDay":
        return "Added to My Day";
      case "alphabetically":
        return "Alphabetically";
      case "creationDate":
        return "Creation date";
      default:
        return "";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {currentSort !== "none" ? (
        <div className="flex items-center gap-2 py-2 px-3 text-sm ">
          <button
            className="p-1 flex items-center justify-center text-[#323130]"
            onClick={onToggleSortDirection}
            aria-label="Toggle sort direction"
          >
            {isAscending ? (
              <TooltipIcon
                icon={ChevronUpRegular}
                tooltipText="Reverse sort order"
                tipClassName="left-1/2 -translate-x-1/2 bottom-full"
              />
            ) : (
              <TooltipIcon
                icon={ChevronDownRegular}
                tooltipText="Reverse sort order"
                tipClassName="left-1/2 -translate-x-1/2 bottom-full"
              />
            )}
          </button>
          <span>Sorted by {getSortLabel(currentSort)}</span>
          <button
            className="p-1 flex items-center justify-center text-[#323130]"
            onClick={onClearSort}
            aria-label="Clear sort"
          >
            <TooltipIcon
              icon={DismissRegular}
              tooltipText="Remove sort order option"
              className="text-base"
              tipClassName="left-1/2 -translate-x-1/2 bottom-full"
            />
          </button>
        </div>
      ) : (
        <button
          className="text-blue-600 flex items-center gap-2 text-sm "
          onClick={handleSortClick}
          aria-label="Sort tasks"
        >
          <TooltipIcon
            icon={ArrowSortRegular}
            tooltipText="Sort"
            className=""
            tipClassName="left-1/2 -translate-x-1/2"
          />{" "}
          <span className="hidden lg:inline-block text-sm">Sort</span>
        </button>
      )}

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#edebe9] rounded-md shadow-lg z-10 overflow-hidden">
          <div className="py-3 px-4 border-b border-[#edebe9">
            <h3 className="font-semibold">Sort by</h3>
          </div>
          <ul className="list-none">
            {activeNavFilter !== "important" && (
              <li
                className={`sort-option ${
                  currentSort === "importance" ? "selected" : ""
                }`}
                onClick={() => handleOptionSelect("importance")}
              >
                <StarRegular className="sort-icon" />
                <span>Importance</span>
              </li>
            )}
            <li
              className={`sort-option ${
                currentSort === "dueDate" ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect("dueDate")}
            >
              <CalendarMonthRegular className="sort-icon" />
              <span>Due date</span>
            </li>
            <li
              className={`sort-option ${
                currentSort === "addedToMyDay" ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect("addedToMyDay")}
            >
              <WeatherSunnyRegular className="sort-icon" />
              <span>Added to My Day</span>
            </li>
            <li
              className={`sort-option ${
                currentSort === "alphabetically" ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect("alphabetically")}
            >
              <TextSortAscendingRegular className="sort-icon" />
              <span>Alphabetically</span>
            </li>
            <li
              className={`sort-option ${
                currentSort === "creationDate" ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect("creationDate")}
            >
              <CalendarAddRegular className="sort-icon" />
              <span>Creation date</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default SortOptions;
