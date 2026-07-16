import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase.js";

/** Session admin (role tunggal). Dipakai RequireAuth + AdminLayout. */
export function useAuth() {
  const [session, setSession] = useState(undefined); // undefined = loading, null = logged out

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return { session, isLoading: session === undefined, isAuthenticated: !!session };
}
