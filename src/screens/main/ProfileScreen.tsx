import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { useAuthStore } from "../../store/authStore";

export default function ProfileScreen() {
  const { user, logout, updateProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phoneNumber: user?.phoneNumber || "",
  });

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: "Your profile has been updated successfully",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: "Please try again",
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-900 mb-6">Profile</Text>

        {/* Personal Info Card */}
        <View className="bg-white rounded-2xl p-6 shadow-md border border-gray-100">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Personal Information
            </Text>
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              className="bg-blue-50 px-4 py-2 rounded-full"
            >
              <Text className="text-blue-600 font-semibold">
                {isEditing ? "Cancel" : "Edit"}
              </Text>
            </TouchableOpacity>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-gray-500 mb-2">Full Name</Text>
              {isEditing ? (
                <TextInput
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, name: text }))
                  }
                />
              ) : (
                <Text className="text-gray-900 font-medium text-base">
                  {user?.name}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-gray-500 mb-2">Phone Number</Text>
              {isEditing ? (
                <TextInput
                  className="border-2 border-gray-200 rounded-xl px-4 py-3 bg-gray-50"
                  value={formData.phoneNumber}
                  onChangeText={(text) =>
                    setFormData((prev) => ({ ...prev, phoneNumber: text }))
                  }
                  keyboardType="phone-pad"
                />
              ) : (
                <Text className="text-gray-900 font-medium text-base">
                  {user?.phoneNumber}
                </Text>
              )}
            </View>

            {isEditing && (
              <TouchableOpacity
                className="bg-blue-600 rounded-xl py-4 mt-2 items-center"
                onPress={handleSave}
              >
                <Text className="text-white font-bold text-base">
                  Save Changes
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* App Settings Card */}
        <SettingsSection
          title="App Settings"
          items={[
            { icon: "notifications", label: "Notifications" },
            { icon: "location", label: "Location Services" },
            { icon: "card", label: "Payment Methods" },
          ]}
        />

        {/* Support Section */}
        <SettingsSection
          title="Support"
          items={[
            { icon: "help-circle", label: "Help Center" },
            { icon: "call", label: "Contact Support" },
            { icon: "document-text", label: "Terms & Privacy" },
          ]}
        />

        {/* About */}
        <View className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">About</Text>
          <View className="space-y-2">
            <InfoRow label="App Version" value="1.0.0" />
            <InfoRow label="Build" value="2025.06.08" />
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          className="bg-red-500 rounded-xl py-4 items-center mb-8"
          onPress={() => setShowLogoutModal(true)}
        >
          <Text className="text-white font-bold text-lg">Logout</Text>
        </TouchableOpacity>

        {/* Logout Modal */}
        <Modal
          animationType="fade"
          transparent
          visible={showLogoutModal}
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white w-11/12 rounded-xl p-6 shadow-lg">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Confirm Logout
              </Text>
              <Text className="text-gray-500 mb-6">
                Are you sure you want to logout from your account?
              </Text>
              <View className="flex-row justify-end space-x-4">
                <Pressable
                  onPress={() => setShowLogoutModal(false)}
                  className="px-4 py-2 rounded-md bg-gray-100"
                >
                  <Text className="text-gray-700 font-semibold">Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={logout}
                  className="px-4 py-2 rounded-md bg-red-500"
                >
                  <Text className="text-white font-semibold">Logout</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// Use the Ionicons name type based on the glyphMap keys
type IoniconName = keyof typeof Ionicons.glyphMap;

type SettingsSectionProps = {
  title: string;
  items: { icon: IoniconName; label: string }[];
};

function SettingsSection({ title, items }: SettingsSectionProps) {
  return (
    <View className="bg-white rounded-2xl p-6 shadow-md border border-gray-100 mb-4">
      <Text className="text-lg font-bold text-gray-800 mb-4">{title}</Text>
      <View className="space-y-3">
        {items.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between py-3"
          >
            <View className="flex-row items-center">
              <Ionicons name={item.icon} size={20} color="#6b7280" />
              <Text className="text-gray-800 ml-3 font-medium">
                {item.label}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

type InfoRowProps = {
  label: string;
  value: string;
};

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <View className="flex-row justify-between">
      <Text className="text-gray-500">{label}</Text>
      <Text className="text-gray-900 font-medium">{value}</Text>
    </View>
  );
}
