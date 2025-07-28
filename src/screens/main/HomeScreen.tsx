import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useAuthStore } from "../../store/authStore";
import { useOrderStore } from "../../store/orderStore";
// import { useOfflineSync } from "../../hooks/useOfflineSync";

export default function HomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const { orders } = useOrderStore();
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [address, setAddress] = useState<string>("");

  // const { isOnline, isSyncing, pendingSync, forceSync } = useOfflineSync();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      const addresses = await Location.reverseGeocodeAsync({
        latitude: location?.coords.latitude,
        longitude: location?.coords.longitude,
      });

      if (addresses?.length > 0) {
        const firstAddress = addresses[0];
        const addressParts = [
          firstAddress?.name,
          firstAddress?.street,
          firstAddress?.city,
          firstAddress?.region,
          firstAddress?.country,
        ].filter(Boolean);
        setAddress(addressParts.join(", "));
      }
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const activeOrders = orders.filter((order) =>
    ["pending", "accepted", "out_for_delivery"].includes(order.status)
  );

  const recentOrders = orders.slice(0, 3);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-water-500 px-6 py-8 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-8">
            <View>
              <Text className="text-white text-lg mt-6">Hello,</Text>
              <Text className="text-white text-2xl font-bold">
                {user?.name}
              </Text>
            </View>
            <TouchableOpacity className="bg-white/20 p-3 rounded-full mt-6">
              <Ionicons name="notifications" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sync Status */}
        {/* <View className="px-6 mt-4">
          {!isOnline && (
            <Text className="text-red-600 text-sm font-medium">
              You're offline. Changes will sync once you're back online.
            </Text>
          )}
          {isSyncing && (
            <Text className="text-blue-600 text-sm font-medium">
              Syncing your data...
            </Text>
          )}
          {!isSyncing && pendingSync > 0 && (
            <TouchableOpacity onPress={forceSync}>
              <Text className="text-orange-600 text-sm font-medium">
                {pendingSync} pending changes. Tap to sync now.
              </Text>
            </TouchableOpacity>
          )}
        </View> */}

        {/* Quick Actions */}
        <View className="px-6 -mt-8">
          <View className="bg-white rounded-2xl p-6 shadow-sm">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Quick Order
            </Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                className="flex-1 bg-water-50 p-4 rounded-xl items-center"
                onPress={() => navigation.navigate("Order")}
              >
                <Ionicons name="water" size={32} color="#0ea5e9" />
                <Text className="text-water-600 font-medium mt-2">
                  Order Water
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-green-50 p-4 rounded-xl items-center"
                onPress={() => navigation.navigate("OrderHistory")}
              >
                <Ionicons name="time" size={32} color="#10b981" />
                <Text className="text-green-600 font-medium mt-2">Reorder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Active Orders */}
        {activeOrders.length > 0 && (
          <View className="px-6 mt-6">
            <Text className="text-lg font-semibold text-gray-800 mb-4">
              Active Orders
            </Text>
            {activeOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                onPress={() =>
                  navigation.navigate("OrderDetails", { orderId: order.id })
                }
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">
                      {order.quantity}L Water Delivery
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1">
                      {order.deliveryAddress.residenceName}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <View
                        className={`px-2 py-1 rounded-full ${
                          order.status === "pending"
                            ? "bg-yellow-100"
                            : order.status === "accepted"
                            ? "bg-blue-100"
                            : "bg-green-100"
                        }`}
                      >
                        <Text
                          className={`text-xs font-medium ${
                            order.status === "pending"
                              ? "text-yellow-800"
                              : order.status === "accepted"
                              ? "text-blue-800"
                              : "text-green-800"
                          }`}
                        >
                          {order.status.replace("_", " ").toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <View className="px-6 mt-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-800">
                Recent Orders
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("History")}>
                <Text className="text-water-600 font-medium">View All</Text>
              </TouchableOpacity>
            </View>
            {recentOrders.map((order) => (
              <TouchableOpacity
                key={order.id}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm"
                onPress={() =>
                  navigation.navigate("OrderDetails", { orderId: order.id })
                }
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800">
                      {order.quantity}L Water
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {order.createdAt.toLocaleDateString()}
                    </Text>
                  </View>
                  <Text className="text-gray-800 font-semibold">
                    KSh {order.totalAmount}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Location Info */}
        {location && (
          <View className="px-6 mt-6 mb-6">
            <View className="bg-white rounded-xl p-4 shadow-sm">
              <View className="flex-row items-center">
                <Ionicons name="location" size={20} color="#0ea5e9" />
                <Text className="text-gray-800 font-medium ml-2">
                  Current Location
                </Text>
              </View>
              {address ? (
                <Text className="text-gray-600 text-sm mt-1">{address}</Text>
              ) : (
                <Text className="text-gray-600 text-sm mt-1">
                  Lat: {location.coords.latitude.toFixed(4)}, Lng:{" "}
                  {location.coords.longitude.toFixed(4)}
                </Text>
              )}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
