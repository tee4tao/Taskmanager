import { useEffect } from "react";
import {
  AlertRegular,
  DismissRegular,
  SearchRegular,
} from "@fluentui/react-icons";
import Notifications from "./Notifications";
import { useNotifications } from "../hooks/useNotifications";
import { Todo } from "../types/todo";
import UserAuth from "./userAuth";

interface NavProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  todos: Todo[];
}

const Navbar = ({
  searchTerm,
  onSearchChange,
  todos,
}:
NavProps) => {
  const {
    notifications,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    unreadCount,
  } = useNotifications(todos);

  useEffect(() => {
    const updateNavbarHeight = () => {
      const navbar = document.getElementById("navbar");
      if (navbar) {
        document.documentElement.style.setProperty(
          "--navbar-height",
          `${navbar.offsetHeight}px`
        );
      }
    };

    updateNavbarHeight();
    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);
  return (
    <nav
      id="navbar"
      className="w-full flex flex-col items-center gap-2 bg-blue-700 py-2 px-8 "
    >
      <div className="w-full flex justify-between items-center text-white">
        <h3 className="text-xl max-sm:text-base">Onlook</h3>
        <div className="relative hidden md:block">
          <SearchRegular
            fontSize={20}
            className="absolute top-1/2 -translate-y-1/2 left-2 text-black"
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search To Do"
            className="w-72 py-1 px-8 border rounded-md text-sm text-black outline-none"
          />
          {searchTerm && (
            <button
              className="absolute top-1/2 -translate-y-1/2 right-2 text-black"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
            >
              <DismissRegular fontSize={18} />
            </button>
          )}
        </div>
        <div className="flex items-center gap-4 max-sm:gap-2">
          <Notifications
            notifications={notifications}
            unreadCount={unreadCount}
            onMarkAsRead={markAsRead}
            onClearNotification={clearNotification}
            onClearAll={clearAllNotifications}
          />
          <UserAuth />
        </div>
      </div>
      <div className="relative md:hidden">
        <SearchRegular
          fontSize={20}
          className="absolute top-1/2 -translate-y-1/2 left-2 text-black"
        />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search To Do"
          className="w-72 py-1 px-8 border rounded-md text-sm text-black outline-none"
        />
        {searchTerm && (
          <button
            className="absolute top-1/2 -translate-y-1/2 right-2 text-black"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <DismissRegular fontSize={18} />
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
