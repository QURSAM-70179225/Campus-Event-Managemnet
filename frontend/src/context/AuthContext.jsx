/**
 * Authentication state shared by the whole app.
 * Usage: const { user, login, signup, logout } = useAuth();
 */
import { createContext, useContext, useEffect, useState } from 'react';
import { api, tokenStore } from '../services/api.js';

const AuthContext = createContext(null);
const USER_KEY = 'campus_user';

function loadStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => (tokenStore.get() ? loadStoredUser() : null));
  const [checking, setChecking] = useState(Boolean(tokenStore.get()));

  // On page load, confirm the saved token is still valid
  useEffect(() => {
    if (!tokenStore.get()) return;
    api
      .me()
      .then(({ user }) => saveSession(null, user))
      .catch(() => logout())
      .finally(() => setChecking(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function saveSession(token, userData) {
    if (token) tokenStore.set(token);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    setUser(userData);
  }

  async function login(email, password) {
    const { token, user } = await api.login(email, password);
    saveSession(token, user);
    return user;
  }

  async function signup(name, email, password) {
    const { token, user } = await api.signup(name, email, password);
    saveSession(token, user);
    return user;
  }

  function logout() {
    tokenStore.clear();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, checking, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
