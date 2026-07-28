import { createContext, useContext, useState, useCallback, useEffect } from "react";
import api from "../api";
const AuthContext = createContext(null);
const TOKEN_KEY = "gearshift_token";
const USER_KEY = "gearshift_user";
const DRIVER_TOKEN_KEY = "gearshift_driver_token";
const DRIVER_KEY = "gearshift_driver";
function readJSON(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
export function AuthProvider({
  children
}) {
  const [user, setUser] = useState(() => readJSON(USER_KEY));
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || null);
  const [driver, setDriver] = useState(() => readJSON(DRIVER_KEY));
  const [driverToken, setDriverToken] = useState(() => localStorage.getItem(DRIVER_TOKEN_KEY) || null);
  const [ready, setReady] = useState(false);
  window.__gearshift_token = token;
  window.__gearshift_driver_token = driverToken;
  useEffect(() => {
    if (!token) {
      setReady(true);
      return;
    }
    api.get("/me").then(res => {
      setUser(res.data);
      localStorage.setItem(USER_KEY, JSON.stringify(res.data));
    }).catch(() => {
      setUser(null);
      setToken(null);
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    }).finally(() => setReady(true));
  }, []);
  const login = useCallback((userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem(TOKEN_KEY, jwtToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    window.__gearshift_token = jwtToken;
  }, []);
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    window.__gearshift_token = null;
  }, []);
  const updateUser = useCallback(partial => {
    setUser(prev => {
      const next = prev ? {
        ...prev,
        ...partial
      } : prev;
      if (next) localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);
  const driverLogin = useCallback((driverData, jwtToken) => {
    setDriver(driverData);
    setDriverToken(jwtToken);
    localStorage.setItem(DRIVER_TOKEN_KEY, jwtToken);
    localStorage.setItem(DRIVER_KEY, JSON.stringify(driverData));
    window.__gearshift_driver_token = jwtToken;
  }, []);
  const driverLogout = useCallback(() => {
    setDriver(null);
    setDriverToken(null);
    localStorage.removeItem(DRIVER_TOKEN_KEY);
    localStorage.removeItem(DRIVER_KEY);
    window.__gearshift_driver_token = null;
  }, []);
  return <AuthContext.Provider value={{
    user,
    token,
    ready,
    login,
    logout,
    updateUser,
    driver,
    driverToken,
    driverLogin,
    driverLogout
  }}>
      {children}
    </AuthContext.Provider>;
}
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside <AuthProvider>");
  }
  return ctx;
}