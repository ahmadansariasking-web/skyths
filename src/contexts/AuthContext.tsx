import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type UserRole = "admin" | "employee" | "customer";

interface User {
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, name?: string) => { success: boolean; role: UserRole | null; error?: string };
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Session timeout in milliseconds (5 minutes)
const SESSION_TIMEOUT = 5 * 60 * 1000;

// Admin credentials
const ADMIN_EMAIL = "ad@skyths.com";
const ADMIN_PASSWORD = "admin@20206";

// Employee credentials
const EMPLOYEE_EMAIL = "employee@skyth.com";
const EMPLOYEE_PASSWORD = "employee@2000";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    checkSession();

    // Set up session timeout check
    const interval = setInterval(checkSession, 30000); // Check every 30 seconds

    // Handle page unload - logout on exit
    const handleBeforeUnload = () => {
      // We don't clear immediately, but mark the session for expiry
      const loginTime = localStorage.getItem("skyths_login_time");
      if (loginTime) {
        localStorage.setItem("skyths_session_pending_logout", "true");
      }
    };

    // Handle visibility change - check session when tab becomes visible
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkSession();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const checkSession = () => {
    const storedUser = localStorage.getItem("skyths_user");
    const loginTime = localStorage.getItem("skyths_login_time");
    const pendingLogout = localStorage.getItem("skyths_session_pending_logout");

    if (storedUser && loginTime) {
      const elapsed = Date.now() - parseInt(loginTime);
      
      // Check if session expired (5 minutes) or pending logout from previous session
      if (elapsed > SESSION_TIMEOUT || pendingLogout === "true") {
        logout();
        setIsLoading(false);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        logout();
      }
    }
    setIsLoading(false);
  };

  const login = (email: string, password: string, name?: string): { success: boolean; role: UserRole | null; error?: string } => {
    // Clear any pending logout flag
    localStorage.removeItem("skyths_session_pending_logout");

    // Check admin credentials
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser: User = {
        email: ADMIN_EMAIL,
        name: "Admin",
        role: "admin",
      };
      setUser(adminUser);
      localStorage.setItem("skyths_user", JSON.stringify(adminUser));
      localStorage.setItem("skyths_login_time", Date.now().toString());
      localStorage.setItem("skyths_admin_auth", "true");
      return { success: true, role: "admin" };
    }

    // Check employee credentials
    if (email === EMPLOYEE_EMAIL && password === EMPLOYEE_PASSWORD) {
      const employeeUser: User = {
        email: EMPLOYEE_EMAIL,
        name: "Employee",
        role: "employee",
      };
      setUser(employeeUser);
      localStorage.setItem("skyths_user", JSON.stringify(employeeUser));
      localStorage.setItem("skyths_login_time", Date.now().toString());
      localStorage.setItem("skyths_employee_auth", "true");
      return { success: true, role: "employee" };
    }

    // For regular customers (demo login - any email/password works)
    if (email && password) {
      const customerUser: User = {
        email: email,
        name: name || email.split("@")[0],
        role: "customer",
      };
      setUser(customerUser);
      localStorage.setItem("skyths_user", JSON.stringify(customerUser));
      localStorage.setItem("skyths_login_time", Date.now().toString());
      return { success: true, role: "customer" };
    }

    return { success: false, role: null, error: "Invalid credentials" };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("skyths_user");
    localStorage.removeItem("skyths_login_time");
    localStorage.removeItem("skyths_admin_auth");
    localStorage.removeItem("skyths_employee_auth");
    localStorage.removeItem("skyths_session_pending_logout");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
