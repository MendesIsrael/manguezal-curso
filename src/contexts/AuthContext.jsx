import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { storage } from '../utils/storage';

const AuthContext = createContext(null);

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'current_user';
const SETTINGS_KEY = 'settings';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [professorInfo, setProfessorInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load current user and settings on mount
  useEffect(() => {
    const storedUser = storage.get(CURRENT_USER_KEY);
    const storedSettings = storage.get(SETTINGS_KEY);

    if (storedUser) {
      setUser(storedUser);
    }

    if (storedSettings) {
      setProfessorInfo(storedSettings);
    }

    setIsLoading(false);
  }, []);

  // Get all users from storage
  const getUsers = () => {
    return storage.get(USERS_KEY) || [];
  };

  // Save users to storage
  const saveUsers = (users) => {
    storage.set(USERS_KEY, users);
  };

  const login = (email, password, userType) => {
    const users = getUsers();
    const foundUser = users.find(
      u => u.email === email && u.type === userType
    );

    if (foundUser) {
      // In a real app, verify password here
      setUser(foundUser);
      storage.set(CURRENT_USER_KEY, foundUser);
      return { success: true, user: foundUser };
    }

    // For demo purposes, create user if not found (simulated login)
    const newUser = {
      id: uuidv4(),
      email,
      name: userType === 'admin' ? 'Administrador' : email.split('@')[0],
      type: userType,
      createdAt: new Date().toISOString()
    };

    saveUsers([...users, newUser]);
    setUser(newUser);
    storage.set(CURRENT_USER_KEY, newUser);

    return { success: true, user: newUser };
  };

  const register = (name, email, password, userType = 'student') => {
    const users = getUsers();

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'E-mail já cadastrado' };
    }

    const newUser = {
      id: uuidv4(),
      email,
      name,
      type: userType,
      createdAt: new Date().toISOString()
    };

    saveUsers([...users, newUser]);
    setUser(newUser);
    storage.set(CURRENT_USER_KEY, newUser);

    return { success: true, user: newUser };
  };

  const loginWithGoogle = () => {
    const googleUser = {
      id: 'google-' + uuidv4(),
      email: 'user@gmail.com',
      name: 'Usuário Google',
      type: 'student',
      provider: 'google',
      createdAt: new Date().toISOString()
    };

    const users = getUsers();
    const existingGoogleUser = users.find(u => u.provider === 'google');

    if (existingGoogleUser) {
      setUser(existingGoogleUser);
      storage.set(CURRENT_USER_KEY, existingGoogleUser);
      return { success: true, user: existingGoogleUser };
    }

    saveUsers([...users, googleUser]);
    setUser(googleUser);
    storage.set(CURRENT_USER_KEY, googleUser);

    return { success: true, user: googleUser };
  };

  const logout = () => {
    setUser(null);
    storage.remove(CURRENT_USER_KEY);
  };

  const updateProfessorInfo = (info) => {
    setProfessorInfo(info);
    storage.set(SETTINGS_KEY, info);
  };

  const updateUserProfile = (updates) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    storage.set(CURRENT_USER_KEY, updatedUser);

    const users = getUsers();
    const updatedUsers = users.map(u =>
      u.id === user.id ? updatedUser : u
    );
    saveUsers(updatedUsers);
  };

  const getAllStudents = () => {
    return getUsers().filter(u => u.type === 'student');
  };

  const value = {
    user,
    professorInfo,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.type === 'admin',
    isStudent: user?.type === 'student',
    login,
    register,
    loginWithGoogle,
    logout,
    updateProfessorInfo,
    updateUserProfile,
    getAllStudents,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
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
