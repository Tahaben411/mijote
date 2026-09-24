import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { getCurrentUser, login as loginRequest } from '../services/api';
import type { AuthUser, LoginCredentials } from '../types/Auth';

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  ready: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const TOKEN_KEY = 'mijote-auth-token';
const USER_KEY = 'mijote-auth-user';
const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(readStoredUser);
  const [ready, setReady] = useState(false);

  const persist = useCallback((nextUser: AuthUser | null, nextToken: string | null) => {
    setUser(nextUser);
    setToken(nextToken);
    try {
      if (nextUser && nextToken) {
        localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
        localStorage.setItem(TOKEN_KEY, nextToken);
      } else {
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      // Le contexte continue en mémoire si le stockage local n'est pas disponible.
    }
  }, []);

  const logout = useCallback(() => persist(null, null), [persist]);

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const connectedUser = await loginRequest(credentials);
      persist(connectedUser, connectedUser.accessToken);
    },
    [persist]
  );

  useEffect(() => {
    let active = true;

    async function verifyStoredSession() {
      if (!token) {
        if (active) setReady(true);
        return;
      }

      try {
        const current = await getCurrentUser(token);
        if (active) {
          persist({ ...current, accessToken: token }, token);
        }
      } catch {
        if (active) logout();
      } finally {
        if (active) setReady(true);
      }
    }

    void verifyStoredSession();
    return () => {
      active = false;
    };
  }, [logout, persist, token]);

  const value = useMemo(
    () => ({ user, token, ready, login, logout }),
    [user, token, ready, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth doit être utilisé dans AuthProvider.');
  return value;
}
