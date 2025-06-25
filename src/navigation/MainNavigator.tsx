import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import { Platform, TouchableOpacity } from "react-native";
import HomeScreen from "../screens/main/HomeScreen";
import OrderScreen from "../screens/main/OrderScreen";
import OrderHistoryScreen from "../screens/main/OrderHistoryScreen";
import ProfileScreen from "../screens/main/ProfileScreen";
import OrderDetailsScreen from "../screens/main/OrderDetailsScreen";
import PaymentScreen from "../screens/main/PaymentScreen";
import TrackingScreen from "../screens/main/TrackingScreen";
import ReviewScreen from "../screens/main/ReviewScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Order") {
            iconName = focused ? "water" : "water-outline";
          } else if (route.name === "History") {
            iconName = focused ? "time" : "time-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#0ea5e9",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingBottom: Platform.OS === "ios" ? 20 : 8,
          paddingTop: 8,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        headerShown: false, // Keep headers hidden for tab screens since they handle their own
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen
        name="Order"
        component={OrderScreen}
        options={{
          tabBarLabel: "Order",
        }}
      />
      <Tab.Screen
        name="History"
        component={OrderHistoryScreen}
        options={{
          tabBarLabel: "History",
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "white",
          elevation: 2,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          fontSize: 18,
          fontWeight: "bold",
          color: "#1f2937",
        },
        headerTintColor: "#0ea5e9",
        headerBackTitleVisible: false,
        headerLeftContainerStyle: {
          paddingLeft: 10,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
        },
        cardStyle: {
          backgroundColor: "#f9fafb",
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScreen}
        options={({ navigation }) => ({
          title: "Order Details",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 8,
                marginLeft: 4,
                borderRadius: 8,
                backgroundColor: "#f1f5f9",
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#0ea5e9" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={({ navigation }) => ({
          title: "Payment",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 8,
                marginLeft: 4,
                borderRadius: 8,
                backgroundColor: "#f1f5f9",
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#0ea5e9" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Tracking"
        component={TrackingScreen}
        options={({ navigation }) => ({
          title: "Track Your Delivery",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 8,
                marginLeft: 4,
                borderRadius: 8,
                backgroundColor: "#f1f5f9",
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#0ea5e9" />
            </TouchableOpacity>
          ),
        })}
      />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={({ navigation }) => ({
          title: "Rate & Review",
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{
                padding: 8,
                marginLeft: 4,
                borderRadius: 8,
                backgroundColor: "#f1f5f9",
              }}
            >
              <Ionicons name="arrow-back" size={20} color="#0ea5e9" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
}
