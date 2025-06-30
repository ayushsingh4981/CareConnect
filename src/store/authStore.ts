
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserRole = 'user' | 'nurse' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

// Mock authentication functions
const mockLogin = async (email: string, password: string): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock user data based on email
  const mockUsers: Record<string, User> = {
    'user@test.com': { id: '1', email, name: 'John Doe', role: 'user' },
    'nurse@test.com': { id: '2', email, name: 'Jane Smith', role: 'nurse' },
    'admin@test.com': { id: '3', email, name: 'Admin User', role: 'admin' }
  };
  
  const user = mockUsers[email];
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  return user;
};

const mockSignup = async (email: string, password: string, name: string, role: UserRole): Promise<User> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    id: Math.random().toString(36).substr(2, 9),
    email,
    name,
    role
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      
      login: async (email: string, password: string) => {
        set({ isLoading: true });
        try {
          const user = await mockLogin(email, password);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      signup: async (email: string, password: string, name: string, role: UserRole) => {
        set({ isLoading: true });
        try {
          const user = await mockSignup(email, password, name, role);
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      }
    }),
    {
      name: 'auth-storage',
    }
  )
);
