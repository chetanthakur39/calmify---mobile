import React, { createContext, useContext, useEffect, useState } from "react";
import { clearToken, getToken, saveToken, api } from "./api";

type User = { id: number; name: string; email: string };

type AuthContextType = {
  signedIn: boolean;
  loading: boolean;
  user: User | null;
  signIn: (token: string, userData: User) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  signedIn: false,
  loading: true,
  user: null,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (token) {
          const res = await api.getMe();
          setUser(res.user);
          setSignedIn(true);
        }
      } catch {
        await clearToken();
        setSignedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signIn = async (token: string, userData: User) => {
    await saveToken(token);
    setUser(userData);
    setSignedIn(true);
  };

  const signOut = async () => {
    await clearToken();
    setUser(null);
    setSignedIn(false);
  };

  return (
    <AuthContext.Provider value={{ signedIn, loading, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
