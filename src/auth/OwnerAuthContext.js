import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import { apiBaseUrl } from "../config/api";

const OwnerAuthContext = createContext(null);

export function OwnerAuthProvider({
  children,
  clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "",
}) {
  const [session, setSession] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [error, setError] = useState("");
  const sessionRef = useRef(null);
  const attemptRef = useRef(0);
  const mountedRef = useRef(true);
  const isConfigured = Boolean(clientId.trim());

  useEffect(() => {
    mountedRef.current = true;
    attemptRef.current += 1;
    sessionRef.current = null;
    setSession(null);
    setIsChecking(false);
    setError("");
    return () => {
      mountedRef.current = false;
      attemptRef.current += 1;
      sessionRef.current = null;
    };
  }, [clientId]);

  const invalidateSession = useCallback((message = "") => {
    attemptRef.current += 1;
    sessionRef.current = null;
    if (mountedRef.current) {
      setSession(null);
      setIsChecking(false);
      setError(message);
    }
  }, []);

  const signOut = useCallback(() => {
    invalidateSession();
    // This only disables automatic selection; app authorization is cleared above.
    window.google?.accounts?.id?.disableAutoSelect();
  }, [invalidateSession]);

  const signIn = useCallback(
    async (credential) => {
      if (!mountedRef.current) return false;
      const attempt = ++attemptRef.current;
      sessionRef.current = null;
      setSession(null);
      setError("");

      if (!isConfigured || typeof credential !== "string" || !credential) {
        setIsChecking(false);
        setError("Owner sign-in is unavailable. Please try again later.");
        return false;
      }

      setIsChecking(true);
      try {
        // Only the API decides who may edit. The browser never keeps an allowlist.
        const { data } = await axios.get(`${apiBaseUrl}/auth/session`, {
          headers: { Authorization: `Bearer ${credential}` },
        });
        if (!mountedRef.current || attempt !== attemptRef.current) return false;

        const expiresAt = data?.expiresAt * 1000;
        if (
          data?.canEdit !== true ||
          !Number.isFinite(expiresAt) ||
          expiresAt <= Date.now()
        ) {
          setError("Editing access could not be verified. Please sign in again.");
          return false;
        }

        // Keep the credential in memory only, never in browser storage or URLs.
        const verifiedSession = { token: credential, expiresAt };
        sessionRef.current = verifiedSession;
        setSession(verifiedSession);
        return true;
      } catch (requestError) {
        if (!mountedRef.current || attempt !== attemptRef.current) return false;
        setError(
          requestError.response?.status === 403
            ? "This account does not have editing access."
            : "We couldn't verify editing access. Please sign in again.",
        );
        return false;
      } finally {
        if (mountedRef.current && attempt === attemptRef.current) {
          setIsChecking(false);
        }
      }
    },
    [isConfigured],
  );

  useEffect(() => {
    if (!session) return undefined;
    const timer = window.setTimeout(
      () => invalidateSession("Your editing session expired. Please sign in again."),
      Math.max(0, session.expiresAt - Date.now()),
    );
    return () => window.clearTimeout(timer);
  }, [session, invalidateSession]);

  const getRequestConfig = useCallback(() => {
    const currentSession = sessionRef.current;
    if (!currentSession || currentSession.expiresAt <= Date.now()) {
      throw new Error("Sign in as the owner before changing methods.");
    }
    return { headers: { Authorization: `Bearer ${currentSession.token}` } };
  }, []);

  const canEdit = Boolean(session && session.expiresAt > Date.now());
  const value = useMemo(
    () => ({
      canEdit,
      isChecking,
      error,
      token: canEdit ? session.token : null,
      clientId,
      isConfigured,
      signIn,
      signOut,
      getRequestConfig,
      invalidateSession,
    }),
    [
      canEdit,
      isChecking,
      error,
      session,
      clientId,
      isConfigured,
      signIn,
      signOut,
      getRequestConfig,
      invalidateSession,
    ],
  );

  return <OwnerAuthContext.Provider value={value}>{children}</OwnerAuthContext.Provider>;
}

export function useOwnerAuth() {
  const context = useContext(OwnerAuthContext);
  if (!context) {
    throw new Error("useOwnerAuth must be used within OwnerAuthProvider.");
  }
  return context;
}
