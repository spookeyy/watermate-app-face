"use client"

import { useEffect } from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { StatusBar } from "expo-status-bar"
import Toast from "react-native-toast-message"
import * as Notifications from "expo-notifications"
import { useAuthStore } from "./src/store/authStore"
import AuthNavigator from "./src/navigation/AuthNavigator"
import MainNavigator from "./src/navigation/MainNavigator"
import { toastConfig } from "./src/utils/toastConfig"

const Stack = createStackNavigator()

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
})

export default function App() {
  const { isAuthenticated, initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [])

  return (
    <>
      <NavigationContainer>
        <StatusBar style="auto" />
        {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
      </NavigationContainer>
      <Toast config={toastConfig} />
    </>
  )
}
