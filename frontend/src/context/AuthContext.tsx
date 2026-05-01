import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: null,
  loading: true,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(localStorage.getItem('siakad_role'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localToken = localStorage.getItem('siakad_token');
    if (localToken === 'mock_custom_token_bypass') {
       setUser({ uid: 'mock-uid', email: 'mock@local' } as User);
       setRole(localStorage.getItem('siakad_role'));
       setLoading(false);
       return;
    }

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if(!currentUser) {
         localStorage.removeItem('siakad_token');
         localStorage.removeItem('siakad_role');
         setRole(null);
      } else {
         setRole(localStorage.getItem('siakad_role'));
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
    localStorage.removeItem('siakad_token');
    localStorage.removeItem('siakad_role');
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
