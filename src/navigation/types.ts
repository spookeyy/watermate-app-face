// import { Order } from './../store/orderStore';

// export type MainStackParamList = {
//   MainTabs: undefined;
//   OrderDetails: { orderId: string };
//   Payment: { orderId: string; amount: number; paymentMethod: string };
//   Tracking: { orderId: string };
//   Review: { orderId: string };
//   History: undefined;
//   Profile: undefined;
//   Home: undefined;
//   Order: undefined;
// };

// export type TabParamList = {
//   Home: undefined;
//   Order: undefined;
//   History: undefined;
//   Profile: undefined;
// };

// navigation/types.ts
import { NavigatorScreenParams } from '@react-navigation/native';

export type MainStackParamList = {
  MainTabs: NavigatorScreenParams<TabParamList>;
  OrderDetails: { orderId: string };
  Payment: { orderId: string; amount: number; paymentMethod: string };
  Tracking: { orderId: string };
  Review: { orderId: string };
};

export type TabParamList = {
  Home: undefined;
  Order: undefined;
  History: undefined;
  Profile: undefined;
};

// This combines all your param lists for type safety
export type RootStackParamList = MainStackParamList & TabParamList;
