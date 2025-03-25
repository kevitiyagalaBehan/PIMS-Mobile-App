import { RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  Portfolio: undefined;
  AssetAllocation: { authToken: string; accountId: string };
  PortfolioSummary: { authToken: string; accountId: string };
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export type AssetAllocationProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "AssetAllocation">;
  route: RouteProp<RootStackParamList, "AssetAllocation">;
};

export type PortfolioSummaryProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "PortfolioSummary">;
  route: RouteProp<RootStackParamList, "PortfolioSummary">;
};
