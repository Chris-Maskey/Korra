"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from "react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { Tables } from "@/database.types";

// Define the Profile type based on your "profiles" table schema
type Profile = Tables<"profiles">;

// Combined user type for auth and profile data
type AppUser = {
  auth: User;
  profile: Profile;
};

// Context type
type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  error: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = createClient();
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch both auth user and profile data
  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch authenticated user
      const {
        data: { user: authUser },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError) {
        setError(authError.message);
        setUser(null);
        return;
      }

      if (authUser) {
        // Fetch profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authUser.id)
          .single();

        if (profileError) {
          setError(profileError.message);
          setUser(null);
        } else {
          setUser({ auth: authUser, profile });
          setError(null);
        }
      } else {
        setUser(null);
        setError(null);
      }
    } catch (err) {
      setError(`An unexpected error occurred: ${err}`);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  // Fetch initial user state on mount
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Listen for authentication state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(event);
      if (event === "SIGNED_IN" && session) {
        fetchUser();
        setError(null);
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        console.log(user);
        setError(null);
      } else if (
        (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") &&
        session
      ) {
        fetchUser();
        setError(null);
      } else {
        console.warn("Unhandled auth event:", event);
      }
    });
    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, fetchUser, user]);

  // Memoize context values
  const values = useMemo(
    () => ({
      user,
      loading,
      error,
    }),
    [user, loading, error],
  );

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
