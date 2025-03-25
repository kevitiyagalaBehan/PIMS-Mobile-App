import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  PortfolioSummary: { authToken: string; accountId: string };
  AssetAllocation: { authToken: string; accountId: string };
  Portfolio: undefined;
};

export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type PortfolioSummaryScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PortfolioSummary'>;
export type AssetAllocationScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AssetAllocation'>;
