import { createStackNavigator } from "@react-navigation/stack"
import LoginScreen from "../screens/auth/LoginScreen"
import SignUpScreen from "../screens/auth/SignUpScreen"
import OTPVerificationScreen from "../screens/auth/OTPVerificationScreen"

const Stack = createStackNavigator()

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
    </Stack.Navigator>
  )
}
