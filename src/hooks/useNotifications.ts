"use client";

import { useEffect, useState } from "react";
import type { Todo } from "../types/todo";

interface Notification {
  id: string;
  todoId: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

export const useNotifications = (todos: Todo[]) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Check for upcoming due dates
  useEffect(() => {
    // Clear any existing notification timers
    const checkDueDates = () => {
      const now = new Date();
      const upcomingTodos = todos.filter(
        (todo) =>
          !todo.completed &&
          todo.dueDate &&
          todo.dueDate > now &&
          todo.dueDate.getTime() - now.getTime() <= 24 * 60 * 60 * 1000 // Due within 24 hours
      );

      const newNotifications = upcomingTodos.map((todo) => ({
        id: `${todo.id}-${Date.now()}`,
        todoId: todo.id,
        title: "Upcoming Task",
        message: `"${todo.title}" is due ${
          todo.dueDate ? formatTimeRemaining(todo.dueDate) : "soon"
        }`,
        timestamp: new Date(),
        read: false,
      }));

      if (newNotifications.length > 0) {
        setNotifications((prev) => [...prev, ...newNotifications]);
      }
    };

    // Check immediately and then set up interval
    checkDueDates();
    const intervalId = setInterval(checkDueDates, 60 * 60 * 1000); // Check every hour

    return () => clearInterval(intervalId);
  }, [todos]);

  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    markAsRead,
    clearNotification,
    clearAllNotifications,
    unreadCount: notifications.filter((n) => !n.read).length,
  };
};

// Helper function to format time remaining
const formatTimeRemaining = (dueDate: Date): string => {
  const now = new Date();
  const diffMs = dueDate.getTime() - now.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffHrs < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return `in ${diffMins} minute${diffMins !== 1 ? "s" : ""}`;
  } else if (diffHrs < 24) {
    return `in ${diffHrs} hour${diffHrs !== 1 ? "s" : ""}`;
  } else {
    const diffDays = Math.floor(diffHrs / 24);
    return `in ${diffDays} day${diffDays !== 1 ? "s" : ""}`;
  }
};
