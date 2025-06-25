// import * as Notifications from "expo-notifications"
// import * as Device from "expo-device"
// import Constants from "expo-constants"
// import { Platform } from "react-native"
// import { storage } from "./storage"

// class NotificationService {
//   private expoPushToken: string | null = null

//   // Initialize notifications
//   async initialize() {
//     if (Device.isDevice) {
//       const { status: existingStatus } = await Notifications.getPermissionsAsync()
//       let finalStatus = existingStatus

//       if (existingStatus !== "granted") {
//         const { status } = await Notifications.requestPermissionsAsync()
//         finalStatus = status
//       }

//       if (finalStatus !== "granted") {
//         console.log("Failed to get push token for push notification!")
//         return
//       }

//       // Get the token that uniquely identifies this device
//       const token = await Notifications.getExpoPushTokenAsync({
//         projectId: Constants.expoConfig?.extra?.eas?.projectId,
//       })

//       this.expoPushToken = token.data
//       storage.set("expo_push_token", token.data)

//       console.log("Expo push token:", token.data)

//       // Send token to your backend
//       await this.registerTokenWithBackend(token.data)
//     } else {
//       console.log("Must use physical device for Push Notifications")
//     }

//     // Configure notification behavior
//     this.configureNotifications()
//   }

//   // Configure how notifications are handled
//   private configureNotifications() {
//     Notifications.setNotificationHandler({
//       handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: true,
//         shouldSetBadge: true,
//       }),
//     })

//     // Handle notification responses (when user taps notification)
//     Notifications.addNotificationResponseReceivedListener(this.handleNotificationResponse)

//     // Handle notifications received while app is in foreground
//     Notifications.addNotificationReceivedListener(this.handleNotificationReceived)
//   }

//   // Handle notification tap
//   private handleNotificationResponse = (response: Notifications.NotificationResponse) => {
//     const data = response.notification.request.content.data

//     // Navigate based on notification type
//     switch (data.type) {
//       case "order_status":
//         // Navigate to order details
//         console.log("Navigate to order:", data.orderId)
//         break
//       case "delivery_update":
//         // Navigate to tracking screen
//         console.log("Navigate to tracking:", data.orderId)
//         break
//       case "payment_status":
//         // Navigate to payment screen
//         console.log("Navigate to payment:", data.orderId)
//         break
//     }
//   }

//   // Handle notification received in foreground
//   private handleNotificationReceived = (notification: Notifications.Notification) => {
//     console.log("Notification received:", notification)

//     // You can show custom in-app notification here
//     // or update app state based on notification data
//   }

//   // Register token with backend
//   private async registerTokenWithBackend(token: string) {
//     try {
//       const user = storage.getString("user")
//       if (!user) return

//       const userData = JSON.parse(user)

//       // Send token to your backend
//       const response = await fetch("https://watermate-api.railway.app/notifications/register-token", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${storage.getString("auth_token")}`,
//         },
//         body: JSON.stringify({
//           userId: userData.id,
//           token: token,
//           platform: Platform.OS,
//         }),
//       })

//       if (response.ok) {
//         console.log("Push token registered successfully")
//       }
//     } catch (error) {
//       console.error("Failed to register push token:", error)
//     }
//   }

//   // Schedule local notification
//   async scheduleLocalNotification(title: string, body: string, data: any = {}, delay = 0) {
//     await Notifications.scheduleNotificationAsync({
//       content: {
//         title,
//         body,
//         data,
//         sound: true,
//       },
//       trigger: delay > 0 ? { seconds: delay } : null,
//     })
//   }

//   // Send order status notification
//   async notifyOrderStatus(orderId: string, status: string, orderDetails: any) {
//     const statusMessages = {
//       accepted: "Your order has been accepted and is being prepared",
//       out_for_delivery: "Your water is on the way! Track your delivery",
//       delivered: "Your order has been delivered. Enjoy your fresh water!",
//       cancelled: "Your order has been cancelled",
//     }

//     const title = `Order ${status.replace("_", " ").toUpperCase()}`
//     const body = statusMessages[status as keyof typeof statusMessages] || `Order status updated to ${status}`

//     await this.scheduleLocalNotification(title, body, {
//       type: "order_status",
//       orderId,
//       status,
//     })
//   }

//   // Send delivery update notification
//   async notifyDeliveryUpdate(orderId: string, message: string, estimatedTime?: string) {
//     const title = "Delivery Update"
//     const body = estimatedTime ? `${message} ETA: ${estimatedTime}` : message

//     await this.scheduleLocalNotification(title, body, {
//       type: "delivery_update",
//       orderId,
//     })
//   }

//   // Send payment notification
//   async notifyPaymentStatus(orderId: string, status: "success" | "failed" | "pending", amount?: number) {
//     const statusMessages = {
//       success: `Payment of KSh ${amount} successful`,
//       failed: "Payment failed. Please try again",
//       pending: "Payment is being processed",
//     }

//     const title = "Payment Update"
//     const body = statusMessages[status]

//     await this.scheduleLocalNotification(title, body, {
//       type: "payment_status",
//       orderId,
//       status,
//     })
//   }

//   // Get notification permissions status
//   async getPermissionStatus() {
//     const { status } = await Notifications.getPermissionsAsync()
//     return status
//   }

//   // Request notification permissions
//   async requestPermissions() {
//     const { status } = await Notifications.requestPermissionsAsync()
//     return status
//   }

//   // Clear all notifications
//   async clearAllNotifications() {
//     await Notifications.dismissAllNotificationsAsync()
//   }

//   // Get push token
//   getPushToken() {
//     return this.expoPushToken || storage.getString("expo_push_token")
//   }
// }

// export const notificationService = new NotificationService()
