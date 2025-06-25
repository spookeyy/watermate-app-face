// import { paymentAPI } from "./api"
// import { storage } from "./storage"
// import Toast from "react-native-toast-message"

// interface MpesaPaymentRequest {
//   phoneNumber: string
//   amount: number
//   orderId: string
//   accountReference?a: string
//   transactionDesc?: string
// }

// interface MpesaPaymentResponse {
//   merchantRequestId: string
//   checkoutRequestId: string
//   responseCode: string
//   responseDescription: string
//   customerMessage: string
// }

// class MpesaService {
//   private readonly POLL_INTERVAL = 5000 // 5 seconds
//   private readonly MAX_POLL_ATTEMPTS = 24 // 2 minutes total

//   // Initiate M-PESA STK Push
//   async initiatePayment(request: MpesaPaymentRequest): Promise<MpesaPaymentResponse> {
//     try {
//       // Format phone number (ensure it starts with 254)
//       const formattedPhone = this.formatPhoneNumber(request.phoneNumber)

//       const response = await paymentAPI.initiateMpesaPayment(formattedPhone, request.amount, request.orderId)

//       if (response.responseCode === "0") {
//         // Store payment details for tracking
//         this.storePaymentDetails(response.checkoutRequestId, request)

//         Toast.show({
//           type: "info",
//           text1: "Payment Request Sent",
//           text2: "Please check your phone for M-PESA prompt",
//         })

//         // Start polling for payment status
//         this.pollPaymentStatus(response.checkoutRequestId, request.orderId)
//       } else {
//         throw new Error(response.responseDescription || "Payment initiation failed")
//       }

//       return response
//     } catch (error: any) {
//       console.error("M-PESA payment error:", error)

//       Toast.show({
//         type: "error",
//         text1: "Payment Failed",
//         text2: error.message || "Unable to process payment",
//       })

//       throw error
//     }
//   }

//   // Poll payment status
//   private async pollPaymentStatus(checkoutRequestId: string, orderId: string) {
//     let attempts = 0

//     const poll = async () => {
//       try {
//         attempts++

//         const statusResponse = await paymentAPI.checkPaymentStatus(checkoutRequestId)

//         if (statusResponse.resultCode === "0") {
//           // Payment successful
//           this.handlePaymentSuccess(orderId, statusResponse)
//           return
//         } else if (statusResponse.resultCode === "1032") {
//           // User cancelled
//           this.handlePaymentCancellation(orderId)
//           return
//         } else if (statusResponse.resultCode && statusResponse.resultCode !== "1037") {
//           // Payment failed (1037 means still processing)
//           this.handlePaymentFailure(orderId, statusResponse.resultDesc)
//           return
//         }

//         // Continue polling if still processing and within limits
//         if (attempts < this.MAX_POLL_ATTEMPTS) {
//           setTimeout(poll, this.POLL_INTERVAL)
//         } else {
//           // Timeout
//           this.handlePaymentTimeout(orderId)
//         }
//       } catch (error) {
//         console.error("Payment status polling error:", error)

//         if (attempts < this.MAX_POLL_ATTEMPTS) {
//           setTimeout(poll, this.POLL_INTERVAL)
//         } else {
//           this.handlePaymentTimeout(orderId)
//         }
//       }
//     }

//     // Start polling after initial delay
//     setTimeout(poll, this.POLL_INTERVAL)
//   }

//   // Handle successful payment
//   private handlePaymentSuccess(orderId: string, paymentData: any) {
//     // Store payment confirmation
//     storage.set(
//       `payment_${orderId}`,
//       JSON.stringify({
//         status: "completed",
//         transactionId: paymentData.mpesaReceiptNumber,
//         amount: paymentData.amount,
//         phoneNumber: paymentData.phoneNumber,
//         timestamp: new Date().toISOString(),
//       }),
//     )

//     Toast.show({
//       type: "success",
//       text1: "Payment Successful!",
//       text2: `Transaction ID: ${paymentData.mpesaReceiptNumber}`,
//     })

//     // Trigger order status update
//     this.updateOrderPaymentStatus(orderId, "paid")
//   }

