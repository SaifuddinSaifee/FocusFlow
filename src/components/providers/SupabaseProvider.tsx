"use client";

import { createContext, useContext, useState } from "react";
import { createClient } from "@/lib/supabase/client";

// Use ReturnType to infer the exact client type (avoids complex generic mismatch)
type SupabaseClientType = ReturnType<typeof createClient>;

type SupabaseContextType = {
  supabase: SupabaseClientType;
};

const Context = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createClient());

  return <Context.Provider value={{ supabase }}>{children}</Context.Provider>;
}

export function useSupabase(): SupabaseClientType {
  const context = useContext(Context);
  if (!context) throw new Error("useSupabase must be used within SupabaseProvider");
  return context.supabase;
}
