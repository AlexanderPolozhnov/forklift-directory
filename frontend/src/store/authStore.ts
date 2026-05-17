import { create } from 'zustand';

interface AuthState {
  token: string | null;
  fullName: string | null;
  setAuth: (token: string, fullName: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
}

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return true;
    
    // Convert base64url to base64
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window.atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const decodedPayload = JSON.parse(jsonPayload);
    const exp = decodedPayload.exp;
    if (exp) {
      return Date.now() >= exp * 1000;
    }
  } catch (e) {
    return true;
  }
  return false;
};

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

  isAuthenticated: () => {
    const token = get().token;
    return !!token && !isTokenExpired(token);
  },
}));
