import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, getMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]             = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Restore session on page reload
  useEffect(() => {
    getMe()
      .then((me) => {
        if (me) {
          const rawRole =
            me?.role || me?.data?.role || me?.user?.role ||
            me?.user_type || me?.type || me?.account_type;
          setUser({ ...me, role: String(rawRole || '').toUpperCase() });
        }
      })
      .catch(() => {})
      .finally(() => setAuthLoading(false));
  }, []);

  const login = async (username, password) => {
    try {
      const data = await apiLogin(username, password);
      console.log('Full login response:', JSON.stringify(data, null, 2));

      // Parse role from multiple possible response shapes
      const rawRole =
        data?.role        ||
        data?.user?.role  ||
        data?.data?.role  ||
        data?.user_type   ||
        data?.type        ||
        data?.account_type;

      const role = String(rawRole || '').toUpperCase();
      console.log('Parsed role:', role);

      // Immediately verify session by calling /api/auth/me
      let me = null;
      try {
        me = await getMe();
        console.log('/api/auth/me response:', JSON.stringify(me, null, 2));
      } catch (meErr) {
        if (meErr.message?.includes('401') || meErr.message?.includes('Authentication')) {
          return {
            success: false,
            error: 'Login succeeded, but backend session cookie was not saved or returned.',
          };
        }
      }

      if (!role) {
        return {
          success: false,
          error: `Login succeeded but role is missing or invalid. Full response: ${JSON.stringify(data)}`,
        };
      }

      const raw = data?.data ?? data?.user ?? data;
      const u   = { ...raw, role };
      setUser(u);
      return { success: true, role };
    } catch (err) {
      return { success: false, error: err.message || 'Invalid username or password.' };
    }
  };

  const logout = async () => {
    try { await apiLogout(); } catch (_) {}
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
