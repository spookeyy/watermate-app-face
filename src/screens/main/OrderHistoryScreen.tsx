"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useOrderStore } from "../../store/orderStore"

export default function OrderHistoryScreen({ navigation }: any) {
  const { orders } = useOrderStore()
  const [filter, setFilter] = useState<"all" | "delivered" | "pending">("all")

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true
    if (filter === "delivered") return order.status === "delivered"
    if (filter === "pending") return ["pending", "accepted", "out_for_delivery"].includes(order.status)
    return true
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "accepted":
        return "bg-blue-100 text-blue-800"
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 py-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Order History</Text>

        {/* Filter Tabs */}
        <View className="flex-row bg-white rounded-xl p-1 mb-4 shadow-sm">
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Active" },
            { key: "delivered", label: "Delivered" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              className={`flex-1 py-2 px-4 rounded-lg ${filter === tab.key ? "bg-water-500" : ""}`}
              onPress={() => setFilter(tab.key as any)}
            >
              <Text className={`text-center font-medium ${filter === tab.key ? "text-white" : "text-gray-600"}`}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {filteredOrders.length === 0 ? (
          <View className="items-center justify-center py-12">
            <Ionicons name="water-outline" size={64} color="#9ca3af" />
            <Text className="text-gray-500 text-lg mt-4">No orders found</Text>
            <TouchableOpacity
              className="bg-water-500 px-6 py-3 rounded-lg mt-4"
              onPress={() => navigation.navigate("Order")}
            >
              <Text className="text-white font-medium">Place Your First Order</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-3 pb-6">
            {filteredOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                className="bg-white rounded-xl p-4 shadow-sm"
                onPress={() => navigation.navigate("OrderDetails", { orderId: order.id })}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-lg">{order.quantity}L Water Delivery</Text>
                    <Text className="text-gray-600 text-sm">{order.deliveryAddress.residenceName}</Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      {order.createdAt.toLocaleDateString()} • {order.createdAt.toLocaleTimeString()}
                    </Text>
                  </View>
                  <View className="items-end">
                    <Text className="font-bold text-gray-800 text-lg">KSh {order.totalAmount}</Text>
                    <View className={`px-2 py-1 rounded-full mt-1 ${getStatusColor(order.status)}`}>
                      <Text className="text-xs font-medium">{order.status.replace("_", " ").toUpperCase()}</Text>
                    </View>
                  </View>
                </View>

                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <View className="flex-row items-center">
                    <Ionicons name={order.paymentMethod === "mpesa" ? "card" : "cash"} size={16} color="#6b7280" />
                    <Text className="text-gray-600 text-sm ml-1">
                      {order.paymentMethod === "mpesa" ? "M-PESA" : "Cash"}
                    </Text>
                  </View>

                  <View className="flex-row space-x-2">
                    {order.status === "delivered" && !order.rating && (
                      <TouchableOpacity
                        className="bg-yellow-100 px-3 py-1 rounded-full"
                        onPress={() => navigation.navigate("Review", { orderId: order.id })}
                      >
                        <Text className="text-yellow-800 text-xs font-medium">Rate</Text>
                      </TouchableOpacity>
                    )}

                    {["out_for_delivery"].includes(order.status) && (
                      <TouchableOpacity
                        className="bg-blue-100 px-3 py-1 rounded-full"
                        onPress={() => navigation.navigate("Tracking", { orderId: order.id })}
                      >
                        <Text className="text-blue-800 text-xs font-medium">Track</Text>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity className="bg-gray-100 px-3 py-1 rounded-full">
                      <Text className="text-gray-800 text-xs font-medium">Reorder</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {order.rating && (
                  <View className="flex-row items-center mt-2 pt-2 border-t border-gray-100">
                    <View className="flex-row">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Ionicons
                          key={star}
                          name={star <= order.rating! ? "star" : "star-outline"}
                          size={16}
                          color="#fbbf24"
                        />
                      ))}
                    </View>
                    {order.review && (
                      <Text className="text-gray-600 text-sm ml-2 flex-1" numberOfLines={1}>
                        "{order.review}"
                      </Text>
                    )}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
