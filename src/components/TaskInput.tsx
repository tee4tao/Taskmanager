import {
  AddRegular,
  RadioButtonRegular,
  CalendarLtrRegular,
  AlertRegular,
  ArrowRepeatAllRegular,
} from "@fluentui/react-icons";
import { useState } from "react";
import { TooltipIcon } from "./TooltipIcon";

const TaskInput = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [inputClicked, setInputClicked] = useState(false);
  return (
    <section className="w-full rounded-md shadow-md my-2">
      <form action="" className="w-full bg-white p-4">
        <div className="flex items-center gap-2">
          <div className="text-blue-600">
            {inputClicked ? <RadioButtonRegular /> : <AddRegular />}
          </div>

          <input
            type="text"
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
      </form>
      {inputClicked && (
        <div className="flex items-center justify-between p-4">
          <div className="space-x-4">
            <TooltipIcon icon={CalendarLtrRegular} tooltipText="Add due date" />
            <TooltipIcon icon={AlertRegular} tooltipText="Remind me" />
            <TooltipIcon icon={ArrowRepeatAllRegular} tooltipText="Repeat" />
          </div>
          <button
            disabled
            className="border p-1 text-sm text-gray-400 cursor-not-allowed"
          >
            Add
          </button>
        </div>
      )}
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
