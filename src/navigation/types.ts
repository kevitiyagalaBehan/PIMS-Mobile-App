import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BottomTabNavigationProp as RNBottomTabNavigationProp } from "@react-navigation/bottom-tabs";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined; 
};

// Define the Bottom Tab Navigator parameters
export type BottomTabParamList = {
  HomeTab: undefined;
  Notifications: undefined;
  Menu: undefined;
};

// Stack Navigation Prop for Authentication Flow
export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

// Bottom Tab Navigation Prop for screens inside the BottomTabNavigator
export type BottomTabNavigationProp<T extends keyof BottomTabParamList> =
  RNBottomTabNavigationProp<BottomTabParamList, T>;

export type AssetAllocationProps = {
    route: any; 
  };
  
