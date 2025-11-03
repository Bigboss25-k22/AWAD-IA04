import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loginRequest, getProfile } from "../api/authApi";
import { setTokens as setTokensLocal, clearTokens, getRefreshToken } from "../api/axiosClient";

type User = { id?: string; email: string; name?: string } | null;

interface AuthContextValue {
  user: User;
  loading: boolean;
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only attempt to fetch profile if we have a refresh token stored.
    // Otherwise avoid making an unauthenticated /auth/profile call that triggers a 401 + refresh cycle.
    const storedRefresh = getRefreshToken();
    if (storedRefresh) {
      fetchProfile();
    } else {
      // no stored refresh token: nothing to do, mark loading false
      setLoading(false);
    }
    const onLogout = () => {
      clearTokens();
      setUser(null);
    };
    window.addEventListener("logout", onLogout);
    return () => window.removeEventListener("logout", onLogout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (data: { email: string; password: string }) => {
    setLoading(true);
    try {
      console.log("AuthProvider.login called with:", data);
      const res = await loginRequest(data);
      console.log("AuthProvider.login response:", res);
      setTokensLocal(res.accessToken, res.refreshToken);
      await fetchProfile();
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setUser(null);

    window.location.href = "/login";
  };

  const value = useMemo(() => ({ user, loading, login, logout }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}