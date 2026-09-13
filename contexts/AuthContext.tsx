"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type User = {
  id: number;
  employeeId: string;
  name: string;
  email: string;
  phone: string | null;
  location: string | null;
  avatar: string | null;
  role: string;
  status: string;
  isActive: boolean;
  emailVerified: boolean;
  lastLogin: string | null;
  dateJoined: string;
  departmentId: number;
  teamId: number | null;
  organizationId?: number;

  language: "en" | "fr" | "ar";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
};

const AuthContext =
  createContext<
    AuthContextType | undefined
  >(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  async function refreshUser() {
    try {
      const response =
        await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          }
        );

      if (!response.ok) {
        setUser(null);
        return;
      }

      const data =
        await response.json();

      if (
        data.authenticated &&
        data.user
      ) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider."
    );
  }

  return context;
}