import { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs
} from 'firebase/firestore';
import { auth, googleProvider, db } from '../services/firebase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [professorInfo, setProfessorInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Load & Auth Listener
  useEffect(() => {
    let mounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, fetch profile from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const profileData = userDoc.data();
            if (mounted) {
              setUser({ ...firebaseUser, ...profileData });
              setUserProfile(profileData);
            }
          } else {
            // Profile doesn't exist (e.g. first Google login), create default
            const newProfile = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
              type: 'student', // Default role
              photo: firebaseUser.photoURL,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, newProfile);
            if (mounted) {
              setUser({ ...firebaseUser, ...newProfile });
              setUserProfile(newProfile);
            }
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        // User is signed out
        if (mounted) {
          setUser(null);
          setUserProfile(null);
        }
      }
      if (mounted) setIsLoading(false);
    });

    // Load Professor Info / Settings
    const loadSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'general'));
        if (settingsDoc.exists() && mounted) {
          setProfessorInfo(settingsDoc.data());
        }
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    };
    loadSettings();

    // Ensure Admin Exists (Seeding functionality adapted for Cloud)
    // Note: In a real app we wouldn't auto-create admin on client like this, 
    // but preserving logic for continuity. Better to do manually in Console.

    return () => {
      mounted = false;
      unsubscribe();
    };
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { success: true };
    } catch (error) {
      let errorMessage = 'Erro ao fazer login';
      if (error.code === 'auth/wrong-password') errorMessage = 'Senha incorreta';
      if (error.code === 'auth/user-not-found') errorMessage = 'Usuário não encontrado';
      if (error.code === 'auth/invalid-credential') errorMessage = 'Credenciais inválidas';
      return { success: false, error: errorMessage };
    }
  };

  const register = async (name, email, password, userType = 'student') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, { displayName: name });

      // Create Profile in Firestore
      const newProfile = {
        uid: firebaseUser.uid,
        email: email,
        name: name,
        type: userType,
        createdAt: new Date().toISOString()
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);

      // State update handled by onAuthStateChanged
      return { success: true, user: { ...firebaseUser, ...newProfile } };
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar';
      if (error.code === 'auth/email-already-in-use') errorMessage = 'E-mail já cadastrado';
      return { success: false, error: errorMessage };
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      // Profile creation handled in onAuthStateChanged
      return { success: true };
    } catch (error) {
      console.error("Google login error:", error);
      return { success: false, error: 'Erro ao entrar com Google' };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateProfessorInfo = async (info) => {
    try {
      await setDoc(doc(db, 'settings', 'general'), info, { merge: true });
      setProfessorInfo(info);
    } catch (error) {
      console.error("Error updating settings:", error);
    }
  };

  const updateUserProfile = async (updates) => {
    if (!user) return;
    try {
      await updateDoc(doc(db, 'users', user.uid), updates);
      // Local state updates automatically via listener if we had one, 
      // but for now we manually update to reflect instant change
      setUser(prev => ({ ...prev, ...updates }));
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const getAllStudents = async () => {
    try {
      const q = query(collection(db, 'users'), where('type', '==', 'student'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching students:", error);
      return [];
    }
  };

  const resetUserPassword = async (email) => {
    // Firebase Client SDK cannot reset password directly for security.
    // It sends a password reset email.
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true, message: 'E-mail de redefinição enviado!' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    professorInfo,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.type === 'admin' || user?.email === 'israel.mendes97@hotmail.com', // Force admin for specific email
    isStudent: user?.type === 'student' && user?.email !== 'israel.mendes97@hotmail.com',
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfessorInfo,
    updateUserProfile,
    getAllStudents,
    resetUserPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
