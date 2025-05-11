// components/DatePicker.tsx
import { Popover } from "@headlessui/react";
import { CalendarLtrRegular, DismissRegular } from "@fluentui/react-icons";
import { format } from "date-fns";
import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { TooltipIcon } from "./TooltipIcon";

interface DatePickerProps {
  selected: Date | undefined;
  setSelected: React.Dispatch<React.SetStateAction<Date | undefined>>;
}

const DatePicker = ({ selected, setSelected }: DatePickerProps) => {
  const [tempSelected, setTempSelected] = useState<Date | undefined>(); // Temporary date inside popup

  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          {!selected && (
            <Popover.Button className="p-2 rounded-md hover:bg-gray-100">
              <TooltipIcon
                icon={CalendarLtrRegular}
                tooltipText="Add due date"
                tipClassName="bottom-full"
              />
            </Popover.Button>
          )}

          {!selected && open && (
            <Popover.Panel className="absolute z-10 mt-2 bg-white border rounded-lg shadow-lg p-4 ">
              <DayPicker
                className=""
                mode="single"
                selected={tempSelected}
                onSelect={setTempSelected}
                disabled={{ before: new Date() }}
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setSelected(tempSelected);
                  close(); // Close the popover manually
                }}
                disabled={!tempSelected}
                className="w-full bg-blue-600 text-white py-1.5 rounded mt-2 hover:bg-blue-700 disabled:bg-gray-300"
              >
                Save
              </button>
            </Popover.Panel>
          )}

          {/* Display of selected date */}
          {selected && (
            <div className="mt-2 text-sm text-gray-600 bg-gray-100 p-2 rounded-md flex items-center gap-2">
              {format(selected, "PPP")}{" "}
              <button
                aria-label="Remove date"
                onClick={() => {
                  setSelected(undefined);
                  setTempSelected(undefined);
                }}
              >
                <DismissRegular fontSize={18} />
              </button>
            </div>
          )}
        </>
      )}
    </Popover>
  );
};

export default DatePicker;
