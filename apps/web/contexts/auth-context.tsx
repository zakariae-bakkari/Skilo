'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, setAccessToken, onboardingApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isOnboarded: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setOnboarded: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate from localStorage on first load
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');

      if (!storedToken || !storedUser) {
        setIsLoading(false);
        return;
      }

      const parsed: User = JSON.parse(storedUser);
      setUser(parsed);
      setIsOnboarded(parsed.isOnboarded ?? false);
      
      // Sync memory token for API client immediately
      setAccessToken(storedToken);

      // Verify onboarding status with the backend ONLY once
      // We pass a skipExpiry: true flag (conceptually) or just handle failure quietly
      onboardingApi.status().then(res => {
        if (res.isOnboarded !== (parsed.isOnboarded ?? false)) {
          setIsOnboarded(res.isOnboarded);
          // Set cookie with expiration to match the token
          document.cookie = `onboarded=${res.isOnboarded}; path=/; max-age=604800; SameSite=Lax`;
          const updated = { ...parsed, isOnboarded: res.isOnboarded };
          localStorage.setItem('user', JSON.stringify(updated));
          setUser(updated);
        }
      }).catch(err => {
        // If it fails with 401 on boot, it's NOT an "expiration" event for the user
        // It's just a stale session. Clear it and move on.
        if (err.message.includes('401') || err.message.includes('Session expirée')) {
          logout();
        }
        console.error('Initial onboarding check failed:', err);
      });
    } catch {
      // Corrupted data — clean up
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = (access_token: string, loggedInUser: User) => {
    // 1. Sync memory token first
    setAccessToken(access_token);

    // 2. Set cookies immediately (Middleware needs these for next navigation)
    const onboardedStr = String(loggedInUser.isOnboarded ?? false);
    document.cookie = `access_token=${access_token}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `onboarded=${onboardedStr}; path=/; max-age=604800; SameSite=Lax`;

    // 3. Save to localStorage
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
    
    // 4. Update state
    setUser(loggedInUser);
    setIsOnboarded(loggedInUser.isOnboarded ?? false);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'onboarded=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    setUser(null);
    setIsOnboarded(false);
  };

  // Called after onboarding completes successfully
  const setOnboarded = () => {
    setIsOnboarded(true);
    document.cookie = 'onboarded=true; path=/; SameSite=Lax';
    if (user) {
      const updated = { ...user, isOnboarded: true };
      localStorage.setItem('user', JSON.stringify(updated));
      setUser(updated);
    }
  };

  // Listen for global session expiration events
  useEffect(() => {
    const handleExpired = () => {
      // If we are already on a public page, don't show the expired alert
      const isPublicPage = ['/login', '/register', '/'].includes(window.location.pathname);
      if (isPublicPage) {
        logout();
        return;
      }
      
      logout();
      window.location.href = '/login?expired=true';
    };
    window.addEventListener('skilo:session-expired', handleExpired);
    return () => window.removeEventListener('skilo:session-expired', handleExpired);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isOnboarded,
        isLoading,
        login,
        logout,
        setOnboarded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}