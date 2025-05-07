import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, username: string, email: string, password: string) => Promise<boolean>;
  passwordReset: (email: string) => Promise<boolean>;
  passwordResetConfirm: (uid: string, token: string, newPassword1: string, newPassword2: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/authentication/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    // Call logout API
    if (token) {
      fetch('http://localhost:8000/authentication/api/logout/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(error => console.error('Error during logout:', error));
    }

    // Clear auth state
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/sign-in');
  };

  const register = async (name: string, username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/authentication/api/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, username, email, password }),
      });

      return response.ok;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const passwordReset = async (email: string): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/authentication/api/password-reset/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      return response.ok;
    } catch (error) {
      console.error('Password reset error:', error);
      return false;
    }
  };

  const passwordResetConfirm = async (
    uid: string, 
    token: string, 
    newPassword1: string, 
    newPassword2: string
  ): Promise<boolean> => {
    try {
      const response = await fetch('http://localhost:8000/authentication/api/password-reset-confirm/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          token,
          new_password1: newPassword1,
          new_password2: newPassword2
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('Password reset confirm error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        token, 
        isAuthenticated: !!user, 
        loading,
        login, 
        logout, 
        register,
        passwordReset,
        passwordResetConfirm
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};