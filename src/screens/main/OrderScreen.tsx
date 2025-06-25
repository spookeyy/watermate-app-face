import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { useOrderStore } from "../../store/orderStore";
import { pricePerLiter } from "../../constants/constant-variables";
import { useFocusEffect } from "@react-navigation/native";

export default function OrderScreen({ navigation }: any) {
  const [quantity, setQuantity] = useState("10");
  const [deliveryAddress, setDeliveryAddress] = useState({
    residenceName: "",
    floorNumber: "",
    doorNumber: "",
    notes: "",
  });
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "cash">("mpesa");
  const [location, setLocation] = useState<Location.LocationObject | null>(
    null
  );
  const [isButtonEnabled, setIsButtonEnabled] = useState(true);
  const { createOrder, isLoading } = useOrderStore();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Fix button responsiveness issue
  useFocusEffect(
    useCallback(() => {
      setIsButtonEnabled(true);
    }, [])
  );

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Toast.show({
          type: "error",
          text1: "Location Permission",
          text2: "Location access is needed for delivery",
        });
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    } catch (error) {
      console.error("Error getting location:", error);
    }
  };

  const calculateTotal = () => {
    return Number.parseInt(quantity) * pricePerLiter;
  };

  const handleOrder = async () => {
    if (!isButtonEnabled) return;

    if (Number.parseInt(quantity) < 10) {
      Toast.show({
        type: "error",
        text1: "Minimum Order",
        text2: "Minimum delivery order is 10 liters",
      });
      return;
    }

    if (
      !deliveryAddress.residenceName ||
      !deliveryAddress.floorNumber ||
      !deliveryAddress.doorNumber
    ) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill in all delivery details",
      });
      return;
    }

    try {
      setIsButtonEnabled(false);

      await createOrder({
        quantity: Number.parseInt(quantity),
        deliveryAddress,
        paymentMethod,
        totalAmount: calculateTotal(),
      });

      Toast.show({
        type: "success",
        text1: "Order Placed!",
        text2: "Your water delivery order has been placed",
      });

      navigation.navigate("Payment", {
        orderId: Date.now().toString(),
        amount: calculateTotal(),
        paymentMethod,
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Order Failed",
        text2: "Please try again",
      });
    } finally {
      setIsButtonEnabled(true);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />

      {/* Professional Header */}
      <View className="bg-white border-b border-gray-100 px-6 py-4 mt-8">
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">
              Place Order
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              Fresh water delivered to your door
            </Text>
          </View>
          <View className="bg-blue-50 p-3 rounded-full">
            <Ionicons name="water" size={24} color="#0ea5e9" />
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-6 py-4 space-y-6">
          {/* Quantity Selection */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 p-2 rounded-lg mr-3">
                <Ionicons name="water-outline" size={20} color="#0ea5e9" />
              </View>
              <Text className="text-lg font-semibold text-gray-900">
                Water Quantity
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <TouchableOpacity
                className="bg-gray-100 p-4 rounded-xl active:bg-gray-200"
                onPress={() =>
                  setQuantity(
                    Math.max(10, Number.parseInt(quantity) - 5).toString()
                  )
                }
              >
                <Ionicons name="remove" size={20} color="#374151" />
              </TouchableOpacity>

              <View className="flex-1 mx-4">
                <TextInput
                  className="border-2 border-gray-200 rounded-xl px-4 py-4 text-center text-xl font-bold text-gray-900 bg-gray-50"
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  selectTextOnFocus={true}
                />
                <Text className="text-center text-sm text-gray-500 mt-2">
                  Liters
                </Text>
              </View>

              <TouchableOpacity
                className="bg-gray-100 p-4 rounded-xl active:bg-gray-200"
                onPress={() =>
                  setQuantity((Number.parseInt(quantity) + 5).toString())
                }
              >
                <Ionicons name="add" size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {Number.parseInt(quantity) < 10 && (
              <View className="mt-4 p-3 bg-red-50 rounded-lg">
                <Text className="text-red-600 text-sm font-medium">
                  ⚠️ Minimum delivery order is 10 liters
                </Text>
              </View>
            )}
          </View>

          {/* Delivery Address */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center">
                <View className="bg-green-100 p-2 rounded-lg mr-3">
                  <Ionicons name="location-outline" size={20} color="#10b981" />
                </View>
                <Text className="text-lg font-semibold text-gray-900">
                  Delivery Address
                </Text>
              </View>
              <TouchableOpacity
                onPress={getCurrentLocation}
                className="bg-blue-50 p-2 rounded-lg"
              >
                <Ionicons name="refresh" size={16} color="#0ea5e9" />
              </TouchableOpacity>
            </View>

            <View className="space-y-4">
              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Residence Name *
                </Text>
                <TextInput
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50"
                  placeholder="e.g., Falcon Court Apartments"
                  value={deliveryAddress.residenceName}
                  onChangeText={(text) =>
                    setDeliveryAddress((prev) => ({
                      ...prev,
                      residenceName: text,
                    }))
                  }
                />
              </View>

              <View className="flex-row space-x-3">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Floor *
                  </Text>
                  <TextInput
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50"
                    placeholder="Floor"
                    value={deliveryAddress.floorNumber}
                    onChangeText={(text) =>
                      setDeliveryAddress((prev) => ({
                        ...prev,
                        floorNumber: text,
                      }))
                    }
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700 mb-2">
                    Door/Unit *
                  </Text>
                  <TextInput
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50"
                    placeholder="Door"
                    value={deliveryAddress.doorNumber}
                    onChangeText={(text) =>
                      setDeliveryAddress((prev) => ({
                        ...prev,
                        doorNumber: text,
                      }))
                    }
                  />
                </View>
              </View>

              <View>
                <Text className="text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </Text>
                <TextInput
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 text-gray-900 bg-gray-50"
                  placeholder="Any special delivery instructions..."
                  value={deliveryAddress.notes}
                  onChangeText={(text) =>
                    setDeliveryAddress((prev) => ({ ...prev, notes: text }))
                  }
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>

          {/* Payment Method */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-purple-100 p-2 rounded-lg mr-3">
                <Ionicons name="card-outline" size={20} color="#8b5cf6" />
              </View>
              <Text className="text-lg font-semibold text-gray-900">
                Payment Method
              </Text>
            </View>

            <View className="space-y-3">
              <TouchableOpacity
                className={`flex-row items-center p-4 rounded-xl border-2 mb-2 ${
                  paymentMethod === "mpesa"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
                onPress={() => setPaymentMethod("mpesa")}
              >
                <View className="mr-3">
                  <Ionicons
                    name={
                      paymentMethod === "mpesa"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={paymentMethod === "mpesa" ? "#0ea5e9" : "#9ca3af"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">M-PESA</Text>
                  <Text className="text-sm text-gray-500">
                    Pay with your mobile money
                  </Text>
                </View>
                <View className="bg-green-100 px-3 py-1 rounded-full">
                  <Text className="text-green-700 text-xs font-medium">
                    RECOMMENDED
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                className={`flex-row items-center p-4 rounded-xl border-2 ${
                  paymentMethod === "cash"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 bg-gray-50"
                }`}
                onPress={() => setPaymentMethod("cash")}
              >
                <View className="mr-3">
                  <Ionicons
                    name={
                      paymentMethod === "cash"
                        ? "radio-button-on"
                        : "radio-button-off"
                    }
                    size={20}
                    color={paymentMethod === "cash" ? "#0ea5e9" : "#9ca3af"}
                  />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    Cash on Delivery
                  </Text>
                  <Text className="text-sm text-gray-500">
                    Pay when you receive your order
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Order Summary */}
          <View className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-6 border border-blue-100">
            <View className="flex-row items-center mb-4">
              <View className="bg-blue-100 p-2 rounded-lg mr-3">
                <Ionicons name="receipt-outline" size={20} color="#0ea5e9" />
              </View>
              <Text className="text-lg font-semibold text-gray-900">
                Order Summary
              </Text>
            </View>

            <View className="space-y-3">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">{quantity} Liters</Text>
                <Text className="font-medium text-gray-900">
                  KSh {pricePerLiter} per liter
                </Text>
              </View>

              <View className="flex-row justify-between items-center">
                <Text className="text-gray-600">Subtotal</Text>
                <Text className="font-medium text-gray-900">
                  KSh {calculateTotal()}
                </Text>
              </View>

              <View className="border-t border-blue-200 pt-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-xl font-bold text-gray-900">Total</Text>
                  <Text className="text-xl font-bold text-blue-600">
                    KSh {calculateTotal()}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Place Order Button */}
          <TouchableOpacity
            className={`rounded-2xl py-4 mx-6 mb-6 items-center ${
              isLoading || !isButtonEnabled ? "bg-gray-400" : "bg-blue-600"
            }`}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
            onPress={handleOrder}
            disabled={isLoading || !isButtonEnabled}
            activeOpacity={0.8}
          >
            <View className="flex-row items-center">
              {isLoading ? (
                <>
                  <Ionicons name="hourglass-outline" size={20} color="white" />
                  <Text className="text-white font-bold text-lg ml-2">
                    Placing Order...
                  </Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="white"
                  />
                  <Text className="text-white font-bold text-lg ml-2">
                    Place Order
                  </Text>
                </>
              )}
            </View>
          </TouchableOpacity>

          {/* Bottom spacing for better scroll experience */}
          <View className="h-6" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}