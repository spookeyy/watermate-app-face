"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export default function OTPVerificationScreen({ route, navigation }: any) {
  const { phoneNumber } = route.params
  const [otp, setOtp] = useState("")
  const [timer, setTimer] = useState(60)

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-8">
          <Ionicons name="mail" size={80} color="#0ea5e9" />
          <Text className="text-2xl font-bold text-gray-800 mt-4">Verify Your Number</Text>
          <Text className="text-gray-600 mt-2 text-center">We've sent a verification code to {phoneNumber}</Text>
        </View>

        <View className="space-y-4">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-base text-center text-2xl"
            placeholder="Enter OTP"
            value={otp}
            onChangeText={setOtp}
            keyboardType="numeric"
            maxLength={6}
          />

          <TouchableOpacity className="bg-water-500 rounded-lg py-4 items-center">
            <Text className="text-white font-semibold text-lg">Verify</Text>
          </TouchableOpacity>

          <View className="items-center">
            {timer > 0 ? (
              <Text className="text-gray-600">Resend code in {timer}s</Text>
            ) : (
              <TouchableOpacity>
                <Text className="text-water-600 font-semibold">Resend Code</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
