"use client";

import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

// The User interface should match the data structure of your user model.
interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'owner';
  profilePhotoUrl?: string;
  bio?: string;
  phone?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  setUser: (user: User | null) => void; // This allows us to update the user from other components
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // On initial load, fetch the user's session data from the server.
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/auth/me'); // An endpoint that returns the current user
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };
 
  const logout = async () => {
    try {
        await fetch('/api/auth/logout', { method: 'POST' });
        setUser(null);
        // Replaced router.push with window.location.href to avoid Next.js module resolution issues.
        // This causes a full page reload, effectively redirecting and refreshing the page state.
        window.location.href = '/';
    } catch (error) {
        console.error('Failed to log out', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, logout , setUser}}>
      {/* Don't render children until the initial user fetch is complete */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook to easily access the authentication context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

