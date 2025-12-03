// src/context/AuthContext.js
// Authentication context provider

import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import api from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Listen to Firebase auth state
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get Firebase token
          const idToken = await firebaseUser.getIdToken();
          
          // Set token in API service
          api.setAuthToken(idToken);
          
          // Get user data from our backend
          const response = await api.get('/auth/me');
          
          setUser(response.data.user);
          setToken(idToken);
          
          // Store token
          await AsyncStorage.setItem('userToken', idToken);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
          setToken(null);
        }
      } else {
        setUser(null);
        setToken(null);
        await AsyncStorage.removeItem('userToken');
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    try {
      const { signInWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      api.setAuthToken(idToken);
      
      const response = await api.post('/auth/login', { idToken });
      setUser(response.data.user);
      setToken(idToken);
      
      await AsyncStorage.setItem('userToken', idToken);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const register = async (email, password, name, defaultLocation) => {
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(userCredential.user, { displayName: name });
      
      const idToken = await userCredential.user.getIdToken();
      api.setAuthToken(idToken);
      
      const response = await api.post('/auth/register', {
        email,
        name,
        defaultLocation
      });
      
      setUser(response.data.user);
      setToken(idToken);
      
      await AsyncStorage.setItem('userToken', idToken);
      
      return { success: true };
    } catch (error) {
      console.error('Register error:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('userToken');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const deleteAccount = async () => {
    try {
      await api.delete('/auth/delete-account');
      await auth.currentUser?.delete();
      await AsyncStorage.removeItem('userToken');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    deleteAccount
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

