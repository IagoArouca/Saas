import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  role: 'DEV' | 'RECRUITER' | 'CONTENT_CREATOR';
  username?: string;
  avatar?: string;
  fullName?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  hasUnreadMessages: boolean;
  setHasUnreadMessages: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hasUnreadMessages: false,

      setAuth: (user: User, token: string) => 
        set({ user, token }),

      logout: () => 
        set({ user: null, token: null, hasUnreadMessages: false }),

      setHasUnreadMessages: (value: boolean) => 
        set({ hasUnreadMessages: value }),
    }),
    {
      name: 'mochila-auth-storage', 
    }
  )
);