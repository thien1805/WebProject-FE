import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  login as loginAPI,
  logout as logoutAPI,
  getCurrrentUser as getCurrentUser, // 👈 đổi ở đây
  isAuthenticated,
} from '../api/authAPI';


const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = getCurrentUser();
                const authenticated = isAuthenticated();
                if (savedUser && authenticated) {
                    setUser(savedUser);
                    setIsAuth(true);
                } else {
                    setUser(null);
                    setIsAuth(false);
                }
            } catch (error) {
                console.error("Error loading user:", error);
                setUser(null);
                setIsAuth(false);
            } finally {
                setLoading(false);
            }
        };
        loadUser();

        const handleStorageChange = (e) => {
            if (e.key === 'user' || e.key === 'access_token'){
                loadUser();
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const data = await loginAPI(credentials);

            if (data && (data.success === true || data.tokens || data.user )) {
                const userData = data.user || getCurrentUser();
                setUser(userData);
                setIsAuth(true);
                return { success: true, user: userData };
            } 
            throw new Error (data?.message || 'Login failed');
        } catch (error) {
            setUser(null);
            setIsAuth(false);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            setLoading(true);
            await logoutAPI();
        } catch (error) { 
            console.error('Error logging out:', error);
        } finally {
            setUser(null);
            setIsAuth(false);
            setLoading(false);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
        if (userData) {
          localStorage.setItem('user', JSON.stringify(userData));
        }
      };

    
    const value = {
        user,
        isAuth,
        loading,
        login,
        logout,
        updateUser,
      };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};