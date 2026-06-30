import React, { createContext, useContext, useEffect, useState } from 'react';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  
  // Academic
  college?: string;
  degree?: string;
  specialization?: string;
  currentYear?: string;
  graduationYear?: string;
  cgpa?: string;
  
  // Professional
  currentRole?: string;
  skills: string[];
  preferredRole?: string;
  experienceLevel?: string;
  certifications?: string;
  portfolio?: string;
  github?: string;
  linkedin?: string;
  
  // Resume
  resumeUrl?: string;
  
  // Job Preferences
  jobPreference?: string;
  preferredLocation?: string;
  workMode?: string;
  expectedStipend?: string;
  expectedSalary?: string;
  
  // AI Features
  careerGoal?: string;
  interestedDomains: string[];
  preferredIndustries: string[];
  
  // Metadata
  termsAccepted?: boolean;
  profileCompletion: number;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, pass: string) => Promise<void>;
  signup: (data: Partial<User> & { password?: string }) => Promise<void>;
  googleSignIn: () => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const API_URL = 'http://localhost:8081/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('careercompass_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const getAuthHeaders = () => {
    const token = localStorage.getItem('jwt_token');
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
  };

  const calculateCompletion = (data: Partial<User>): number => {
    let completedFields = 0;
    const requiredFields = [
      'college', 'degree', 'currentYear', 'graduationYear', 
      'preferredRole', 'jobPreference', 'phone', 'resumeUrl'
    ];
    
    requiredFields.forEach(field => {
      if (data[field as keyof User]) completedFields++;
    });

    if (data.skills && data.skills.length > 0) completedFields++;

    const totalFields = requiredFields.length + 1; // +1 for skills
    return Math.round((completedFields / totalFields) * 100);
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem('careercompass_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('careercompass_user');
    }
  }, [user]);

  // Fetch latest profile on mount if token exists
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      fetch(`${API_URL}/users/me`, { headers: getAuthHeaders() })
        .then(res => {
          if (res.ok) return res.json();
          throw new Error('Token invalid');
        })
        .then((data: User) => {
          if (data.termsAccepted || localStorage.getItem("onboarding_completed") === "true") {
            data.profileCompletion = 100;
          } else {
            data.profileCompletion = calculateCompletion(data);
          }
          setUser(data);
        })
        .catch(() => {
          logout();
        });
    }
  }, []);

  const login = async (email: string, pass: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Login failed');
    }

    const data = await response.json();
    localStorage.setItem('jwt_token', data.token);
    localStorage.setItem('onboarding_completed', 'true');
    
    const loggedInUser: User = data.user;
    loggedInUser.profileCompletion = 100;
    setUser(loggedInUser);
  };

  const signup = async (data: Partial<User> & { password?: string }) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: data.fullName,
        email: data.email,
        password: data.password || 'password123' // default if not provided
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Signup failed');
    }

    // Auto-login after signup
    if (data.email && data.password) {
      await login(data.email, data.password);
    }
  };

  const googleSignIn = async () => {
    // Mock google sign in for now until OAuth is setup
    await new Promise(resolve => setTimeout(resolve, 800));
    const newUser: User = {
      id: 'usr_google_' + Date.now(),
      fullName: 'Alex Developer',
      email: 'alex.dev@gmail.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      skills: [],
      interestedDomains: [],
      preferredIndustries: [],
      profileCompletion: 0,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('onboarding_completed', 'true');
    newUser.profileCompletion = 100;
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('onboarding_completed');
    localStorage.removeItem('user_role');
    localStorage.removeItem('admin_passkey_verified');
    setUser(null);
  };

  const updateProfile = async (data: Partial<User>) => {
    const response = await fetch(`${API_URL}/users/me`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const updatedUser: User = await response.json();
    
    if (updatedUser.termsAccepted) {
      updatedUser.profileCompletion = 100;
    } else {
      updatedUser.profileCompletion = calculateCompletion(updatedUser);
    }
    
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, googleSignIn, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
