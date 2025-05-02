import type { User } from "../types/user";

// Mock authentication service
export const authService = {
  login: async (username: string, password: string): Promise<User> => {
    return new Promise((resolve, reject) => {
      // In a real app, this would make an API call to authenticate
      setTimeout(() => {
        // Simple validation for demo purposes
        if (username && password.length >= 6) {
          const user: User = {
            id: "1",
            username,
            email: `${username}@example.com`,
            isAuthenticated: true,
          };

          // Store in localStorage
          localStorage.setItem("user", JSON.stringify(user));

          resolve(user);
        } else {
          reject(
            new Error(
              "Invalid credentials. Password must be at least 6 characters."
            )
          );
        }
      }, 500);
    });
  },

  logout: async (): Promise<void> => {
    return new Promise((resolve) => {
      // Clear user from localStorage
      localStorage.removeItem("user");
      setTimeout(resolve, 300);
    });
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return null;

    try {
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  },
};
