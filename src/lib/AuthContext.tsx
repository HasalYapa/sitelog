import { onAuthStateChanged, signOut as firebaseSignOut, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, signInWithGoogle } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = () => {
    firebaseSignOut(auth).catch(console.error);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn: signInWithGoogle, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

