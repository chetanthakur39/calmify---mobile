import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api, clearToken, getToken, saveToken } from "./api";

type AuthState = {
  loading: boolean;
  signedIn: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setSignedIn(!!(await getToken()));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { token } = await api.login(email, password);
    await saveToken(token);
    setSignedIn(true);
  }, []);

  const signUp = useCallback(async (name: string, email: string, password: string) => {
    const { token } = await api.register(name, email, password);
    await saveToken(token);
    setSignedIn(true);
  }, []);

  const signOut = useCallback(async () => {
    await clearToken();
    setSignedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ loading, signedIn, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
