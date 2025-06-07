"use client"

import { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, SafeAreaView } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import Toast from "react-native-toast-message"
import { useOrderStore } from "../../store/orderStore"

export default function ReviewScreen({ route, navigation }: any) {
  const { orderId } = route.params
  const { getOrderById, addReview } = useOrderStore()
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState("")

  const order = getOrderById(orderId)

  const handleSubmitReview = () => {
    if (rating === 0) {
      Toast.show({
        type: "error",
        text1: "Rating Required",
        text2: "Please select a rating",
      })
      return
    }

    addReview(orderId, rating, review)

    Toast.show({
      type: "success",
      text1: "Thank You!",
      text2: "Your review has been submitted",
    })

    navigation.goBack()
  }

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500 text-lg">Order not found</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-1 px-6 py-4">
        <Text className="text-2xl font-bold text-gray-800 mb-6">Rate Your Experience</Text>

        {/* Order Info */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="font-semibold text-gray-800 text-lg mb-2">{order.quantity}L Water Delivery</Text>
          <Text className="text-gray-600">Delivered to {order.deliveryAddress.residenceName}</Text>
          <Text className="text-gray-500 text-sm mt-1">{order.deliveredAt?.toLocaleDateString()}</Text>
        </View>

        {/* Rating */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-4">How was your experience?</Text>
          <View className="flex-row justify-center space-x-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} className="p-2">
                <Ionicons
                  name={star <= rating ? "star" : "star-outline"}
                  size={40}
                  color={star <= rating ? "#fbbf24" : "#d1d5db"}
                />
              </TouchableOpacity>
            ))}
          </View>
          <Text className="text-center text-gray-600">
            {rating === 0 && "Tap to rate"}
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </Text>
        </View>

        {/* Review Text */}
        <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Tell us more (Optional)</Text>
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 h-24"
            placeholder="Share your experience with our service..."
            value={review}
            onChangeText={setReview}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity className="bg-water-500 rounded-xl py-4 items-center" onPress={handleSubmitReview}>
          <Text className="text-white font-semibold text-lg">Submit Review</Text>
        </TouchableOpacity>

        {/* Skip Option */}
        <TouchableOpacity className="items-center py-4" onPress={() => navigation.goBack()}>
          <Text className="text-gray-600">Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
