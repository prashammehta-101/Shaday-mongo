import {
  createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren,
} from "react";
import { api, setAuthToken } from "../api/http";
import type { Role, User } from "../lib/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (payload: { name: string; email: string; password: string; phone?: string; role?: Role; }) => Promise<{ message: string; verificationLink: string }>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem("shaday-token"));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshProfile = async () => {
    if (!token) { setUser(null); setLoading(false); return; }
    setAuthToken(token);
    try {
      const { data } = await api.get("/auth/me");
      // MongoDB returns _id, normalize to id
      const u = data.user;
      setUser({ ...u, id: u._id || u.id });
    } catch {
      localStorage.removeItem("shaday-token");
      setAuthToken(null); setToken(null); setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { void refreshProfile(); }, [token]);

  const value = useMemo<AuthContextValue>(() => ({
    user, token, loading,
    login: async (email, password) => {
      const { data } = await api.post("/auth/login", { email, password });
      localStorage.setItem("shaday-token", data.token);
      setAuthToken(data.token);
      setToken(data.token);
      setUser({ ...data.user, id: data.user._id || data.user.id });
    },
    signup: async (payload) => {
      const { data } = await api.post("/auth/signup", payload);
      return data;
    },
    logout: () => {
      localStorage.removeItem("shaday-token");
      setAuthToken(null); setToken(null); setUser(null);
    },
    refreshProfile,
  }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
