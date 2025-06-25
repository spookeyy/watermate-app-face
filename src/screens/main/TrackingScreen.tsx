import { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Dimensions,
  Animated,
  Easing,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { Ionicons } from "@expo/vector-icons";
import { useOrderStore } from "../../store/orderStore";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default function TrackingScreen({ route, navigation }: any) {
  const { orderId } = route.params;
  const { getOrderById, updateTrackingLocation } = useOrderStore();
  const mapRef = useRef<MapView>(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const [isMapReady, setIsMapReady] = useState(false);

  // Modal states for call and message
  const [showCallModal, setShowCallModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  // Delivery simulation state
  const [deliveryLocation, setDeliveryLocation] = useState({
    latitude: -1.2921,
    longitude: 36.8219,
  });
  const [customerLocation] = useState({
    latitude: -1.2864,
    longitude: 36.8172,
  });
  const [eta, setEta] = useState("15-20 min");
  const [progress, setProgress] = useState(0.3);
  const [isDriverNearby, setIsDriverNearby] = useState(false);

  const order = getOrderById(orderId);

  // Pulsing animation for driver marker
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Simulate realistic delivery movement
  useEffect(() => {
    if (!order) return;

    let step = 0;
    const routePoints = generateRoutePoints(
      deliveryLocation,
      customerLocation,
      20
    );

    const interval = setInterval(() => {
      if (step >= routePoints.length - 1) {
        clearInterval(interval);
        setIsDriverNearby(true);
        setEta("Arriving now");
        setProgress(1);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        return;
      }

      step++;
      const newLocation = routePoints[step];
      if (newLocation) {
        setDeliveryLocation(newLocation);
      }

      // Calculate progress (0 to 1)
      const newProgress = step / routePoints.length;
      setProgress(newProgress);

      // Update ETA based on progress
      setEta(
        `${Math.max(1, Math.round((1 - newProgress) * 20))}-${Math.max(
          2,
          Math.round((1 - newProgress) * 25)
        )} min`
      );

      // Trigger haptic feedback when driver is nearby
      if (step > routePoints.length * 0.9 && !isDriverNearby) {
        setIsDriverNearby(true);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }

      // Animate map to follow driver
      if (mapRef.current && isMapReady) {
        mapRef.current.animateToRegion({
          latitude: newLocation?.latitude,
          longitude: newLocation?.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [order, isMapReady]);

  useEffect(() => {
    if (order) {
      updateTrackingLocation(orderId, deliveryLocation);
    }
  }, [deliveryLocation]);

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-500 text-lg">Order not found</Text>
      </SafeAreaView>
    );
  }

  // Generate intermediate points for smooth delivery route
  function generateRoutePoints(start: any, end: any, numPoints: number) {
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
      const fraction = i / numPoints;
      points.push({
        latitude: start.latitude + (end.latitude - start.latitude) * fraction,
        longitude:
          start.longitude + (end.longitude - start.longitude) * fraction,
      });
    }
    return points;
  }

  const handleCallDriver = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowCallModal(true);
  };

  const simulateCall = () => {
    setIsConnecting(true);
    // Simulate connection delay
    setTimeout(() => {
      setIsConnecting(false);
      setShowCallModal(false);
      Alert.alert(
        "Call Ended",
        "You've successfully contacted the delivery driver. They confirmed they're on their way!",
        [{ text: "OK" }]
      );
    }, 3000);
  };

  const handleMessageDriver = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setShowMessageModal(true);
  };

  const sendMessage = () => {
    if (message.trim()) {
      setShowMessageModal(false);
      Alert.alert(
        "Message Sent",
        `Your message "${message}" has been sent to the delivery driver. They'll respond shortly!`,
        [{ text: "OK" }]
      );
      setMessage("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      {/* <LinearGradient
        colors={["#ffffff", "#f8fafc"]}
        className="px-6 py-4 border-b border-gray-100 flex-row items-center justify-between"
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0ea5e9" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-900">
          Track Your Delivery
        </Text>
        <View className="w-6" />
      </LinearGradient> */}

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Map View */}
        <View className="relative">
          <MapView
            ref={mapRef}
            style={{ width, height: height * 0.45 }}
            initialRegion={{
              latitude: deliveryLocation.latitude,
              longitude: deliveryLocation.longitude,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
            onMapReady={() => setIsMapReady(true)}
            mapType="standard"
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={false}
            toolbarEnabled={false}
          >
            {/* Customer Location */}
            <Marker coordinate={customerLocation} title="Your Location">
              <View className="bg-blue-500 p-3 rounded-full border-2 border-white shadow-lg">
                <Ionicons name="home" size={18} color="white" />
              </View>
            </Marker>

            {/* Delivery Person Location */}
            <Marker coordinate={deliveryLocation} title="Delivery Person">
              <Animated.View
                style={{
                  transform: [{ scale: pulseAnim }],
                  shadowColor: "#10b981",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 6,
                }}
                className="bg-green-500 p-3 rounded-full border-2 border-white"
              >
                <Ionicons name="bicycle" size={18} color="white" />
              </Animated.View>
            </Marker>

            {/* Route Line */}
            <Polyline
              coordinates={generateRoutePoints(
                deliveryLocation,
                customerLocation,
                10
              )}
              strokeColor="#0ea5e9"
              strokeWidth={4}
              lineDashPattern={[5, 5]}
              lineCap="round"
            />
          </MapView>

          {/* Delivery Progress Indicator */}
          <View className="absolute bottom-4 left-4 right-4 bg-white rounded-xl p-4 shadow-lg">
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm font-medium text-gray-600">
                Delivery in progress
              </Text>
              <Text className="text-sm font-semibold text-blue-600">{eta}</Text>
            </View>
            <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <LinearGradient
                colors={["#0ea5e9", "#22d3ee"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="h-full rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            </View>
          </View>
        </View>

        {/* Delivery Info Card */}
        <View className="bg-gray-50 px-6 py-6">
          <LinearGradient
            colors={
              isDriverNearby ? ["#ecfdf5", "#d1fae5"] : ["#f0f9ff", "#e0f2fe"]
            }
            className="p-4 rounded-xl mb-6 shadow-sm"
          >
            <View className="flex-row items-center mb-2">
              <View
                className={`p-2 rounded-lg mr-3 ${
                  isDriverNearby ? "bg-green-100" : "bg-blue-100"
                }`}
              >
                <Ionicons
                  name={isDriverNearby ? "checkmark-circle" : "time"}
                  size={20}
                  color={isDriverNearby ? "#10b981" : "#0ea5e9"}
                />
              </View>
              <View className="flex-1">
                <Text
                  className={`text-lg font-semibold ${
                    isDriverNearby ? "text-green-800" : "text-blue-800"
                  }`}
                >
                  {isDriverNearby ? "Driver Nearby!" : "On the Way"}
                </Text>
                <Text
                  className={`text-sm ${
                    isDriverNearby ? "text-green-700" : "text-blue-700"
                  }`}
                >
                  {isDriverNearby
                    ? `Your ${order.quantity}L water is almost there!`
                    : `Your ${order.quantity}L water is on its way`}
                </Text>
              </View>
            </View>
          </LinearGradient>

          {/* Order Details */}
          <View className="bg-white rounded-xl p-5 shadow-sm mb-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-gray-900">
                Order Details
              </Text>
              <View
                className={`px-3 py-1 rounded-full ${
                  isDriverNearby ? "bg-green-100" : "bg-blue-100"
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    isDriverNearby ? "text-green-800" : "text-blue-800"
                  }`}
                >
                  {order.status.replace("_", " ").toUpperCase()}
                </Text>
              </View>
            </View>

            <View className="space-y-4">
              <View className="flex-row justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="water" size={16} color="#0ea5e9" />
                  <Text className="text-gray-600 ml-2">Quantity</Text>
                </View>
                <Text className="font-semibold text-gray-800">
                  {order.quantity} Liters
                </Text>
              </View>

              <View className="flex-row justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="location" size={16} color="#0ea5e9" />
                  <Text className="text-gray-600 ml-2">Delivery To</Text>
                </View>
                <View className="flex-1 ml-4">
                  <Text className="font-semibold text-gray-800 text-right">
                    {order.deliveryAddress.residenceName}
                  </Text>
                  <Text className="text-gray-500 text-right text-sm">
                    Floor {order.deliveryAddress.floorNumber}, Door{" "}
                    {order.deliveryAddress.doorNumber}
                  </Text>
                </View>
              </View>

              <View className="flex-row justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="cash" size={16} color="#0ea5e9" />
                  <Text className="text-gray-600 ml-2">Payment</Text>
                </View>
                <View className="flex-row items-center">
                  <Text className="font-semibold text-gray-800 mr-2">
                    KSh {order.totalAmount}
                  </Text>
                  <View className="bg-blue-100 px-2 py-1 rounded-full">
                    <Text className="text-blue-800 text-xs font-medium">
                      {order.paymentMethod === "mpesa" ? "M-PESA" : "CASH"}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row space-x-4 mb-6">
            <TouchableOpacity
              className="flex-1 bg-white border border-gray-200 rounded-xl p-4 items-center shadow-sm"
              onPress={handleCallDriver}
              activeOpacity={0.7}
            >
              <View className="bg-blue-50 p-3 rounded-full mb-2">
                <Ionicons name="call" size={24} color="#2563eb" />
              </View>
              <Text className="text-blue-800 font-medium">Call Driver</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-1 bg-white border border-gray-200 rounded-xl p-4 items-center shadow-sm"
              onPress={handleMessageDriver}
              activeOpacity={0.7}
            >
              <View className="bg-green-50 p-3 rounded-full mb-2">
                <Ionicons name="chatbubble" size={24} color="#10b981" />
              </View>
              <Text className="text-green-800 font-medium">Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Call Driver Modal */}
      <Modal
        visible={showCallModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-6">
              <View className="bg-blue-100 p-4 rounded-full mb-4">
                <Ionicons name="call" size={32} color="#2563eb" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Calling Driver
              </Text>
              <Text className="text-gray-600 text-center">
                {isConnecting ? "Connecting..." : "Ready to call your delivery driver?"}
              </Text>
            </View>

            {isConnecting ? (
              <View className="items-center py-4">
                <Animated.View
                  style={{
                    transform: [{ rotate: "360deg" }],
                  }}
                >
                  <Ionicons name="refresh" size={24} color="#2563eb" />
                </Animated.View>
                <Text className="text-blue-600 mt-2">Connecting call...</Text>
              </View>
            ) : (
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className="flex-1 bg-gray-100 rounded-xl p-3 items-center"
                  onPress={() => setShowCallModal(false)}
                >
                  <Text className="text-gray-800 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-1 bg-blue-600 rounded-xl p-3 items-center"
                  onPress={simulateCall}
                >
                  <Text className="text-white font-medium">Call Now</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

      {/* Message Driver Modal */}
      <Modal
        visible={showMessageModal}
        transparent={true}
        animationType="slide"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
            <View className="items-center mb-6">
              <View className="bg-green-100 p-4 rounded-full mb-4">
                <Ionicons name="chatbubble" size={32} color="#10b981" />
              </View>
              <Text className="text-xl font-bold text-gray-900 mb-2">
                Message Driver
              </Text>
              <Text className="text-gray-600 text-center">
                Send a quick message to your delivery driver
              </Text>
            </View>

            <TextInput
              className="border border-gray-200 rounded-xl p-4 mb-4 min-h-[100px]"
              placeholder="Type your message here..."
              multiline
              value={message}
              onChangeText={setMessage}
              textAlignVertical="top"
            />

            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-100 rounded-xl p-3 items-center"
                onPress={() => {
                  setShowMessageModal(false);
                  setMessage("");
                }}
              >
                <Text className="text-gray-800 font-medium">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-green-600 rounded-xl p-3 items-center"
                onPress={sendMessage}
              >
                <Text className="text-white font-medium">Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}