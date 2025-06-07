"use client"

import { useEffect, useState } from "react"
import { View, Text, SafeAreaView, Dimensions } from "react-native"
import MapView, { Marker, Polyline } from "react-native-maps"
import { Ionicons } from "@expo/vector-icons"
import { useOrderStore } from "../../store/orderStore"

const { width, height } = Dimensions.get("window")

export default function TrackingScreen({ route }: any) {
  const { orderId } = route.params
  const { getOrderById, updateTrackingLocation } = useOrderStore()
  const [deliveryLocation, setDeliveryLocation] = useState({
    latitude: -1.2921,
    longitude: 36.8219,
  })
  const [customerLocation, setCustomerLocation] = useState({
    latitude: -1.2864,
    longitude: 36.8172,
  })

  const order = getOrderById(orderId)

  useEffect(() => {
    // Simulate delivery person movement
    const interval = setInterval(() => {
      setDeliveryLocation((prev) => ({
        latitude: prev.latitude + (Math.random() - 0.5) * 0.001,
        longitude: prev.longitude + (Math.random() - 0.5) * 0.001,
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (order) {
      updateTrackingLocation(orderId, deliveryLocation)
    }
  }, [deliveryLocation])

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500 text-lg">Order not found</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        <MapView
          style={{ width, height: height * 0.7 }}
          initialRegion={{
            latitude: -1.2921,
            longitude: 36.8219,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Customer Location */}
          <Marker coordinate={customerLocation} title="Your Location" description={order.deliveryAddress.residenceName}>
            <View className="bg-blue-500 p-2 rounded-full">
              <Ionicons name="home" size={20} color="white" />
            </View>
          </Marker>

          {/* Delivery Person Location */}
          <Marker coordinate={deliveryLocation} title="Delivery Person" description="Your water is on the way!">
            <View className="bg-green-500 p-2 rounded-full">
              <Ionicons name="car" size={20} color="white" />
            </View>
          </Marker>

          {/* Route Line */}
          <Polyline
            coordinates={[deliveryLocation, customerLocation]}
            strokeColor="#0ea5e9"
            strokeWidth={3}
            lineDashPattern={[5, 5]}
          />
        </MapView>

        {/* Delivery Info */}
        <View className="flex-1 bg-white px-6 py-4">
          <View className="bg-green-50 p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-2">
              <Ionicons name="car" size={20} color="#10b981" />
              <Text className="text-green-800 font-semibold ml-2">Out for Delivery</Text>
            </View>
            <Text className="text-green-700">Your {order.quantity}L water delivery is on the way!</Text>
          </View>

          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Estimated Arrival</Text>
              <Text className="font-semibold text-gray-800">15-20 minutes</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Delivery Address</Text>
              <Text className="font-semibold text-gray-800 text-right flex-1 ml-4">
                {order.deliveryAddress.residenceName}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Order Total</Text>
              <Text className="font-semibold text-gray-800">KSh {order.totalAmount}</Text>
            </View>
          </View>

          {/* Contact Delivery Person */}
          <View className="mt-6 space-y-3">
            <Text className="text-lg font-semibold text-gray-800">Need Help?</Text>
            <View className="flex-row space-x-3">
              <View className="flex-1 bg-blue-50 p-4 rounded-xl items-center">
                <Ionicons name="call" size={24} color="#2563eb" />
                <Text className="text-blue-800 font-medium mt-1">Call Driver</Text>
              </View>
              <View className="flex-1 bg-green-50 p-4 rounded-xl items-center">
                <Ionicons name="chatbubble" size={24} color="#10b981" />
                <Text className="text-green-800 font-medium mt-1">Message</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}
