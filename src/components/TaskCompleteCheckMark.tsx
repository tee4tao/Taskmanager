import { useState } from "react";
import {
  CircleRegular,
  CheckmarkCircleRegular,
  CheckmarkCircleFilled,
} from "@fluentui/react-icons";
import { Todo } from "../types/todo";

interface CheckMarkProps {
  todo: Todo;
  onToggleComplete: (taskId: string) => void;
  className?: string;
}

const TaskCompleteCheckMark = ({
  todo,
  onToggleComplete,
  className = "",
}: CheckMarkProps) => {
  const [animateComplete, setAnimateComplete] = useState(false);
  return (
    <div
      className={`flex items-center text-blue-600 cursor-pointer ${className}`}
      onClick={() => onToggleComplete(todo.id)}
      onMouseOver={() => setAnimateComplete(true)}
      onMouseOut={() => setAnimateComplete(false)}
    >
      {animateComplete && !todo.completed ? (
        <CheckmarkCircleRegular fontSize={20} className="" />
      ) : todo.completed ? (
        <CheckmarkCircleFilled fontSize={20} className="" />
      ) : (
        <CircleRegular fontSize={20} className="" />
      )}
    </div>
  );
};

export default TaskCompleteCheckMark;
