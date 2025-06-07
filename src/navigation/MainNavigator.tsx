import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"
import HomeScreen from "../screens/main/HomeScreen"
import OrderScreen from "../screens/main/OrderScreen"
import OrderHistoryScreen from "../screens/main/OrderHistoryScreen"
import ProfileScreen from "../screens/main/ProfileScreen"
import OrderDetailsScreen from "../screens/main/OrderDetailsScreen"
import PaymentScreen from "../screens/main/PaymentScreen"
import TrackingScreen from "../screens/main/TrackingScreen"
import ReviewScreen from "../screens/main/ReviewScreen"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "Order") {
            iconName = focused ? "water" : "water-outline"
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline"
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline"
          } else {
            iconName = "help-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
        },
        tabBarActiveTintColor: "#0ea5e9",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Order" component={OrderScreen} />
      <Tab.Screen name="History" component={OrderHistoryScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  )
}

export default function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="MainTabs" component={TabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="OrderDetails" component={OrderDetailsScreen} options={{ title: "Order Details" }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: "Payment" }} />
      <Stack.Screen name="Tracking" component={TrackingScreen} options={{ title: "Track Order" }} />
      <Stack.Screen name="Review" component={ReviewScreen} options={{ title: "Rate & Review" }} />
    </Stack.Navigator>
  )
}
