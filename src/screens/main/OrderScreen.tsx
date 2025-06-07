"use client"

import { useState, useEffect } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as Location from "expo-location"
import Toast from "react-native-toast-message"
import { useOrderStore } from "../../store/orderStore"

export default function OrderScreen({ navigation }: any) {
  const [quantity, setQuantity] = useState("10")
  const [deliveryAddress, setDeliveryAddress] = useState({
    residenceName: "",
    floorNumber: "",
    doorNumber: "",
    notes: "",
  })
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "cash">("mpesa")
  const [location, setLocation] = useState<Location.LocationObject | null>(null)
  const { createOrder, isLoading } = useOrderStore()

  useEffect(() => {
    getCurrentLocation()
  }, [])

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Location Permission",
          text2: "Location access is needed for delivery",
        })
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setLocation(location)
    } catch (error) {
      console.error("Error getting location:", error)
    }
  }

  const calculateTotal = () => {
    const pricePerLiter = 5 // KSh 5 per liter
    return Number.parseInt(quantity) * pricePerLiter
  }

  const handleOrder = async () => {
    if (Number.parseInt(quantity) < 10) {
      Toast.show({
        type: "error",
        text1: "Minimum Order",
        text2: "Minimum delivery order is 10 liters",
      })
      return
    }

    if (!deliveryAddress.residenceName || !deliveryAddress.floorNumber || !deliveryAddress.doorNumber) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill in all delivery details",
      })
      return
    }

    try {
      await createOrder({
        quantity: Number.parseInt(quantity),
        deliveryAddress,
        paymentMethod,
        totalAmount: calculateTotal(),
      })

      Toast.show({
        type: "success",
        text1: "Order Placed!",
        text2: "Your water delivery order has been placed",
      })

      navigation.navigate("Payment", {
        orderId: Date.now().toString(),
        amount: calculateTotal(),
        paymentMethod,
      })
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2: "Please try again",
      })
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Place Your Order</Text>

        {/* Quantity Selection */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Water Quantity</Text>
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity
              className="bg-gray-100 p-3 rounded-lg"
              onPress={() => setQuantity(Math.max(10, Number.parseInt(quantity) - 5).toString())}
            >
              <Ionicons name="remove" size={20} color="#374151" />
            </TouchableOpacity>
            <TextInput
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-center text-lg font-semibold"
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
            />
            <Text className="text-gray-600 font-medium">Liters</Text>
            <TouchableOpacity
              className="bg-gray-100 p-3 rounded-lg"
              onPress={() => setQuantity((Number.parseInt(quantity) + 5).toString())}
            >
              <Ionicons name="add" size={20} color="#374151" />
            </TouchableOpacity>
          </View>
          {Number.parseInt(quantity) < 10 && (
            <Text className="text-red-500 text-sm mt-2">Minimum delivery order is 10 liters</Text>
          )}
        </View>

        {/* Delivery Address */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-semibold text-gray-800">Delivery Address</Text>
            <TouchableOpacity onPress={getCurrentLocation}>
              <Ionicons name="location" size={20} color="#0ea5e9" />
            </TouchableOpacity>
          </View>

          <View className="space-y-3">
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Residence Name (e.g., Falcon Court Apartment)"
              value={deliveryAddress.residenceName}
              onChangeText={(text) => setDeliveryAddress((prev) => ({ ...prev, residenceName: text }))}
            />
            <View className="flex-row space-x-3">
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Floor Number"
                value={deliveryAddress.floorNumber}
                onChangeText={(text) => setDeliveryAddress((prev) => ({ ...prev, floorNumber: text }))}
              />
              <TextInput
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3"
                placeholder="Door Number"
                value={deliveryAddress.doorNumber}
                onChangeText={(text) => setDeliveryAddress((prev) => ({ ...prev, doorNumber: text }))}
              />
            </View>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3"
              placeholder="Additional notes (optional)"
              value={deliveryAddress.notes}
              onChangeText={(text) => setDeliveryAddress((prev) => ({ ...prev, notes: text }))}
              multiline
              numberOfLines={3}
            />
          </View>
        </View>

        {/* Payment Method */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Payment Method</Text>
          <View className="space-y-3">
            <TouchableOpacity
              className={`flex-row items-center p-3 rounded-lg border ${
                paymentMethod === "mpesa" ? "border-water-500 bg-water-50" : "border-gray-300"
              }`}
              onPress={() => setPaymentMethod("mpesa")}
            >
              <Ionicons
                name={paymentMethod === "mpesa" ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={paymentMethod === "mpesa" ? "#0ea5e9" : "#9ca3af"}
              />
              <Text className="ml-3 font-medium text-gray-800">M-PESA</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-row items-center p-3 rounded-lg border ${
                paymentMethod === "cash" ? "border-water-500 bg-water-50" : "border-gray-300"
              }`}
              onPress={() => setPaymentMethod("cash")}
            >
              <Ionicons
                name={paymentMethod === "cash" ? "radio-button-on" : "radio-button-off"}
                size={20}
                color={paymentMethod === "cash" ? "#0ea5e9" : "#9ca3af"}
              />
              <Text className="ml-3 font-medium text-gray-800">Cash on Delivery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Order Summary</Text>
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-gray-600">{quantity} Liters × KSh 5</Text>
            <Text className="font-semibold text-gray-800">KSh {calculateTotal()}</Text>
          </View>
          <View className="border-t border-gray-200 pt-2 mt-2">
            <View className="flex-row justify-between items-center">
              <Text className="text-lg font-semibold text-gray-800">Total</Text>
              <Text className="text-lg font-bold text-water-600">KSh {calculateTotal()}</Text>
            </View>
          </View>
        </View>

        {/* Place Order Button */}
        <TouchableOpacity
          className="bg-water-500 rounded-xl py-4 items-center mb-6"
          onPress={handleOrder}
          disabled={isLoading}
        >
          <Text className="text-white font-semibold text-lg">{isLoading ? "Placing Order..." : "Place Order"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
