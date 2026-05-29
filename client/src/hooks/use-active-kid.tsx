import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./use-auth";
import type { Kid } from "@shared/schema";

interface ActiveKidContextType {
  activeKid: Kid | null;
  setActiveKidId: (kidId: string) => void;
  kids: Kid[];
}

const ActiveKidContext = createContext<ActiveKidContextType | null>(null);

export function ActiveKidProvider({ children }: { children: ReactNode }) {
  const { kids } = useAuth();
  const [activeKidId, setActiveKidId] = useState<string | null>(null);

  useEffect(() => {
    if (kids.length > 0 && (!activeKidId || !kids.find((k) => k.id === activeKidId))) {
      setActiveKidId(kids[0].id);
    }
    if (kids.length === 0) {
      setActiveKidId(null);
    }
  }, [kids, activeKidId]);

  const activeKid = kids.find((k) => k.id === activeKidId) ?? null;

  return (
    <ActiveKidContext.Provider value={{ activeKid, setActiveKidId, kids }}>
      {children}
    </ActiveKidContext.Provider>
  );
}

export function useActiveKid() {
  const context = useContext(ActiveKidContext);
  if (!context) {
    throw new Error("useActiveKid must be used within an ActiveKidProvider");
  }
  return context;
}
