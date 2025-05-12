import { useEffect, useState } from "react";

export const useLongPressDrag = (delay: number = 300) => {
  const [isLongPressActive, setIsLongPressActive] = useState(false);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const isTouchDevice =
    typeof window !== "undefined" && "ontouchstart" in window;

  const onTouchStart = () => {
    const timeout = setTimeout(() => {
      setIsLongPressActive(true);
      if ("vibrate" in navigator) navigator.vibrate?.(10);
    }, delay);
    setTimer(timeout);
  };

  const onTouchEnd = () => {
    if (timer) clearTimeout(timer);
    setTimer(null);
    // Optional: set back to false after some time
    setTimeout(() => setIsLongPressActive(false), 300);
  };

  const canDrag = !isTouchDevice || isLongPressActive;

  return {
    canDrag,
    onTouchStart,
    onTouchEnd,
  };
};
