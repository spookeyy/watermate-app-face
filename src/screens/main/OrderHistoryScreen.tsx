import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useOrderStore } from "../../store/orderStore";
import Toast from "react-native-toast-message";

export default function OrderHistoryScreen({ navigation }: any) {
  const { orders, fetchOrders } = useOrderStore();
  const [filter, setFilter] = useState<"all" | "delivered" | "pending">("all");
  const [refreshing, setRefreshing] = useState(false);

  const filteredOrders = orders.filter((order) => {
    if (filter === "all") return true;
    if (filter === "delivered") return order.status === "delivered";
    if (filter === "pending")
      return ["pending", "accepted", "out_for_delivery"].includes(order.status);
    return true;
  });

  const handleRefresh = useCallback(async () => {
    try {
      setRefreshing(true);
      await fetchOrders();
      Toast.show({
        type: "success",
        text1: "Orders Updated",
        text2: "Your order history has been refreshed",
      });
    } catch (error) {
      console.error("Failed to refresh orders:", error);
      Toast.show({
        type: "error",
        text1: "Refresh Failed",
        text2: "Could not update your orders. Please try again.",
      });
    } finally {
      setRefreshing(false);
    }
  }, [fetchOrders]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "out_for_delivery":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getFilterCount = (filterType: "all" | "delivered" | "pending") => {
    if (filterType === "all") return orders.length;
    if (filterType === "delivered")
      return orders.filter((order) => order.status === "delivered").length;
    if (filterType === "pending")
      return orders.filter((order) =>
        ["pending", "accepted", "out_for_delivery"].includes(order.status)
      ).length;
    return 0;
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <SafeAreaView className="flex-1 bg-white">
        {/* Professional Header */}
        <View className="bg-white border-b border-gray-100 px-6 py-4 shadow-sm mt-8">
          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-900">
                Order History
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {orders.length} {orders.length === 1 ? "order" : "orders"} total
              </Text>
            </View>
            <TouchableOpacity
              className={`bg-blue-50 p-3 rounded-full ${
                refreshing ? "opacity-50" : ""
              }`}
              onPress={handleRefresh}
              disabled={refreshing}
            >
              <Ionicons
                name={refreshing ? "refresh-circle-outline" : "refresh"}
                size={20}
                color="#0ea5e9"
              />
            </TouchableOpacity>
          </View>

          {/* Enhanced Filter Tabs */}
          <View className="flex-row bg-gray-50 rounded-xl p-1">
            {[
              { key: "all", label: "All", count: getFilterCount("all") },
              {
                key: "pending",
                label: "Active",
                count: getFilterCount("pending"),
              },
              {
                key: "delivered",
                label: "Delivered",
                count: getFilterCount("delivered"),
              },
            ].map((tab) => (
              <TouchableOpacity
                key={tab.key}
                className={`flex-1 py-3 px-4 rounded-lg ${
                  filter === tab.key
                    ? "bg-white shadow-sm border border-blue-100"
                    : ""
                }`}
                onPress={() => setFilter(tab.key as any)}
              >
                <View className="items-center">
                  <Text
                    className={`font-semibold ${
                      filter === tab.key ? "text-blue-600" : "text-gray-600"
                    }`}
                  >
                    {tab.label}
                  </Text>
                  <View
                    className={`mt-1 px-2 py-0.5 rounded-full ${
                      filter === tab.key ? "bg-blue-100" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        filter === tab.key ? "text-blue-700" : "text-gray-600"
                      }`}
                    >
                      {tab.count}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Content Area with Pull-to-Refresh */}
        <ScrollView
          className="flex-1 bg-gray-50"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#0ea5e9"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View className="px-6">
            {filteredOrders.length === 0 ? (
              <View className="items-center justify-center py-16">
                <View className="bg-blue-50 p-6 rounded-full mb-4">
                  <Ionicons name="water-outline" size={48} color="#0ea5e9" />
                </View>
                <Text className="text-gray-900 text-xl font-semibold mb-2">
                  {filter === "all"
                    ? "No orders yet"
                    : filter === "pending"
                    ? "No active orders"
                    : "No delivered orders"}
                </Text>
                <Text className="text-gray-500 text-center mb-6 leading-5">
                  {filter === "all"
                    ? "Start your hydration journey with\nyour first water delivery"
                    : filter === "pending"
                    ? "All your orders have been\nsuccessfully completed"
                    : "No delivered orders to show"}
                </Text>
                {filter === "all" && (
                  <TouchableOpacity
                    className="bg-blue-500 px-8 py-4 rounded-xl shadow-sm"
                    onPress={() => navigation.navigate("Order")}
                  >
                    <Text className="text-white font-semibold text-base">
                      Place Your First Order
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View className="py-4 space-y-3 pb-8">
                {filteredOrders.map((order) => (
                  <TouchableOpacity
                    key={order.id}
                    className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-2"
                    onPress={() =>
                      navigation.navigate("OrderDetails", { orderId: order.id })
                    }
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.05,
                      shadowRadius: 3,
                      elevation: 2,
                    }}
                  >
                    <View className="flex-row items-start justify-between mb-4">
                      <View className="flex-1">
                        <View className="flex-row items-center mb-2">
                          <View className="bg-blue-50 p-2 rounded-lg mr-3">
                            <Ionicons name="water" size={20} color="#0ea5e9" />
                          </View>
                          <View className="flex-1">
                            <Text className="font-semibold text-gray-900 text-lg">
                              {order.quantity || 0}L Water Delivery
                            </Text>
                            <Text className="text-gray-600 text-sm">
                              {order.deliveryAddress?.residenceName || "N/A"}
                            </Text>
                          </View>
                        </View>
                        <Text className="text-gray-500 text-xs">
                          {order.createdAt.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}{" "}
                          •{" "}
                          {order.createdAt.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="font-bold text-gray-900 text-xl">
                          KSh {order.totalAmount?.toLocaleString?.() || 0}
                        </Text>
                        <View
                          className={`px-3 py-1.5 rounded-full mt-2 ${getStatusColor(
                            order.status
                          )}`}
                        >
                          <Text className="text-xs font-semibold">
                            {order.status.replace("_", " ").toUpperCase()}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row items-center justify-between pt-4 border-t border-gray-50">
                      <View className="flex-row items-center">
                        <View className="bg-gray-50 p-1.5 rounded-lg mr-2">
                          <Ionicons
                            name={
                              order.paymentMethod === "mpesa" ? "card" : "cash"
                            }
                            size={14}
                            color="#6b7280"
                          />
                        </View>
                        <Text className="text-gray-600 text-sm font-medium">
                          {order.paymentMethod === "mpesa"
                            ? "M-PESA"
                            : "Cash on Delivery"}
                        </Text>
                      </View>

                      <View className="flex-row space-x-2">
                        {order.status === "delivered" && !order.rating && (
                          <TouchableOpacity
                            className="bg-yellow-50 border border-yellow-200 px-3 py-1.5 rounded-lg"
                            onPress={() =>
                              navigation.navigate("Review", {
                                orderId: order.id,
                              })
                            }
                          >
                            <Text className="text-yellow-700 text-xs font-semibold">
                              Rate Order
                            </Text>
                          </TouchableOpacity>
                        )}

                        {["out_for_delivery"].includes(order.status) && (
                          <TouchableOpacity
                            className="bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg"
                            onPress={() =>
                              navigation.navigate("Tracking", {
                                orderId: order.id,
                              })
                            }
                          >
                            <Text className="text-blue-700 text-xs font-semibold">
                              Track
                            </Text>
                          </TouchableOpacity>
                        )}

                        <TouchableOpacity className="bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg">
                          <Text className="text-gray-700 text-xs font-semibold">
                            Reorder
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {order.rating && (
                      <View className="flex-row items-center mt-3 pt-3 border-t border-gray-50">
                        <View className="flex-row mr-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Ionicons
                              key={star}
                              name={
                                star <= order.rating! ? "star" : "star-outline"
                              }
                              size={16}
                              color="#fbbf24"
                            />
                          ))}
                        </View>
                        {order.review && (
                          <Text
                            className="text-gray-600 text-sm flex-1"
                            numberOfLines={2}
                          >
                            "{order.review}"
                          </Text>
                        )}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
            </View>
          </ScrollView>
      </SafeAreaView>
    </>
  );
}
