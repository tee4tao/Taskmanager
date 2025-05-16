import type React from "react";
import { createContext, useContext, useState, useEffect } from "react";
import type { User } from "../types/user";
import { authService } from "../services/authService";

type UserContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  authModal: boolean;
  setAuthModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [authModal, setAuthModal] = useState<boolean>(false);

  // Check for logged in user on initial render
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // Handle user login
  const login = async (username: string, password: string) => {
    try {
      const loggedInUser = await authService.login(username, password);
      setUser(loggedInUser);
    } catch (error) {
      throw error;
    }
  };

  // Handle user logout
  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{ user, login, logout, authModal, setAuthModal }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the user context
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
