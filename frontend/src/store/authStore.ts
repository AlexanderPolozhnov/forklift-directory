import { create } from 'zustand';

interface AuthState {
  token: string | null;
  fullName: string | null;
  setAuth: (token: string, fullName: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('token'),
  fullName: localStorage.getItem('fullName'),

  setAuth: (token: string, fullName: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('fullName', fullName);
    set({ token, fullName });
  },

  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('fullName');
    set({ token: null, fullName: null });
  },

  isAuthenticated: () => !!get().token,
}));
