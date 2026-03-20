import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  role: string | null;
  login: (role: string, userName: string) => void;
  logout: () => void;
  isLoading: boolean;
  userName: string;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [userName, setuserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [permissions, setPermissions] = useState({
    isEdit: false,
    isCreate: false,
    isDelete: false,
    isUpdate: false,
  });
  useEffect(() => {
    localStorage.setItem("permissions", JSON.stringify(permissions));
  }, [permissions]);

  useEffect(() => {
    const isLogined = localStorage.getItem("isLogined");
    const savedRole = localStorage.getItem("role");

    if (isLogined === "true" && savedRole) {
      setIsAuthenticated(true);
      setRole(savedRole);
    }

    setIsLoading(false);
  }, []);

  const login = (role: string, userName: string) => {
    localStorage.setItem("role", role);
    localStorage.setItem("isLogined", "true"); // 🔥 MISSING LINE
    setIsAuthenticated(true);
    setuserName(userName);
    setRole(role);
    if (role === "SuperAdmin") {
      setPermissions({
        isCreate: true,
        isDelete: true,
        isEdit: true,
        isUpdate: true,
      });
      return;
    }
    if (role === "Admin") {
      setPermissions({
        isCreate: false,
        isDelete: false,
        isEdit: false,
        isUpdate: false,
      });

      return;
    }
    if (role === "SuperUser") {
      setPermissions({
        isCreate: false,
        isDelete: false,
        isEdit: false,
        isUpdate: false,
      });
      return;
    }
    setPermissions({
      isCreate: false,
      isDelete: false,
      isEdit: false,
      isUpdate: false,
    });
  };

  const logout = () => {
    localStorage.clear(); // optional but clean
    setIsAuthenticated(false);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, role, login, logout, userName }}
    >
      {children}
    </AuthContext.Provider>
  );
};
