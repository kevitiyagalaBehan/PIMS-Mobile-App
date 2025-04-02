import { RouteProp } from "@react-navigation/native";
import { BottomTabNavigationProp as RNBottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { DrawerNavigationProp as RNDrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";

// Root Stack Navigation
export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

// Bottom Tab Navigation
export type BottomTabParamList = {
  Home: { authToken: string; accountId: string };
  Messages: { authToken: string; accountId: string };
  Menu: { authToken: string; accountId: string };
};

// Drawer Navigation
export type DrawerParamList = {
  MainTabs: { authToken: string; accountId: string };
  AssetAllocation: { authToken: string; accountId: string };
  PortfolioSummary: { authToken: string; accountId: string };
  TopTenInvestments: { authToken: string; accountId: string };
  InvestmentPerformance: { authToken: string; accountId: string };
  PortfolioBalance: { authToken: string; accountId: string };
  ContributionCap: { authToken: string; accountId: string };
  PensionLimit: { authToken: string; accountId: string };
  EstimatedMemberStatement: { authToken: string; accountId: string };
};

// Navigation Props
export type BottomTabNavigationProp<T extends keyof BottomTabParamList> =
  RNBottomTabNavigationProp<BottomTabParamList, T>;

export type DrawerNavigationProp<T extends keyof DrawerParamList> =
  RNDrawerNavigationProp<DrawerParamList, T>;

export type PortfolioSummaryRouteProp = RouteProp<
{ PortfolioSummary: { authToken: string; accountId: string } },
"PortfolioSummary"
>;

export type AssetAllocationScreenNavigationProp = StackNavigationProp<
RootStackParamList,
"Home"
>;

export interface LinkedUsers {
  fullName: string;
  isCurrent: boolean;
  assignedAccount?: string;
  assignedAccountType?: string;
  emailAddress?: string;
  role?: string;
  userId?: string;
}

export interface LoginResponse {
  authToken: string;
  accountId: string;
}

export interface AssetClass {
  assetClass: string;
  marketValue: number;
  percentage: number;
}

export interface AssetCategory {
  assetCategory: string;
  marketValue: number;
  percentage: number;
  assetClasses?: AssetClass[];
}

export interface AssetAllocationSummary {
  assetCategories: AssetCategory[];
  totalMarketValue: number;
  totalPercentage: number;
}

export interface ChartData {
  name: string;
  percentage: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export interface AssetAllocationProps {
  route: {
    params: {
      authToken?: string;
      accountId?: string;
    };
  };
  navigation: any;
}

export interface WindowSize {
  width: number;
  height: number;
}

export interface PortfolioData {
  assetCategories: AssetCategory[];
  totalMarketValue: number;
  totalPercentage: number;
}

export interface PortfolioSummaryProps {
  route: PortfolioSummaryRouteProp;
}

export interface SuperFundDetails {
  dataDownDate: string;
  year: number;
  clientTotal: number;
}
