"use client";

import type React from "react";
import { useState } from "react";
import type { Task } from "../types";
import {
  AddRegular,
  WeatherSunnyRegular,
  AlertRegular,
  CalendarRegular,
  ArrowRepeatAllRegular,
  TagRegular,
  AttachRegular,
  DismissRegular,
  DeleteRegular,
  StarRegular,
  StarFilled,
  CheckboxUncheckedRegular,
  CheckboxCheckedRegular,
  PanelRightContractRegular,
} from "@fluentui/react-icons";
import { TooltipIcon } from "./TooltipIcon";

interface TaskDetailsSidebarProps {
  task: Task | null;
  onClose: () => void;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

const TaskDetailsSidebar: React.FC<TaskDetailsSidebarProps> = ({
  task,
  onClose,
  onUpdateTask,
}) => {
  const [notes, setNotes] = useState<string>(task?.notes || "");

  if (!task) return null;

  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    onUpdateTask(task.id, { notes: e.target.value });
  };

  return (
    <div className="w-80 border-l h-screen flex flex-col bg-white z-20">
      {/* Header with task title */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <button
            onClick={() =>
              onUpdateTask(task.id, { isCompleted: !task.isCompleted })
            }
            className="text-gray-500 hover:text-blue-600 mr-3"
          >
            {task.isCompleted ? (
              <CheckboxCheckedRegular className="text-blue-600" fontSize={20} />
            ) : (
              <CheckboxUncheckedRegular fontSize={20} />
            )}
          </button>
          <h2 className="text-lg font-medium">{task.title}</h2>
        </div>
        <button
          onClick={() =>
            onUpdateTask(task.id, { isImportant: !task.isImportant })
          }
          className="text-gray-400 hover:text-blue-600"
        >
          {task.isImportant ? (
            <StarFilled className="text-blue-600" fontSize={20} />
          ) : (
            <StarRegular fontSize={20} />
          )}
        </button>
      </div>

      {/* Task options */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-4">
          {/* Add step */}
          <button className="flex items-center text-blue-600 hover:bg-blue-50 rounded px-2 py-1.5 w-full">
            <AddRegular fontSize={16} className="mr-3" />
            <span>Add step</span>
          </button>

          {/* Add to My Day */}
          <button className="flex items-center text-gray-700 hover:bg-gray-100 rounded px-2 py-1.5 w-full">
            <WeatherSunnyRegular fontSize={16} className="mr-3 text-gray-500" />
            <span>Add to My Day</span>
          </button>

          {/* Remind me */}
          <button className="flex items-center text-gray-700 hover:bg-gray-100 rounded px-2 py-1.5 w-full">
            <AlertRegular fontSize={16} className="mr-3 text-gray-500" />
            <span>Remind me</span>
          </button>

          {/* Add due date */}
          <button className="flex items-center text-gray-700 hover:bg-gray-100 rounded px-2 py-1.5 w-full">
            <CalendarRegular fontSize={16} className="mr-3 text-gray-500" />
            <span>Add due date</span>
          </button>

          {/* Repeat */}
          <button className="flex items-center text-gray-700 hover:bg-gray-100 rounded px-2 py-1.5 w-full">
            <ArrowRepeatAllRegular
              fontSize={16}
              className="mr-3 text-gray-500"
            />
            <span>Repeat</span>
          </button>

          {/* Category */}
          <div className="space-y-2">
            {task.category ? (
              <div className="flex items-center bg-red-50 text-red-700 rounded px-2 py-1 text-sm w-fit">
                <span>Red category</span>
                <button className="ml-1 text-red-700 hover:text-red-800">
                  <DismissRegular fontSize={14} />
                </button>
              </div>
            ) : null}
            <button className="flex items-center text-gray-700 hover:bg-gray-100 rounded px-2 py-1.5 w-full">
              <TagRegular fontSize={16} className="mr-3 text-gray-500" />
              <span>Pick a category</span>
            </button>
          </div>

          {/* Add file */}
          <button className="flex items-center text-gray-700 hover:bg-gray-100 rounded px-2 py-1.5 w-full">
            <AttachRegular fontSize={16} className="mr-3 text-gray-500" />
            <span>Add file</span>
          </button>

          {/* Notes */}
          <div className="pt-2">
            <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes"
              className="w-full min-h-[100px] p-2 border-0 focus:ring-0 resize-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t p-3 text-xs text-gray-500 flex justify-between items-center">
        <TooltipIcon
          icon={PanelRightContractRegular}
          tooltipText="Hide detail view"
          tipClassName="left-1/2 -translate-x-1/2 bottom-full"
          onClick={onClose}
        />
        <div>Created on Wed, April 23</div>
        <button className="text-gray-500 hover:text-red-600">
          <DeleteRegular fontSize={16} />
        </button>
      </div>
    </div>
  );
};

export default TaskDetailsSidebar;
