import { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../mock/users';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('mock_user');
    if (saved) setUser(JSON.parse(saved));
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (!found) throw new Error('Invalid credentials');
    const { password: _, ...safe } = found;
    localStorage.setItem('mock_user', JSON.stringify(safe));
    setUser(safe);
    return safe;
  };

  const register = async (name, email, password, role) => {
    const exists = USERS.find(u => u.email === email);
    if (exists) throw new Error('Email already exists');
    const newUser = { id: Date.now(), name, email, role: role || 'citizen', avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`, bio: '', github_username: null, solved_count: 0 };
    USERS.push({ ...newUser, password });
    localStorage.setItem('mock_user', JSON.stringify(newUser));
    setUser(newUser);
    return newUser;
  };

  const logout = () => { localStorage.removeItem('mock_user'); setUser(null); };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
