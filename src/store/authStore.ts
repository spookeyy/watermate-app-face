import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  phoneNumber: string;
  addresses: Address[];
}

interface Address {
  id: string;
  residenceName: string;
  floorNumber: string;
  doorNumber: string;
  notes?: string;
  isDefault: boolean;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (phoneNumber: string, otp: string) => Promise<void>;
  signUp: (userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start with loading true

  login: async (phoneNumber: string, otp: string) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user: User = {
        id: "1",
        name: "Meshack Kataboi",
        phoneNumber,
        addresses: [],
      };

      await AsyncStorage.setItem("user", JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  signUp: async (userData: Partial<User>) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const user: User = {
        id: Date.now().toString(),
        name: userData.name || "",
        phoneNumber: userData.phoneNumber || "",
        addresses: [],
      };

      await AsyncStorage.setItem("user", JSON.stringify(user));
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await AsyncStorage.removeItem("user");
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      console.error("Error during logout:", error);
    }
  },

  initializeAuth: async () => {
    set({ isLoading: true });
    try {
      // Add a minimum delay to ensure splash screen shows properly
      const [userData] = await Promise.all([
        AsyncStorage.getItem("user"),
        new Promise((resolve) => setTimeout(resolve, 10000)), // Minimum 1 second delay
      ]);

      if (userData) {
        const user = JSON.parse(userData);
        set({ user, isAuthenticated: true, isLoading: false });
      } else {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } catch (error) {
      console.error("Error initializing auth:", error);
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  updateProfile: async (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({ isLoading: true });
      try {
        const updatedUser = { ...currentUser, ...userData };
        await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
        set({ user: updatedUser, isLoading: false });
      } catch (error) {
        set({ isLoading: false });
        console.error("Error updating profile:", error);
        throw error;
      }
    }
  },
}));
