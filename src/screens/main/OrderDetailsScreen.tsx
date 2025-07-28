import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useOrderStore } from "../../store/orderStore"

export default function OrderDetailsScreen({ route, navigation }: any) {
  const { orderId } = route.params
  const { getOrderById } = useOrderStore()
  const order = getOrderById(orderId)

  const handleReorder = () => {
    if (!order) return;

    // navigate to the orderscreen with prev order's details as params
    navigation.navigate("Order", {
      reorderData: {
        quantity: order.quantity.toString(),
        deliveryAddress: order.deliveryAddress,
        paymentMethod: order.paymentMethod
      }
    });
  };

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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return "time"
      case "accepted":
        return "checkmark-circle"
      case "out_for_delivery":
        return "car"
      case "delivered":
        return "checkmark-done-circle"
      case "cancelled":
        return "close-circle"
      default:
        return "help-circle"
    }
  }

  if (!order) return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-4">
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm items-center">
          <Text className="text-2xl font-bold text-gray-800 mt-4">Order not found</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-4">
        {/* Order Status */}
        <View className="bg-white rounded-xl p-6 mb-4 shadow-sm items-center">
          <Ionicons
            name={getStatusIcon(order?.status)}
            size={64}
            color={order?.status === "delivered" ? "#10b981" : "#0ea5e9"}
          />
          <Text className="text-2xl font-bold text-gray-800 mt-4">Order #{order?.id.slice(-6)}</Text>
          <View className={`px-4 py-2 rounded-full mt-2 ${getStatusColor(order?.status)}`}>
            <Text className="font-semibold">{order?.status.replace("_", " ").toUpperCase()}</Text>
          </View>
          <Text className="text-gray-600 mt-2">
            Placed on {order?.createdAt.toLocaleDateString()} at {order?.createdAt.toLocaleTimeString()}
          </Text>
        </View>

        {/* Order Details */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Order Details</Text>
          <View className="space-y-3">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Quantity</Text>
              <Text className="font-semibold text-gray-800">{order?.quantity} Liters</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Total Amount</Text>
              <Text className="font-semibold text-gray-800">KSh {order?.totalAmount}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Payment Method</Text>
              <Text className="font-semibold text-gray-800">
                {order?.paymentMethod === "mpesa" ? "M-PESA" : "Cash on Delivery"}
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Address */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</Text>
          <View className="space-y-2">
            <View className="flex-row items-center">
              <Ionicons name="business" size={16} color="#6b7280" />
              <Text className="text-gray-800 ml-2">{order?.deliveryAddress.residenceName}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="layers" size={16} color="#6b7280" />
              <Text className="text-gray-800 ml-2">Floor {order?.deliveryAddress.floorNumber}</Text>
            </View>
            <View className="flex-row items-center">
              <Ionicons name="home" size={16} color="#6b7280" />
              <Text className="text-gray-800 ml-2">Door {order?.deliveryAddress.doorNumber}</Text>
            </View>
            {order?.deliveryAddress.notes && (
              <View className="flex-row items-start">
                <Ionicons name="document-text" size={16} color="#6b7280" />
                <Text className="text-gray-800 ml-2 flex-1">{order?.deliveryAddress.notes}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Order Timeline */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Order Timeline</Text>
          <View className="space-y-4">
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
              <View className="flex-1">
                <Text className="font-medium text-gray-800">Order Placed</Text>
                <Text className="text-gray-600 text-sm">{order?.createdAt.toLocaleString()}</Text>
              </View>
            </View>

            {["accepted", "out_for_delivery", "delivered"].includes(order?.status) && (
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">Order Accepted</Text>
                  <Text className="text-gray-600 text-sm">Your order has been confirmed</Text>
                </View>
              </View>
            )}

            {["out_for_delivery", "delivered"].includes(order?.status) && (
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">Out for Delivery</Text>
                  <Text className="text-gray-600 text-sm">Your water is on the way</Text>
                </View>
              </View>
            )}

            {order?.status === "delivered" && (
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-green-500 rounded-full mr-3" />
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">Delivered</Text>
                  <Text className="text-gray-600 text-sm">{order?.deliveredAt?.toLocaleString()}</Text>
                </View>
              </View>
            )}

            {order?.status === "pending" && (
              <View className="flex-row items-center">
                <View className="w-3 h-3 bg-gray-300 rounded-full mr-3" />
                <View className="flex-1">
                  <Text className="font-medium text-gray-500">Waiting for confirmation</Text>
                  <Text className="text-gray-400 text-sm">We'll notify you once accepted</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="space-y-3 mb-6">
          {order?.status === "out_for_delivery" && (
            <TouchableOpacity
              className="bg-water-500 rounded-xl py-4 items-center"
              onPress={() => navigation.navigate("Tracking", { orderId: order?.id })}
            >
              <Text className="text-white font-semibold text-lg">Track Delivery</Text>
            </TouchableOpacity>
          )}

          {order?.status === "delivered" && !order?.rating && (
            <TouchableOpacity
              className="bg-yellow-500 rounded-xl py-4 items-center"
              onPress={() => navigation.navigate("Review", { orderId: order?.id })}
            >
              <Text className="text-white font-semibold text-lg">Rate & Review</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity className="border border-water-500 rounded-xl py-4 items-center"
          onPress={handleReorder}>
            <Text className="text-water-600 font-semibold text-lg">Reorder</Text>
          </TouchableOpacity>
        </View>

        {/* Rating & Review */}
        {order?.rating && (
          <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-3">Your Review</Text>
            <View className="flex-row items-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Ionicons key={star} name={star <= order?.rating! ? "star" : "star-outline"} size={20} color="#fbbf24" />
              ))}
              <Text className="text-gray-600 ml-2">({order?.rating}/5)</Text>
            </View>
            {order?.review && <Text className="text-gray-700">{order?.review}</Text>}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
