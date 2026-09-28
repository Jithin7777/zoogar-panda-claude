import { useSessionStore } from '../stores/sessionStore';
import { AuthUser } from '../types/auth';

type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const setUser = (user: AuthUser) => useSessionStore.getState().setUser(user);

// Mock authentication only — no real backend/network call yet.
// Defined once so the actions keep a stable identity across renders.
const actions: AuthActions = {
  login: async (email) => {
    setUser({ name: email.split('@')[0], email });
  },
  signup: async (name, email) => {
    setUser({ name, email });
  },
  loginWithGoogle: async () => {
    setUser({ name: 'Google User', email: 'google.user@example.com' });
  },
  logout: async () => {
    useSessionStore.getState().clear();
  },
};

export function useAuth() {
  const user = useSessionStore((state) => state.user);
  return { user, ...actions };
}
