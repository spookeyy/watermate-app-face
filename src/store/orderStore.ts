import { create } from "zustand";

export interface Order {
  id: string;
  quantity: number;
  deliveryAddress: {
    residenceName: string;
    floorNumber: string;
    doorNumber: string;
    notes?: string;
  };
  paymentMethod: "mpesa" | "cash";
  status:
    | "pending"
    | "accepted"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  totalAmount: number;
  createdAt: Date;
  deliveredAt?: Date;
  rating?: number;
  review?: string;
  trackingLocation?: {
    latitude: number;
    longitude: number;
  };
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  createOrder: (
    orderData: Omit<Order, "id" | "status" | "createdAt">
  ) => Promise<void>;
  fetchOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  getOrderById: (orderId: string) => Order | undefined;
  addReview: (orderId: string, rating: number, review: string) => void;
  updateTrackingLocation: (
    orderId: string,
    location: { latitude: number; longitude: number }
  ) => void;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,

  createOrder: async (orderData) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(),
        status: "pending",
        createdAt: new Date(),
      };

      set((state) => ({
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  fetchOrders: async () => {
    set({ isLoading: true });
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Generate mock orders with realistic data
      const mockOrders: Order[] = [
        {
          id: "1",
          quantity: 20,
          deliveryAddress: {
            residenceName: "Green Valley Apartments",
            floorNumber: "3",
            doorNumber: "12",
            notes: "Leave at security desk if I'm not home",
          },
          paymentMethod: "mpesa",
          status: "delivered",
          totalAmount: 600,
          createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
          deliveredAt: new Date(Date.now() - 86400000), // 1 day ago
          rating: 5,
          review: "Excellent service, arrived on time!",
        },
        {
          id: "2",
          quantity: 30,
          deliveryAddress: {
            residenceName: "Falcon Court Apartments",
            floorNumber: "5",
            doorNumber: "34",
          },
          paymentMethod: "cash",
          status: "out_for_delivery",
          totalAmount: 900,
          createdAt: new Date(Date.now() - 3600000 * 3), // 3 hours ago
          trackingLocation: {
            latitude: -1.167828,
            longitude: 36.932688,
          },
        },
        {
          id: "3",
          quantity: 15,
          deliveryAddress: {
            residenceName: "Parkview Estate",
            floorNumber: "1",
            doorNumber: "5",
            notes: "Call when arriving at gate",
          },
          paymentMethod: "mpesa",
          status: "accepted",
          totalAmount: 450,
          createdAt: new Date(Date.now() - 3600000 * 1), // 1 hour ago
        },
        {
          id: "4",
          quantity: 10,
          deliveryAddress: {
            residenceName: "Hillside Villas",
            floorNumber: "2",
            doorNumber: "8",
          },
          paymentMethod: "cash",
          status: "out_for_delivery",
          totalAmount: 300,
          createdAt: new Date(), // Just now
        },
        {
          id: "5",
          quantity: 25,
          deliveryAddress: {
            residenceName: "Lakeside Apartments",
            floorNumber: "4",
            doorNumber: "16",
          },
          paymentMethod: "mpesa",
          status: "cancelled",
          totalAmount: 750,
          createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
          deliveredAt: new Date(Date.now() - 86400000 * 4), // 4 days ago
        },
      ];

      // Only set orders if the store is empty (simulating initial load)
      // Or you can always set them to simulate fresh data each time
      if (get().orders.length === 0) {
        set({ orders: mockOrders, isLoading: false });
      } else {
        // Simulate updating existing orders with potential changes
        const updatedOrders = get().orders.map((order) => {
          const mockOrder = mockOrders.find((m) => m.id === order.id);
          return mockOrder ? { ...order, ...mockOrder } : order;
        });
        set({ orders: updatedOrders, isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },

  updateOrderStatus: (orderId: string, status: Order["status"]) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              ...(status === "delivered" && { deliveredAt: new Date() }),
            }
          : order
      ),
    }));
  },

  getOrderById: (orderId: string) => {
    return get().orders.find((order) => order.id === orderId);
  },

  addReview: (orderId: string, rating: number, review: string) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, rating, review } : order
      ),
    }));
  },

  updateTrackingLocation: (
    orderId: string,
    location: { latitude: number; longitude: number }
  ) => {
    set((state) => ({
      orders: state.orders.map((order) =>
        order.id === orderId ? { ...order, trackingLocation: location } : order
      ),
    }));
  },
}));
