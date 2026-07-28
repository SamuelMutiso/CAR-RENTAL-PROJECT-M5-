import { createContext, useContext, useEffect, useState } from "react";
const CompareContext = createContext(null);
const COMPARE_KEY = "gearshift_compare";
const MAX_COMPARE = 3;
function readIds() {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
export function CompareProvider({
  children
}) {
  const [compareIds, setCompareIds] = useState(readIds);
  useEffect(() => {
    localStorage.setItem(COMPARE_KEY, JSON.stringify(compareIds));
  }, [compareIds]);
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