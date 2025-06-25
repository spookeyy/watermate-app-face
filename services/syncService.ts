// import NetInfo from "@react-native-community/netinfo"
// import { dbOperations } from "./database"
// import { orderAPI } from "./api"
// import { storageHelpers } from "./storage"
// import Toast from "react-native-toast-message"

// class SyncService {
//   private syncInProgress = false
//   private syncInterval: NodeJS.Timeout | null = null

//   // Start automatic sync
//   startAutoSync() {
//     this.syncInterval = setInterval(() => {
//       this.syncData()
//     }, 30000) // Sync every 30 seconds
//   }

//   // Stop automatic sync
//   stopAutoSync() {
//     if (this.syncInterval) {
//       clearInterval(this.syncInterval)
//       this.syncInterval = null
//     }
//   }

//   // Main sync function
//   async syncData() {
//     if (this.syncInProgress) return

//     const isConnected = await this.checkConnection()
//     if (!isConnected) return

//     this.syncInProgress = true

//     try {
//       await this.syncOfflineOrders()
//       await this.syncOrderUpdates()
//       await this.downloadLatestData()
//     } catch (error) {
//       console.error("Sync error:", error)
//     } finally {
//       this.syncInProgress = false
//     }
//   }

//   // Check network connection
//   private async checkConnection(): Promise<boolean> {
//     const netInfo = await NetInfo.fetch()
//     return netInfo.isConnected ?? false
//   }

//   // Sync offline orders to server
//   private async syncOfflineOrders() {
//     const offlineOrders = storageHelpers.getOfflineOrders()
//     const unsyncedOrders = offlineOrders.filter((order: any) => !order.synced)

//     for (const order of unsyncedOrders) {
//       try {
//         const response = await orderAPI.createOrder(order)

//         // Mark as synced
//         storageHelpers.markOrderSynced(order.id)

//         // Update local database with server response
//         await dbOperations.insertOrder({
//           ...response,
//           synced: true,
//         })

//         console.log(`Order ${order.id} synced successfully`)
//       } catch (error) {
//         console.error(`Failed to sync order ${order.id}:`, error)
//       }
//     }

//     // Clean up synced orders
//     storageHelpers.clearSyncedOrders()
//   }

//   // Sync order status updates
//   private async syncOrderUpdates() {
//     const unsyncedItems = await dbOperations.getUnsyncedItems()

//     for (const item of unsyncedItems) {
//       try {
//         const data = JSON.parse(item.data)

//         switch (item.action) {
//           case "update_status":
//             await orderAPI.updateOrderStatus(item.record_id, data.status)
//             break
//           case "add_review":
//             await orderAPI.addReview(item.record_id, data.rating, data.review)
//             break
//         }

//         await dbOperations.markItemSynced(item.id)
//         console.log(`Sync item ${item.id} completed`)
//       } catch (error) {
//         console.error(`Failed to sync item ${item.id}:`, error)
//       }
//     }
//   }

//   // Download latest data from server
//   private async downloadLatestData() {
//     try {
//       const user = storageHelpers.getUser()
//       if (!user) return

//       // Get latest orders from server
//       const serverOrders = await orderAPI.getOrders(user.id)

//       // Cache the data
//       storageHelpers.setCachedData("user_orders", serverOrders, 1800000) // 30 minutes

//       console.log("Latest data downloaded and cached")
//     } catch (error) {
//       console.error("Failed to download latest data:", error)
//     }
//   }

//   // Force sync - called when user manually refreshes
//   async forcSync() {
//     Toast.show({
//       type: "info",
//       text1: "Syncing...",
//       text2: "Updating your data",
//     })

//     await this.syncData()

//     Toast.show({
//       type: "success",
//       text1: "Sync Complete",
//       text2: "Your data is up to date",
//     })
//   }

//   // Handle offline order creation
//   async createOfflineOrder(orderData: any) {
//     const orderId = `offline_${Date.now()}`
//     const order = {
//       ...orderData,
//       id: orderId,
//       status: "pending",
//       createdAt: new Date(),
//       synced: false,
//     }

//     // Store in offline queue
//     storageHelpers.addOfflineOrder(order)

//     // Store in local database
//     await dbOperations.insertOrder(order)

//     Toast.show({
//       type: "info",
//       text1: "Order Saved",
//       text2: "Will sync when connection is restored",
//     })

//     return order
//   }
// }

// export const syncService = new SyncService()
