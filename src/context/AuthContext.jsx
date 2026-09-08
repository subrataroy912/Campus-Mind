import { createContext, useContext, useMemo } from "react";
import { useState } from "react";
import {
  login as loginRequest,
  register as registerRequest,
  updateProfile as updateProfileRequest,
  deleteAccount as deleteAccountRequest,
} from "../features/auth/api/authService";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useDispatch } from "react-redux";
import { clearCredentials, setCredentials } from "../features/auth/authSlice.js";

const AuthContext = createContext(null);
const SESSION_KEY = "campus-mind.session";

export function AuthProvider({ children }) {
  const [user, setUser] = useLocalStorage(SESSION_KEY, null);
  const dispatch = useDispatch();
  const [authState, setAuthState] = useState({ status: "idle", error: null });
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      authStatus: authState.status,
      authError: authState.error,
      clearAuthError() {
        setAuthState((current) => ({ ...current, error: null }));
      },
      completeOAuth({ accessToken, refreshToken, user: nextUser, errorMessage }) {
        if (errorMessage) {
          const error = new Error(errorMessage);
          setAuthState({ status: "failed", error });
          throw error;
        }
        if (!accessToken || !nextUser) {
          const error = new Error("The social sign-in response was incomplete.");
          setAuthState({ status: "failed", error });
          throw error;
        }
        setUser({ ...nextUser, accessToken, refreshToken });
        dispatch(setCredentials({ accessToken, refreshToken, user: nextUser }));
        setAuthState({ status: "succeeded", error: null });
        return nextUser;
      },
      async login(credentials) {
        setAuthState({ status: "loading", error: null });
        try {
          const response = await loginRequest(credentials);
          const { accessToken, refreshToken, user: nextUser } = response;
          setUser({ ...nextUser, accessToken, refreshToken });
          dispatch(setCredentials({ accessToken, refreshToken, user: nextUser }));
          setAuthState({ status: "succeeded", error: null });
          return nextUser;
        } catch (error) {
          setAuthState({ status: "failed", error });
          throw error;
        }
      },
      async register(details) {
        setAuthState({ status: "loading", error: null });
        try {
          const result = await registerRequest(details);
          if (result.accessToken && result.user) {
            setUser({ ...result.user, accessToken: result.accessToken, refreshToken: result.refreshToken });
            dispatch(setCredentials(result));
          }
          setAuthState({ status: "succeeded", error: null });
          return result;
        } catch (error) {
          setAuthState({ status: "failed", error });
          throw error;
        }
      },
      async updateProfile(details) {
        const nextUser = await updateProfileRequest(user?.id, details);
        setUser(nextUser);
        return nextUser;
      },
      async deleteAccount() {
        if (user?.id) await deleteAccountRequest(user.id);
        setUser(null);
        dispatch(clearCredentials());
      },
      logout() {
        setUser(null);
        dispatch(clearCredentials());
      },
    }),
    [authState, dispatch, user, setUser],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
