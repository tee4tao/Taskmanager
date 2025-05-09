"use client";

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
}

const SortOptions: React.FC<SortOptionsProps> = ({
  onSortChange,
  currentSort,
  isAscending,
  onToggleSortDirection,
  onClearSort,
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
    <div className="sort-options-container" ref={dropdownRef}>
      {currentSort !== "none" ? (
        <div className="active-sort">
          <button
            className="sort-direction-btn"
            onClick={onToggleSortDirection}
            aria-label="Toggle sort direction"
          >
            {isAscending ? <ArrowSortUpRegular /> : <ArrowSortDownRegular />}
          </button>
          <span>Sorted by {getSortLabel(currentSort)}</span>
          <button
            className="clear-sort-btn"
            onClick={onClearSort}
            aria-label="Clear sort"
          >
            <DismissRegular />
          </button>
        </div>
      ) : (
        <button
          className="text-blue-600 sort-button"
          onClick={handleSortClick}
          aria-label="Sort tasks"
        >
          <TooltipIcon
            icon={ArrowSortRegular}
            tooltipText="Sort"
            className="text-blue-600"
            tipClassName="left-1/2 -translate-x-1/2"
          />{" "}
          <span className="hidden lg:inline-block text-sm">Sort</span>
        </button>
        // <button
        //   className="sort-button"
        //   onClick={handleSortClick}
        //   aria-label="Sort tasks"
        // >
        //   <ArrowSortRegular />
        //   <span>Sort</span>
        // </button>
      )}

      {isOpen && (
        <div className="sort-dropdown">
          <div className="sort-dropdown-header">
            <h3>Sort by</h3>
          </div>
          <ul className="sort-options-list">
            <li
              className={`sort-option ${
                currentSort === "importance" ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect("importance")}
            >
              <StarRegular className="sort-icon" />
              <span>Importance</span>
            </li>
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
