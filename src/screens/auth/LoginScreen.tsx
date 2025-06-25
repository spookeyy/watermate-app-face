"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Toast from "react-native-toast-message"
import { useAuthStore } from "../../store/authStore"

export default function LoginScreen({ navigation }: any) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const { login, isLoading } = useAuthStore()

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Toast.show({
        type: "error",
        text1: "Invalid Phone Number",
        text2: "Please enter a valid phone number",
      })
      return
    }

    // Simulate OTP sending
    setOtpSent(true)
    Toast.show({
      type: "success",
      text1: "OTP Sent",
      text2: "Please check your SMS for the verification code",
    })
  }

  const handleLogin = async () => {
    if (!otp || otp.length < 4) {
      Toast.show({
        type: "error",
        text1: "Invalid OTP",
        text2: "Please enter the 6-digit OTP",
      })
      return
    }

    try {
      await login(phoneNumber, otp)
      Toast.show({
        type: "success",
        text1: "Welcome!",
        text2: "Login successful",
      })
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: "Please try again",
      })
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-8">
          <Ionicons name="water" size={80} color="#0ea5e9" />
          <Text className="text-3xl font-bold text-gray-800 mt-4">WaterMate</Text>
          <Text className="text-gray-600 mt-2">Your water delivery partner</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              editable={!otpSent}
            />
          </View>

          {otpSent && (
            <View>
              <Text className="text-gray-700 mb-2 font-medium">OTP Code</Text>
              <TextInput
                className="border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="numeric"
                maxLength={6}
              />
            </View>
          )}

          <TouchableOpacity
            className="bg-water-500 rounded-lg py-4 items-center"
            onPress={otpSent ? handleLogin : sendOTP}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">{otpSent ? "Verify & Login" : "Send OTP"}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity className="items-center py-4" onPress={() => navigation.navigate("SignUp")}>
            <Text className="text-water-600">
              Don't have an account? <Text className="font-semibold">Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
