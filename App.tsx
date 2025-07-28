import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import Toast from "react-native-toast-message";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useAuthStore } from "./src/store/authStore";
import AuthNavigator from "./src/navigation/AuthNavigator";
import MainNavigator from "./src/navigation/MainNavigator";
import SplashScreenComponent from "./src/screens/auth/SplashScreen";
import { toastConfig } from "./src/utils/toastConfig";
import "./global.css";

const Stack = createStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function App() {
  const { isAuthenticated, initializeAuth, isLoading } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);

  useEffect(() => {
    initializeAuthAndHideSplash();
  }, []);

  const initializeAuthAndHideSplash = async () => {
    try {
      // Initialize authentication state
      await initializeAuth();
      setAuthInitialized(true);

      // Hide the expo splash screen
      await SplashScreen.hideAsync();
    } catch (error) {
      console.error("Error during app initialization:", error);
      await SplashScreen.hideAsync();
      setAuthInitialized(true);
    }
  };

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  // Show our custom splash screen while auth is being initialized or during splash animation
  if (!authInitialized || showSplash) {
    return <SplashScreenComponent onFinish={handleSplashFinish} />;
  }

  return (
    <>
      <NavigationContainer>
        <StatusBar style="auto" />
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  );
}
