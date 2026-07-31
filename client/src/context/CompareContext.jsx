import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
const CompareContext = createContext(null);
const MAX_COMPARE = 3;

// Compare lists are namespaced per signed-in identity so that switching
// accounts on the same browser (or logging out to a guest session) never
// leaks another person's comparison into view.
function storageKeyFor(user, driver) {
  if (user) return `gearshift_compare_u${user.id}`;
  if (driver) return `gearshift_compare_d${driver.id}`;
  return "gearshift_compare_guest";
}

function readIds(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function CompareProvider({
  children
}) {
  const { user, driver } = useAuth();
  const key = storageKeyFor(user, driver);
  const [activeKey, setActiveKey] = useState(key);
  const [compareIds, setCompareIds] = useState(() => readIds(key));

  useEffect(() => {
    if (key !== activeKey) {
      setActiveKey(key);
      setCompareIds(readIds(key));
    }
  }, [key, activeKey]);

  useEffect(() => {
    if (key === activeKey) {
      localStorage.setItem(activeKey, JSON.stringify(compareIds));
    }
  }, [compareIds, activeKey, key]);

  function toggleCompare(id) {
    setCompareIds(prev => prev.includes(id) ? prev.filter(v => v !== id) : prev.length >= MAX_COMPARE ? prev : [...prev, id]);
  }
  function removeFromCompare(id) {
    setCompareIds(prev => prev.filter(v => v !== id));
  }
  function clearCompare() {
    setCompareIds([]);
  }
  return <CompareContext.Provider value={{
    compareIds,
    toggleCompare,
    removeFromCompare,
    clearCompare,
    maxCompare: MAX_COMPARE
  }}>
      {children}
    </CompareContext.Provider>;
}
export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
