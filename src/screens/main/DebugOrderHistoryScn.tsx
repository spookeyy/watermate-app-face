import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";

export default function OrderHistoryScreen() {
  // Temporarily remove all navigation logic to test
  console.log("OrderHistoryScreen rendered");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Order History Debug
        </Text>
        <Text className="text-gray-600 mb-6">
          This is a simplified version to test navigation context
        </Text>

        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg">
          <Text className="text-white font-semibold">Test Button</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
