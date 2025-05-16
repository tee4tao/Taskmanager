import type React from "react";
import { useState } from "react";
import { useUser } from "../context/UserContext";
import { PersonRegular, SignOutRegular } from "@fluentui/react-icons";
import { motion } from "framer-motion";

const UserAuth = () => {
  const [isLoginFormOpen, setIsLoginFormOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, login, logout, authModal, setAuthModal } = useUser();

  const toggleLoginForm = () => {
    setIsLoginFormOpen(!isLoginFormOpen);
    setError("");
    setAuthModal(!authModal);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError("Username and password are required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      await login(username, password);
      setUsername("");
      setPassword("");
      setIsLoginFormOpen(false);
      setAuthModal(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="relative w-full">
      {user ? (
        <div className="flex items-center gap-2 max-sm:gap-">
          <div className="flex items-center gap-1 text-white">
            <PersonRegular fontSize={20} className="max-sm:text-base" />
            <span className="text-sm max-sm:text-xs">{user.username}</span>
          </div>
          <button
            className="flex items-center gap-1 text-red-600 font-medium text-xs py-1 px-2 rounded-md hover:text-[ffffff1a]"
            onClick={handleLogout}
            aria-label="Log out"
          >
            <SignOutRegular />
            <span>Log out</span>
          </button>
        </div>
      ) : (
        <div className="">
          <button
            className="flex items-center gap-1 text-white text-sm py-1 px-2 rounded-md hover:text-[ffffff1a]"
            onClick={toggleLoginForm}
          >
            <PersonRegular fontSize={20} className="max-sm:text-base" />
            <span className=" max-sm:text-xs">Log in</span>
          </button>

          {isLoginFormOpen && (
            <motion.div
              className="fixed top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-[300px] bg-white rounded-md shadow-lg z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <form onSubmit={handleLogin} className="p-4">
                <h3 className="text-lg font-semibold mb-2 text-black">
                  Log in
                </h3>

                {error && (
                  <div className="p-2 bg-[#d134381a] text-[#d13438] rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-1">
                  <label htmlFor="username">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter username"
                    required
                    className="w-full p-2 border border-[#edebe9] rounded-md text-sm text-gray-500 outline-blue-600"
                  />
                </div>

                <div className="mb-1">
                  <label htmlFor="password">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    required
                    className="w-full p-2 border border-[#edebe9] rounded-md text-sm text-gray-500 outline-blue-600"
                  />
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={toggleLoginForm}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Logging in..." : "Log in"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAuth;
