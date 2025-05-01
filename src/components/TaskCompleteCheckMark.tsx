import { useState } from "react";
import {
  StarRegular,
  StarFilled,
  CircleRegular,
  CheckmarkCircleRegular,
} from "@fluentui/react-icons";
import { Task } from "../types";

interface CheckMarkProps {
  task: Task;
  toggleTaskCompletion: (taskId: number) => void;
  className?: string;
}

const TaskCompleteCheckMark = ({
  task,
  toggleTaskCompletion,
  className = "",
}: CheckMarkProps) => {
  const [animateComplete, setAnimateComplete] = useState(false);
  return (
    <div
      className={`flex items-center text-blue-600 cursor-pointer ${className}`}
      onClick={() => toggleTaskCompletion(task.id)}
      onMouseOver={() => setAnimateComplete(true)}
      onMouseOut={() => setAnimateComplete(false)}
    >
      {animateComplete ? (
        <CheckmarkCircleRegular fontSize={20} className="" />
      ) : task.isCompleted ? (
        <CheckmarkCircleRegular fontSize={20} className="" />
      ) : (
        <CircleRegular fontSize={20} className="" />
      )}
      {/* {task.isCompleted ? (
                        <CheckmarkCircleRegular fontSize={20} className="" />
                      ) : (
                        <CircleRegular fontSize={20} className="" />
                      )} */}
    </div>
  );
};

export default TaskCompleteCheckMark;
