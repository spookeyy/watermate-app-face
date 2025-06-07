"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Toast from "react-native-toast-message"

export default function PaymentScreen({ route, navigation }: any) {
  const { orderId, amount, paymentMethod } = route.params
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const handleMpesaPayment = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      Toast.show({
        type: "error",
        text1: "Invalid Phone Number",
        text2: "Please enter a valid M-PESA phone number",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate M-PESA STK push
      await new Promise((resolve) => setTimeout(resolve, 3000))

      Toast.show({
        type: "success",
        text1: "Payment Successful!",
        text2: "Your order has been confirmed",
      })

      navigation.navigate("OrderDetails", { orderId })
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Payment Failed",
        text2: "Please try again",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCashPayment = () => {
    Toast.show({
      type: "success",
      text1: "Order Confirmed!",
      text2: "Please have cash ready for delivery",
    })

    navigation.navigate("OrderDetails", { orderId })
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Payment</Text>

        {/* Order Summary */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Order Summary</Text>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-600">Order ID</Text>
            <Text className="font-semibold text-gray-800">#{orderId.slice(-6)}</Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text className="text-gray-600">Total Amount</Text>
            <Text className="text-2xl font-bold text-water-600">KSh {amount}</Text>
          </View>
        </View>

        {paymentMethod === "mpesa" ? (
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Ionicons name="card" size={24} color="#0ea5e9" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">M-PESA Payment</Text>
            </View>

            <Text className="text-gray-600 mb-3">Enter your M-PESA phone number to receive the payment prompt</Text>

            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 mb-4"
              placeholder="M-PESA Phone Number (e.g., 254712345678)"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <TouchableOpacity
              className="bg-green-600 rounded-lg py-4 items-center"
              onPress={handleMpesaPayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <View className="flex-row items-center">
                  <ActivityIndicator color="white" size="small" />
                  <Text className="text-white font-semibold text-lg ml-2">Processing...</Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-lg">Pay with M-PESA</Text>
              )}
            </TouchableOpacity>

            {isProcessing && (
              <Text className="text-center text-gray-600 mt-3">Please check your phone for the M-PESA prompt</Text>
            )}
          </View>
        ) : (
          <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
            <View className="flex-row items-center mb-4">
              <Ionicons name="cash" size={24} color="#0ea5e9" />
              <Text className="text-lg font-semibold text-gray-800 ml-2">Cash on Delivery</Text>
            </View>

            <Text className="text-gray-600 mb-4">You will pay KSh {amount} in cash when your water is delivered.</Text>

            <View className="bg-yellow-50 p-3 rounded-lg mb-4">
              <Text className="text-yellow-800 text-sm">
                💡 Please have the exact amount ready for a smooth delivery experience.
              </Text>
            </View>

            <TouchableOpacity className="bg-water-500 rounded-lg py-4 items-center" onPress={handleCashPayment}>
              <Text className="text-white font-semibold text-lg">Confirm Order</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Payment Security Info */}
        <View className="bg-blue-50 p-4 rounded-xl">
          <View className="flex-row items-center mb-2">
            <Ionicons name="shield-checkmark" size={20} color="#2563eb" />
            <Text className="text-blue-800 font-medium ml-2">Secure Payment</Text>
          </View>
          <Text className="text-blue-700 text-sm">
            Your payment information is encrypted and secure. We never store your payment details.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  )
}
