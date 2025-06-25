// import axios from "axios"
// import NetInfo from "@react-native-community/netinfo"
// import { storage } from "./storage"
// import Toast from "react-native-toast-message"

// const API_BASE_URL = "https://watermate-api.railway.app" // Replace with your backend URL

// // Create axios instance
// const api = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// })

// // Request interceptor to add auth token
// api.interceptors.request.use(
//   (config) => {
//     const token = storage.getString("auth_token")
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`
//     }
//     return config
//   },
//   (error) => Promise.reject(error),
// )

// // Response interceptor for error handling
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     if (error.response?.status === 401) {
//       // Token expired, logout user
//       storage.delete("auth_token")
//       storage.delete("user")
//       Toast.show({
//         type: "error",
//         text1: "Session Expired",
//         text2: "Please login again",
//       })
//     }
//     return Promise.reject(error)
//   },
// )

// // Network status checker
// export const checkNetworkStatus = async (): Promise<boolean> => {
//   const netInfo = await NetInfo.fetch()
//   return netInfo.isConnected ?? false
// }

// // API endpoints
// export const authAPI = {
//   sendOTP: async (phoneNumber: string) => {
//     const response = await api.post("/auth/send-otp", { phoneNumber })
//     return response.data
//   },

//   verifyOTP: async (phoneNumber: string, otp: string) => {
//     const response = await api.post("/auth/verify-otp", { phoneNumber, otp })
//     return response.data
//   },

//   register: async (userData: any) => {
//     const response = await api.post("/auth/register", userData)
//     return response.data
//   },

//   refreshToken: async () => {
//     const response = await api.post("/auth/refresh")
//     return response.data
//   },
// }

// export const orderAPI = {
//   createOrder: async (orderData: any) => {
//     const response = await api.post("/orders", orderData)
//     return response.data
//   },

//   getOrders: async (userId: string) => {
//     const response = await api.get(`/orders/user/${userId}`)
//     return response.data
//   },

//   getOrderById: async (orderId: string) => {
//     const response = await api.get(`/orders/${orderId}`)
//     return response.data
//   },

//   updateOrderStatus: async (orderId: string, status: string) => {
//     const response = await api.patch(`/orders/${orderId}/status`, { status })
//     return response.data
//   },

//   addReview: async (orderId: string, rating: number, review: string) => {
//     const response = await api.post(`/orders/${orderId}/review`, { rating, review })
//     return response.data
//   },
// }

// export const paymentAPI = {
//   initiateMpesaPayment: async (phoneNumber: string, amount: number, orderId: string) => {
//     const response = await api.post("/payments/mpesa/initiate", {
//       phoneNumber,
//       amount,
//       orderId,
//     })
//     return response.data
//   },

//   checkPaymentStatus: async (checkoutRequestId: string) => {
//     const response = await api.get(`/payments/mpesa/status/${checkoutRequestId}`)
//     return response.data
//   },
// }

// export const locationAPI = {
//   updateDeliveryLocation: async (orderId: string, location: any) => {
//     const response = await api.patch(`/orders/${orderId}/location`, location)
//     return response.data
//   },

//   getDeliveryLocation: async (orderId: string) => {
//     const response = await api.get(`/orders/${orderId}/location`)
//     return response.data
//   },
// }

// export default api