//   // Handle payment cancellation
//   private handlePaymentCancellation(orderId: string) {
//     storage.set(
//       `payment_${orderId}`,
//       JSON.stringify({
//         status: "cancelled",
//         timestamp: new Date().toISOString(),
//       }),
//     )

//     Toast.show({
//       type: "error",
//       text1: "Payment Cancelled",
//       text2: "You cancelled the M-PESA payment",
//     })

//     this.updateOrderPaymentStatus(orderId, "cancelled")
//   }

//   // Handle payment failure
//   private handlePaymentFailure(orderId: string, errorMessage: string) {
//     storage.set(
//       `payment_${orderId}`,
//       JSON.stringify({
//         status: "failed",
//         error: errorMessage,
//         timestamp: new Date().toISOString(),
//       }),
//     )

//     Toast.show({
//       type: "error",
//       text1: "Payment Failed",
//       text2: errorMessage || "Transaction was not successful",
//     })

//     this.updateOrderPaymentStatus(orderId, "failed")
//   }

//   // Handle payment timeout
//   private handlePaymentTimeout(orderId: string) {
//     storage.set(
//       `payment_${orderId}`,
//       JSON.stringify({
//         status: "timeout",
//         timestamp: new Date().toISOString(),
//       }),
//     )

//     Toast.show({
//       type: "error",
//       text1: "Payment Timeout",
//       text2: "Please try again or contact support",
//     })

//     this.updateOrderPaymentStatus(orderId, "timeout")
//   }

//   // Update order payment status
//   private updateOrderPaymentStatus(orderId: string, status: string) {
//     // This would typically update your order store or trigger a callback
//     // Implementation depends on your state management
//     console.log(`Order ${orderId} payment status: ${status}`)
//   }

//   // Format phone number for M-PESA
//   private formatPhoneNumber(phoneNumber: string): string {
//     // Remove any non-digit characters
//     let cleaned = phoneNumber.replace(/\D/g, "")

//     // Handle different formats
//     if (cleaned.startsWith("0")) {
//       // Convert 0712345678 to 254712345678
//       cleaned = "254" + cleaned.substring(1)
//     } else if (cleaned.startsWith("7") || cleaned.startsWith("1")) {
//       // Convert 712345678 to 254712345678
//       cleaned = "254" + cleaned
//     } else if (!cleaned.startsWith("254")) {
//       // Add country code if missing
//       cleaned = "254" + cleaned
//     }

//     return cleaned
//   }

//   // Store payment details for reference
//   private storePaymentDetails(checkoutRequestId: string, request: MpesaPaymentRequest) {
//     const paymentDetails = {
//       checkoutRequestId,
//       orderId: request.orderId,
//       phoneNumber: request.phoneNumber,
//       amount: request.amount,
//       timestamp: new Date().toISOString(),
//       status: "pending",
//     }

//     storage.set(`payment_details_${checkoutRequestId}`, JSON.stringify(paymentDetails))
//   }

//   // Get payment status for an order
//   getPaymentStatus(orderId: string): any {
//     const paymentData = storage.getString(`payment_${orderId}`)
//     return paymentData ? JSON.parse(paymentData) : null
//   }

//   // Validate phone number
//   validatePhoneNumber(phoneNumber: string): boolean {
//     const cleaned = phoneNumber.replace(/\D/g, "")

//     // Check if it's a valid Kenyan mobile number
//     const validPrefixes = [
//       "254701",
//       "254702",
//       "254703",
//       "254704",
//       "254705",
//       "254706",
//       "254707",
//       "254708",
//       "254709",
//       "254710",
//       "254711",
//       "254712",
//       "254713",
//       "254714",
//       "254715",
//       "254716",
//       "254717",
//       "254718",
//       "254719",
//       "254720",
//       "254721",
//       "254722",
//       "254723",
//       "254724",
//       "254725",
//       "254726",
//       "254727",
//       "254728",
//       "254729",
//       "254790",
//       "254791",
//       "254792",
//       "254793",
//       "254794",
//       "254795",
//       "254796",
//       "254797",
//       "254798",
//       "254799",
//     ]

//     const formatted = this.formatPhoneNumber(phoneNumber)

//     return validPrefixes.some((prefix) => formatted.startsWith(prefix)) && formatted.length === 12
//   }
// }

// export const mpesaService = new MpesaService()
