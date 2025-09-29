"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'owner';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User) => void; // ✨ 1. Add login function to the type
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);
   // ✨ 2. Create the login function
  const login = (userData: User) => {
    setUser(userData);
  };
  
  const logout = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        router.push('/');
        router.refresh(); // Clears cache and re-fetches server components
    } catch (error) {
        console.error('Failed to log out', error);
    }
  };

  return (
    // ✨ 3. Provide the login function through the context
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to use the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}