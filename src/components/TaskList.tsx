"use client";

import type React from "react";
import type { Task } from "../types";
import {
  StarRegular,
  StarFilled,
  CircleRegular,
  CheckmarkCircleRegular,
} from "@fluentui/react-icons";
import { TooltipIcon } from "./TooltipIcon";
import TaskCompleteCheckMark from "./TaskCompleteCheckMark";

interface TaskListProps {
  tasks: Task[];
  toggleTaskImportance: (taskId: number) => void;
  toggleTaskCompletion: (taskId: number) => void;
  onTaskSelect: (task: Task) => void;
  selectedTaskId?: number;
  viewMode: "grid" | "list";
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  toggleTaskImportance,
  toggleTaskCompletion,
  onTaskSelect,
  selectedTaskId,
  viewMode,
}) => {
  return (
    <section className="flex-1 overflow-auto">
      {viewMode === "grid" ? (
        <table className="min-w-full bg-white shadow-lg">
          <thead className=" border-b">
            <tr>
              <th className="text-left py-3 px-4 font-normal text-sm text-gray-600 w-8"></th>
              <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
                Title
              </th>
              <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
                Due Date
              </th>
              <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
                Importance
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className={`border-b h-10  `}>
                <td className="py-1 px-4" onClick={(e) => e.stopPropagation()}>
                  <TaskCompleteCheckMark
                    task={task}
                    toggleTaskCompletion={toggleTaskCompletion}
                    className="hover:border border-gray-400 p-1 w-8"
                  />
                </td>
                <td
                  className={`py-1 px-4 text-sm hover:border-2 hover:border-gray-400 ${
                    selectedTaskId === task.id
                      ? "border-2 border-blue-600 hover:border-blue-600"
                      : ""
                  }`}
                  onClick={() => onTaskSelect(task)}
                >
                  {task.title}
                </td>
                <td className="py-1 px-4 text-sm text-red-500">
                  {task.dueDate}
                </td>
                <td className="py-1 px-4" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleTaskImportance(task.id)}
                    className="text-gray-400 hover:text-blue-600 hover:border border-gray-400 px-2"
                  >
                    {task.isImportant ? (
                      <TooltipIcon
                        icon={StarFilled}
                        tooltipText="Remove importance"
                        className="text-blue-600"
                      />
                    ) : (
                      <TooltipIcon
                        icon={StarRegular}
                        tooltipText="Mark task as important"
                        className="text-blue-600"
                      />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map((task) => (
            <article
              key={task.id}
              className={`flex justify-between px-4 items-center h-14 shadow-md bg-white hover:bg-gray-100 cursor-pointer ${
                selectedTaskId === task.id
                  ? "bg-blue-300 hover:bg-blue-300"
                  : ""
              }`}
              onClick={() => onTaskSelect(task)}
            >
              <div className="flex items-center gap-2">
                <div className="" onClick={(e) => e.stopPropagation()}>
                  <TaskCompleteCheckMark
                    task={task}
                    toggleTaskCompletion={toggleTaskCompletion}
                    className=""
                  />
                </div>
                <div>
                  <div className={` text-sm `}>{task.title}</div>
                  <p className=" text-xs text-red-500">{task.dueDate}</p>
                </div>
              </div>
              <div className="" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => toggleTaskImportance(task.id)}
                  className="text-gray-400 hover:text-blue-600 "
                >
                  {task.isImportant ? (
                    <TooltipIcon
                      icon={StarFilled}
                      tooltipText="Remove importance"
                      className="text-blue-600"
                      tipClassName="left-0 -translate-x-full"
                    />
                  ) : (
                    <TooltipIcon
                      icon={StarRegular}
                      tooltipText="Mark task as important"
                      className="text-blue-600"
                      tipClassName="left-0 -translate-x-full"
                    />
                  )}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
      {/* <table className="min-w-full bg-white shadow-lg">
        <thead className=" border-b">
          <tr>
            <th className="text-left py-3 px-4 font-normal text-sm text-gray-600 w-8"></th>
            <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
              Title
            </th>
            <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
              Due Date
            </th>
            <th className="text-left py-3 px-4 font-normal text-sm text-gray-600">
              Importance
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className={`border-b h-10  `}>
              <td className="py-1 px-4" onClick={(e) => e.stopPropagation()}>
                <TaskCompleteCheckMark
                  task={task}
                  toggleTaskCompletion={toggleTaskCompletion}
                  className="hover:border border-gray-400 p-1 w-8"
                />
              </td>
              <td
                className={`py-1 px-4 text-sm hover:border-2 hover:border-gray-400 ${
                  selectedTaskId === task.id
                    ? "border-2 border-blue-600 hover:border-blue-600"
                    : ""
                }`}
                onClick={() => onTaskSelect(task)}
              >
                {task.title}
              </td>
              <td className="py-1 px-4 text-sm text-red-500">{task.dueDate}</td>
              <td className="py-1 px-4" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => toggleTaskImportance(task.id)}
                  className="text-gray-400 hover:text-blue-600 hover:border border-gray-400 px-2"
                >
                  {task.isImportant ? (
                    <TooltipIcon
                      icon={StarFilled}
                      tooltipText="Remove importance"
                      className="text-blue-600"
                    />
                  ) : (
                    <TooltipIcon
                      icon={StarRegular}
                      tooltipText="Mark task as important"
                      className="text-blue-600"
                    />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </section>
  );
};

export default TaskList;
