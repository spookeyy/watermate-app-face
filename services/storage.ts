// import { MMKV } from "react-native-mmkv"

// // Create MMKV instance for fast, secure storage
// export const storage = new MMKV({
//   id: "watermate-storage",
//   encryptionKey: "watermate-encryption-key-2025",
// })

// // Storage helpers
// export const storageHelpers = {
//   // User data
//   setUser: (user: any) => {
//     storage.set("user", JSON.stringify(user))
//   },

//   getUser: () => {
//     const userData = storage.getString("user")
//     return userData ? JSON.parse(userData) : null
//   },

//   // Auth token
//   setAuthToken: (token: string) => {
//     storage.set("auth_token", token)
//   },

//   getAuthToken: () => {
//     return storage.getString("auth_token")
//   },

//   // Offline orders queue
//   addOfflineOrder: (order: any) => {
//     const offlineOrders = getOfflineOrders()
//     offlineOrders.push({ ...order, timestamp: Date.now(), synced: false })
//     storage.set("offline_orders", JSON.stringify(offlineOrders))
//   },

//   getOfflineOrders: () => {
//     const orders = storage.getString("offline_orders")
//     return orders ? JSON.parse(orders) : []
//   },

//   markOrderSynced: (orderId: string) => {
//     const offlineOrders = getOfflineOrders()
//     const updatedOrders = offlineOrders.map((order: any) => (order.id === orderId ? { ...order, synced: true } : order))
//     storage.set("offline_orders", JSON.stringify(updatedOrders))
//   },

//   clearSyncedOrders: () => {
//     const offlineOrders = getOfflineOrders()
//     const unsyncedOrders = offlineOrders.filter((order: any) => !order.synced)
//     storage.set("offline_orders", JSON.stringify(unsyncedOrders))
//   },

//   // Cache management
//   setCachedData: (key: string, data: any, ttl = 3600000) => {
//     // 1 hour default TTL
//     const cacheItem = {
//       data,
//       timestamp: Date.now(),
//       ttl,
//     }
//     storage.set(`cache_${key}`, JSON.stringify(cacheItem))
//   },

//   getCachedData: (key: string) => {
//     const cached = storage.getString(`cache_${key}`)
//     if (!cached) return null

//     const cacheItem = JSON.parse(cached)
//     const now = Date.now()

//     if (now - cacheItem.timestamp > cacheItem.ttl) {
//       storage.delete(`cache_${key}`)
//       return null
//     }

//     return cacheItem.data
//   },

//   clearCache: () => {
//     const keys = storage.getAllKeys()
//     keys.forEach((key) => {
//       if (key.startsWith("cache_")) {
//         storage.delete(key)
//       }
//     })
//   },
// }

// // Helper functions
// const getOfflineOrders = () => {
//   const orders = storage.getString("offline_orders")
//   return orders ? JSON.parse(orders) : []
// }
