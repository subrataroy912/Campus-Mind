import { createContext, useContext, useMemo } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  deleteAccount as deleteAccountRequest,
} from "../features/auth/api/authService";
import { useLocalStorage } from "../hooks/useLocalStorage";

const AuthContext = createContext(null);
const SESSION_KEY = "campus-mind.session";

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(SESSION_KEY, null);
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      async login(credentials) {
        const nextUser = await loginRequest(credentials);
        setUser(nextUser);
        return nextUser;
      },
      async register(details) {
        return registerRequest(details);
      },
      updateProfile(details) {
        setUser((currentUser) => ({ ...currentUser, ...details }));
      },
      async deleteAccount() {
        if (user?.id) await deleteAccountRequest(user.id);
        setUser(null);
      },
      logout() {
        setUser(null);
      },
    }),
    [user, setUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
