"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Toast from "react-native-toast-message"
import { useAuthStore } from "../../store/authStore"

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuthStore()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
  })

  const handleSave = async () => {
    try {
      await updateProfile(formData)
      setIsEditing(false)
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been updated successfully",
      })
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Please try again",
      })
    }
  }

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ])
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Profile</Text>

        {/* Profile Info */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-semibold text-gray-800">Personal Information</Text>
            <TouchableOpacity onPress={() => setIsEditing(!isEditing)} className="bg-water-100 px-3 py-1 rounded-full">
              <Text className="text-water-600 font-medium">{isEditing ? "Cancel" : "Edit"}</Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-600 mb-2">Full Name</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  value={formData.name}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, name: text }))}
                />
              ) : (
                <Text className="text-gray-800 font-medium">{user?.name}</Text>
              )}
            </View>

            <View>
              <Text className="text-gray-600 mb-2">Phone Number</Text>
              {isEditing ? (
                <TextInput
                  className="border border-gray-300 rounded-lg px-4 py-3"
                  value={formData.phoneNumber}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, phoneNumber: text }))}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text className="text-gray-800 font-medium">{user?.phoneNumber}</Text>
              )}
            </View>

            {isEditing && (
              <TouchableOpacity className="bg-water-500 rounded-lg py-3 items-center" onPress={handleSave}>
                <Text className="text-white font-semibold">Save Changes</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* App Settings */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">App Settings</Text>
          <View className="space-y-3">
            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <Ionicons name="notifications" size={20} color="#6b7280" />
                <Text className="text-gray-800 ml-3">Notifications</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <Ionicons name="location" size={20} color="#6b7280" />
                <Text className="text-gray-800 ml-3">Location Services</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <Ionicons name="card" size={20} color="#6b7280" />
                <Text className="text-gray-800 ml-3">Payment Methods</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Support */}
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">Support</Text>
          <View className="space-y-3">
            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <Ionicons name="help-circle" size={20} color="#6b7280" />
                <Text className="text-gray-800 ml-3">Help Center</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <Ionicons name="call" size={20} color="#6b7280" />
                <Text className="text-gray-800 ml-3">Contact Support</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-between py-2">
              <View className="flex-row items-center">
                <Ionicons name="document-text" size={20} color="#6b7280" />
                <Text className="text-gray-800 ml-3">Terms & Privacy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </TouchableOpacity>
          </View>
        </View>

        {/* App Info */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">About</Text>
          <View className="space-y-2">
            <View className="flex-row justify-between">
              <Text className="text-gray-600">App Version</Text>
              <Text className="text-gray-800">1.0.0</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-gray-600">Build</Text>
              <Text className="text-gray-800">2025.06.08</Text>
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity className="bg-red-500 rounded-xl py-4 items-center mb-6" onPress={handleLogout}>
          <Text className="text-white font-semibold text-lg">Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
