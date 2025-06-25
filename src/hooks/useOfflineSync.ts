// "use client"

// import { useEffect, useState } from "react"
// import NetInfo, { NetInfoState } from "@react-native-community/netinfo";
// import { syncService } from "../../services/syncService"
// import { storageHelpers } from "../../services/storage"

// export const useOfflineSync = () => {
//   const [isOnline, setIsOnline] = useState(true)
//   const [isSyncing, setIsSyncing] = useState(false)
//   const [pendingSync, setPendingSync] = useState(0)

//   useEffect(() => {
//     // Monitor network status
//     const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
//       const wasOffline = !isOnline
//       const isNowOnline = state.isConnected ?? false

//       setIsOnline(isNowOnline)

//       // If we just came back online, trigger sync
//       if (wasOffline && isNowOnline) {
//         handleReconnection()
//       }
//     })

//     // Start auto sync
//     syncService.startAutoSync()

//     // Check pending sync items
//     updatePendingCount()

//     return () => {
//       unsubscribe()
//       syncService.stopAutoSync()
//     }
//   }, [])

//   const handleReconnection = async () => {
//     setIsSyncing(true)
//     try {
//       await syncService.syncData()
//       updatePendingCount()
//     } catch (error) {
//       console.error("Sync on reconnection failed:", error)
//     } finally {
//       setIsSyncing(false)
//     }
//   }

//   const updatePendingCount = () => {
//     const offlineOrders = storageHelpers.getOfflineOrders()
//     const unsyncedCount = offlineOrders.filter((order: any) => !order.synced).length
//     setPendingSync(unsyncedCount)
//   }

//   const forceSync = async () => {
//     if (!isOnline) return false

//     setIsSyncing(true)
//     try {
//       await syncService.forcSync()
//       updatePendingCount()
//       return true
//     } catch (error) {
//       console.error("Force sync failed:", error)
//       return false
//     } finally {
//       setIsSyncing(false)
//     }
//   }

//   return {
//     isOnline,
//     isSyncing,
//     pendingSync,
//     forceSync,
//   }
// }
