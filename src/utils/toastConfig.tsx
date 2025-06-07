import { View, Text } from "react-native"
import { Ionicons } from "@expo/vector-icons"

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View className="bg-green-500 mx-4 p-4 rounded-xl flex-row items-center shadow-lg">
      <Ionicons name="checkmark-circle" size={24} color="white" />
      <View className="ml-3 flex-1">
        <Text className="text-white font-semibold">{text1}</Text>
        {text2 && <Text className="text-green-100 text-sm">{text2}</Text>}
      </View>
    </View>
  ),
  error: ({ text1, text2 }: any) => (
    <View className="bg-red-500 mx-4 p-4 rounded-xl flex-row items-center shadow-lg">
      <Ionicons name="close-circle" size={24} color="white" />
      <View className="ml-3 flex-1">
        <Text className="text-white font-semibold">{text1}</Text>
        {text2 && <Text className="text-red-100 text-sm">{text2}</Text>}
      </View>
    </View>
  ),
  info: ({ text1, text2 }: any) => (
    <View className="bg-blue-500 mx-4 p-4 rounded-xl flex-row items-center shadow-lg">
      <Ionicons name="information-circle" size={24} color="white" />
      <View className="ml-3 flex-1">
        <Text className="text-white font-semibold">{text1}</Text>
        {text2 && <Text className="text-blue-100 text-sm">{text2}</Text>}
      </View>
    </View>
  ),
}
