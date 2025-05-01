import { useState } from "react";

export const TooltipIcon = ({
  icon: Icon,
  tooltipText,
  className = "",
  tipClassName = "",
  onClick,
}: {
  icon: React.ElementType;
  tooltipText: string;
  className?: string;
  tipClassName?: string;
  onClick?: () => void;
}) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
      tabIndex={0} // makes it keyboard-focusable
    >
      <Icon
        fontSize={20}
        className={`cursor-pointer ${className}`}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        aria-pressed={onClick ? "false" : undefined}
      />

      {show && (
        <div
          className={`absolute mb-2 w-max px-3 py-1 bg-white text-xs text-black rounded shadow-md z-10 ${tipClassName}`}
        >
          {tooltipText}
        </div>
      )}
    </div>
  );
};
