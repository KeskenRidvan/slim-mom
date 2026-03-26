import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import {
  loginOperation,
  registerOperation,
  logoutOperation,
} from "../api/client";
import { useUI } from "./UIContext";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { withLoader } = useUI();

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("accessToken")
  );

  const login = useCallback(
    async (credentials) => {
      await withLoader(async () => {
        const data = await loginOperation(credentials);
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(data.user));
      });
    },
    [withLoader]
  );

  const register = useCallback(
    async (userData) => {
      await withLoader(async () => {
        const data = await registerOperation(userData);
        setUser(data.user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(data.user));
      });
    },
    [withLoader]
  );

  const logout = useCallback(async () => {
    await withLoader(async () => {
      try {
        await logoutOperation();
      } finally {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem("user");
      }
    });
  }, [withLoader]);

  const value = useMemo(
    () => ({ user, isAuthenticated, login, register, logout }),
    [user, isAuthenticated, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
