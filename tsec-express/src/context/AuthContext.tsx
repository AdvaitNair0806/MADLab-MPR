"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthUser {
  uid: string;
  email: string | null;
}

interface AuthContextType {
  user: AuthUser | null;
  userRole: string | null;
  loading: boolean;
  mockLogin: (email: string, role: string) => void;
  mockLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  loading: true,
  mockLogin: () => {},
  mockLogout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("placeholder_user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser({ uid: "placeholder-uid", email: parsed.email });
      setUserRole(parsed.role);
    }
    setLoading(false);
  }, []);

  const mockLogin = (email: string, role: string) => {
    setUser({ uid: "placeholder-uid", email });
    setUserRole(role);
    localStorage.setItem("placeholder_user", JSON.stringify({ email, role }));
  };

  const mockLogout = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem("placeholder_user");
  };

  return (
    <AuthContext.Provider value={{ user, userRole, loading, mockLogin, mockLogout }}>
      {children}
    </AuthContext.Provider>
  );
};
