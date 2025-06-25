import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Toast from "react-native-toast-message"
import { useAuthStore } from "../../store/authStore"

export default function SignUpScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
  })
  const { signUp, isLoading } = useAuthStore()

  const handleSignUp = async () => {
    if (!formData.name || !formData.phoneNumber) {
      Toast.show({
        type: "error",
        text1: "Missing Information",
        text2: "Please fill in all fields",
      })
      return
    }

    if (formData.phoneNumber.length < 10) {
      Toast.show({
        type: "error",
        text1: "Invalid Phone Number",
        text2: "Please enter a valid phone number",
      })
      return
    }

    try {
      await signUp(formData)
      Toast.show({
        type: "success",
        text1: "Account Created!",
        text2: "Welcome to WaterMate",
      })
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Sign Up Failed",
        text2: "Please try again",
      })
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 justify-center">
        <View className="items-center mb-8">
          <Ionicons name="water" size={80} color="#0ea5e9" />
          <Text className="text-3xl font-bold text-gray-800 mt-4">Join WaterMate</Text>
          <Text className="text-gray-600 mt-2">Create your account</Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base mb-2"
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
            />
          </View>

          <View>
            <Text className="text-gray-700 mb-2 font-medium">Phone Number</Text>
            <TextInput
              className="border border-gray-300 rounded-lg px-4 py-3 text-base mb-4"
              placeholder="Enter your phone number"
              value={formData.phoneNumber}
              onChangeText={(text) => setFormData((prev) => ({ ...prev, phoneNumber: text }))}
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity
            className="bg-water-500 rounded-lg py-4 items-center"
            onPress={handleSignUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-semibold text-lg">Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity className="items-center py-4" onPress={() => navigation.navigate("Login")}>
            <Text className="text-water-600">
              Already have an account? <Text className="font-semibold">Login</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}
