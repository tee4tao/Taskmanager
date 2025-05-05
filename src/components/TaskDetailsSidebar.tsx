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
  CheckmarkCircleRegular,
  CircleRegular,
  ImportantRegular,
  CheckmarkCircleFilled,
} from "@fluentui/react-icons";
import { TooltipIcon } from "./TooltipIcon";
import { Category, Priority, Todo } from "../types/todo";
import TaskCompleteCheckMark from "./TaskCompleteCheckMark";

interface TaskDetailsSidebarProps {
  todo: Todo;
  onClose: () => void;
  onSave: (updatedTodo: Todo) => void;
  // onToggleComplete: (id: string) => void;
  // onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

const TaskDetailsSidebar: React.FC<TaskDetailsSidebarProps> = ({
  todo,
  onClose,
  onSave,
  // onToggleComplete,
}) => {
  const [title, setTitle] = useState(todo.title);
  const [description, setDescription] = useState(todo.description || "");
  const [dueDate, setDueDate] = useState<string>(
    todo.dueDate ? new Date(todo.dueDate).toISOString().split("T")[0] : ""
  );
  const [priority, setPriority] = useState<Priority>(todo.priority);
  const [category, setCategory] = useState<Category>(todo.category);
  const [completed, setCompleted] = useState<boolean>(todo.completed);
  const [isStarred, setIsStarred] = useState<boolean>(todo.isStarred);
  const [animateComplete, setAnimateComplete] = useState<boolean>(false);

  if (!todo) return null;

  const toggleCompleted = () => {
    setCompleted(!completed);
  };
  const toggleStarred = () => {
    setIsStarred(!isStarred);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert("Title is required");
      return;
    }

    const updatedTodo: Todo = {
      ...todo,
      title: title.trim(),
      description: description.trim() || undefined,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      priority,
      category,
      completed,
      isStarred,
    };

    onSave(updatedTodo);
  };

  return (
    <div className="w-80 border-l min-h-screen flex flex-col justify-between bg-white z-20 fixed right-0 top-0">
      <form action="" onSubmit={handleSubmit}>
        {/* Header with task title */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center">
            {/* <div className="" onClick={(e) => e.stopPropagation()}>
              <TaskCompleteCheckMark
                todo={todo}
                onToggleComplete={onToggleComplete}
                className=""
              />
            </div> */}
            <button
              type="button"
              onClick={toggleCompleted}
              onMouseOver={() => setAnimateComplete(true)}
              onMouseOut={() => setAnimateComplete(false)}
              aria-label={completed ? "Mark as incomplete" : "Mark as complete"}
              className="text-gray-500 hover:text-blue-600 mr-3"
            >
              {animateComplete && !completed ? (
                <CheckmarkCircleRegular fontSize={20} />
              ) : completed ? (
                <CheckmarkCircleFilled
                  className="text-blue-600"
                  fontSize={20}
                />
              ) : (
                <CircleRegular fontSize={20} className="text-blue-600" />
              )}
            </button>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              required
              className="text-lg font-medium"
            />
            {/* <h2 className="text-lg font-medium">{task.title}</h2> */}
          </div>
          <button
            type="button"
            onClick={toggleStarred}
            aria-label={isStarred ? "Unstar task" : "Star task"}
            className="text-gray-400 hover:text-blue-600"
          >
            {isStarred ? (
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
              <WeatherSunnyRegular
                fontSize={16}
                className="mr-3 text-gray-500"
              />
              <span>Add to My Day</span>
            </button>

            {/* Remind me */}
            <button className="flex items-center text-gray-700 hover:bg-gray-100 rounded px-2 py-1.5 w-full">
              <AlertRegular fontSize={16} className="mr-3 text-gray-500" />
              <span>Remind me</span>
            </button>

            {/* Add due date */}
            <div className="flex items-center text-gray-700 hover:bg-gray-100 rounded px-2 py-1.5 w-full">
              <CalendarRegular fontSize={16} className="mr-3 text-gray-500" />
              {/* <span>Add due date</span> */}
              <input
                id="dueDate"
                type="date"
                value={dueDate ? dueDate : "Add due date"}
                onChange={(e) => setDueDate(e.target.value)}
                className="form-control"
              />
            </div>

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
              {/* {task.category ? (
              <div className="flex items-center bg-red-50 text-red-700 rounded px-2 py-1 text-sm w-fit">
                <span>Red category</span>
                <button className="ml-1 text-red-700 hover:text-red-800">
                  <DismissRegular fontSize={14} />
                </button>
              </div>
            ) : null} */}
              <div className="flex items-center text-gray-700 px-2 py-1.5 w-full">
                <TagRegular fontSize={16} className="mr-3 text-gray-500" />
                <span>Pick a category</span>
              </div>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="form-control"
              >
                <option value={Category.Personal}>Personal</option>
                <option value={Category.Work}>Work</option>
                <option value={Category.Shopping}>Shopping</option>
                <option value={Category.Health}>Health</option>
                <option value={Category.Other}>Other</option>
              </select>
            </div>

            {/* Priority(added now) */}
            <div className="space-y-2">
              <div className="flex items-center text-gray-700 px-2 py-1.5 w-full">
                <ImportantRegular
                  fontSize={16}
                  className="mr-3 text-gray-500"
                />
                <p className="">Priority</p>
              </div>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="form-control"
              >
                <option value={Priority.Low}>Low</option>
                <option value={Priority.Medium}>Medium</option>
                <option value={Priority.High}>High</option>
              </select>
            </div>

            {/* Add file */}
            <button className="flex items-center text-gray-700 hover:bg-gray-100 rounded px-2 py-1.5 w-full">
              <AttachRegular fontSize={16} className="mr-3 text-gray-500" />
              <span>Add file</span>
            </button>

            {/* Notes */}
            <div className="pt-2">
              {/* <textarea
              value={notes}
              onChange={handleNotesChange}
              placeholder="Add notes"
              className="w-full min-h-[100px] p-2 border-0 focus:ring-0 resize-none text-sm"
            /> */}
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add notes"
                className="w-full min-h-[100px] p-2 border-0 focus:ring-0 resize-none text-sm"
                rows={3}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-2 p-4 border-t border-t-[#edebe9]">
          <button
            type="button"
            className="py-2 px-4 border-none rounded-md text-sm bg-[#f3f2f1] text-[#323130] hover:bg-[#edebe9] transition-all duration-200"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="py-2 px-4 border-none rounded-md text-sm bg-[#0078d4] text-white hover:bg-[#106ebe] transition-all duration-200"
          >
            Save
          </button>
        </div>
      </form>

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
