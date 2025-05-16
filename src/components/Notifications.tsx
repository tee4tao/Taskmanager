import type React from "react";
import { useState } from "react";
import {
  AlertRegular,
  DismissRegular,
  EyeRegular,
} from "@fluentui/react-icons";
import { TooltipIcon } from "./TooltipIcon";

interface Notification {
  id: string;
  todoId: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

interface NotificationsProps {
  notifications: Notification[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onClearNotification: (id: string) => void;
  onClearAll: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  unreadCount,
  onMarkAsRead,
  onClearNotification,
  onClearAll,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="relative">
      <button
        className="border-none text-white relative"
        onClick={toggleNotifications}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <TooltipIcon
          icon={AlertRegular}
          tooltipText="Notifications"
          className="max-sm:text-base"
          tipClassName="left-0 -translate-x-full"
        />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#d13438] text-xs w-4 h-4 rounded-full flex justify-center items-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 -translate-x-[60%] top-full bg-white max-h-[400px] shadow-lg rounded-md w-[300px] mt-2 z-30 overflow-hidden">
          <div className="flex justify-between items-center py-3 px-4 border-b border-[#edebe9]">
            <h3 className="font-semibold text-gray-600">Notifications</h3>
            {notifications.length > 0 && (
              <button
                className="text-blue-600 text-sm hover:underline"
                onClick={onClearAll}
              >
                Clear all
              </button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-center text-[#605e5c]">No notifications</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`flex py-3 px-4 border-b border-[#edebe9] ${
                    !notification.read ? "bg-[#0078d40d]" : ""
                  }`}
                >
                  <div className="flex-1">
                    <h4 className="text-[0.9rem] font-medium mb-1 text-gray-500">
                      {notification.title}
                    </h4>
                    <p className="text-[0.8rem] text-[#605e5c] mb-1">
                      {notification.message}
                    </p>
                    <span className="text-xs text-[#605e5c]">
                      {formatTime(notification.timestamp)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    {!notification.read && (
                      <button
                        className="mark-read-btn"
                        onClick={() => onMarkAsRead(notification.id)}
                        aria-label="Mark as read"
                      >
                        <TooltipIcon
                          icon={EyeRegular}
                          tooltipText="Mark as read"
                          className=""
                          tipClassName="left-0 -translate-x-full"
                        />
                      </button>
                    )}
                    <button
                      className="dismiss-btn"
                      onClick={() => onClearNotification(notification.id)}
                      aria-label="Dismiss notification"
                    >
                      <TooltipIcon
                        icon={DismissRegular}
                        tooltipText="Dismiss"
                        className=""
                        tipClassName="left-0 -translate-x-full bottom-full"
                      />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
