import { create } from "zustand"

export interface Order {
  id: string
  quantity: number
  deliveryAddress: {
    residenceName: string
    floorNumber: string
    doorNumber: string
    notes?: string
  }
  paymentMethod: "mpesa" | "cash"
  status: "pending" | "accepted" | "out_for_delivery" | "delivered" | "cancelled"
  totalAmount: number
  createdAt: Date
  deliveredAt?: Date
  rating?: number
  review?: string
  trackingLocation?: {
    latitude: number
    longitude: number
  }
}

interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  isLoading: boolean
  createOrder: (orderData: Omit<Order, "id" | "status" | "createdAt">) => Promise<void>
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  getOrderById: (orderId: string) => Order | undefined
  addReview: (orderId: string, rating: number, review: string) => void
  updateTrackingLocation: (orderId: string, location: { latitude: number; longitude: number }) => void
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  createOrder: async (orderData) => {
    set({ isLoading: true })
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date(),
      }

      set((state) => ({
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        isLoading: false,
      }))
    } catch (error) {
      set({ isLoading: false })
      throw error
    }
  },

  updateOrderStatus: (orderId: string, status: Order["status"]) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, status, ...(status === "delivered" && { deliveredAt: new Date() }) } : order,
      ),
    }))
  },

  getOrderById: (orderId: string) => {
    return get().orders.find((order) => order.id === orderId)
  },

  addReview: (orderId: string, rating: number, review: string) => {
    set((state) => ({
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, rating, review } : order)),
    }))
  },

  updateTrackingLocation: (orderId: string, location: { latitude: number; longitude: number }) => {
    set((state) => ({
      orders: state.orders.map((order) => (order.id === orderId ? { ...order, trackingLocation: location } : order)),
    }))
  },
}))
