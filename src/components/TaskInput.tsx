import {
  AddRegular,
  RadioButtonRegular,
  CalendarLtrRegular,
  AlertRegular,
  ArrowRepeatAllRegular,
} from "@fluentui/react-icons";
import { useState } from "react";
import { TooltipIcon } from "./TooltipIcon";
import { Category, Priority } from "../types/todo";
import DatePicker from "./DatePicker";

interface AddTodoProps {
  onAddTodo: (
    title: string,
    description?: string,
    dueDate?: Date,
    priority?: Priority,
    category?: Category
  ) => void;
}

const TaskInput = ({ onAddTodo }: AddTodoProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputClicked, setInputClicked] = useState(false);
  const [quickAddText, setQuickAddText] = useState("");

  const [selected, setSelected] = useState<Date | undefined>();

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (quickAddText.trim()) {
      onAddTodo(quickAddText.trim(), undefined, selected);
      setQuickAddText("");
    }
    setSelected(undefined);
  };

  return (
    <section className="w-full rounded-md shadow-md my-2">
      <form action="" className="w-full" onSubmit={handleQuickAdd}>
        <div className="flex items-center gap-2 bg-white p-4 py-2 shadow-sm">
          <div className="text-blue-600">
            {inputClicked ? (
              <RadioButtonRegular fontSize={20} />
            ) : (
              <AddRegular
                fontSize={20}
                onClick={() => {
                  const inputElement = document.querySelector(
                    "#quick-add-input[type='text']"
                  ) as HTMLInputElement;
                  inputElement?.focus();
                  setInputClicked(true);
                }}
                className="cursor-pointer"
                aria-label="Add task"
              />
            )}
          </div>

          <input
            type="text"
            value={quickAddText}
            onChange={(e) => setQuickAddText(e.target.value)}
            id="quick-add-input"
            className={`w-full h-8 px-4 py-2 rounded-md outline-none transition text-sm ${
              isFocused
                ? "placeholder:text-gray-400"
                : "placeholder:text-blue-600"
            }`}
            // className="w-full h-8 outline-none rounded-md"
            placeholder="Add a task"
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onClick={() => setInputClicked(true)}
          />
        </div>
        {inputClicked && (
          <div className="flex items-center justify-between p-4 py-2">
            <div className="flex items-center gap-2">
              {/* <TooltipIcon
                icon={CalendarLtrRegular}
                tooltipText="Add due date"
                tipClassName="bottom-full"
              /> */}
              <DatePicker selected={selected} setSelected={setSelected} />
              <TooltipIcon
                icon={AlertRegular}
                tooltipText="Remind me"
                tipClassName="bottom-full"
              />
              <TooltipIcon
                icon={ArrowRepeatAllRegular}
                tooltipText="Repeat"
                tipClassName="bottom-full"
              />
            </div>
            <button
              type="submit"
              disabled={!quickAddText.trim()}
              className={`border p-1 text-sm text-blue-600 ${
                !quickAddText.trim() && "cursor-not-allowed text-gray-400"
              }`}
            >
              Add
            </button>
          </div>
        )}
      </form>
    </section>
  );
};

export default TaskInput;

// const TooltipIcon = ({
//   icon: Icon,
//   tooltipText,
// }: {
//   icon: React.ElementType;
//   tooltipText: string;
// }) => {
//   const [show, setShow] = useState(false);

//   return (
//     <div
//       className="relative inline-block"
//       onMouseEnter={() => setShow(true)}
//       onMouseLeave={() => setShow(false)}
//       onFocus={() => setShow(true)}
//       onBlur={() => setShow(false)}
//       tabIndex={0} // makes it keyboard-focusable
//     >
//       <Icon fontSize={20} className="cursor-pointer" />

//       {show && (
//         <div className="absolute full-full mb-2 left-1/2 -translate-x-1/2 w-max px-3 py-1 bg-white text-sm rounded shadow-md z-10">
//           {tooltipText}
//         </div>
//       )}
//     </div>
//   );
// };
