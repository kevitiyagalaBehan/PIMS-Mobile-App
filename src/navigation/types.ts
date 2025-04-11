import { RouteProp } from "@react-navigation/native";
import { BottomTabNavigationProp as RNBottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { DrawerNavigationProp as RNDrawerNavigationProp } from "@react-navigation/drawer";
import { StackNavigationProp } from "@react-navigation/stack";
import { ReactNode } from "react";

export type AuthContextType = {
  userData: LoginResponse | null;
  setUserData: React.Dispatch<React.SetStateAction<LoginResponse | null>>;
  currentUserName: string | null;
  setCurrentUserName: React.Dispatch<React.SetStateAction<string | null>>;
};

export type AuthProviderProps = {
  children: ReactNode;
};

// Root Stack Navigation
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
};

// Bottom Tab Navigation
export type BottomTabParamList = {
  Home: { authToken: string; accountId: string };
  Notifications: { authToken: string; accountId: string };
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

export type SubScreenNavigationProp = StackNavigationProp<
RootStackParamList,
"Main"
>;

export type Props = {
  refreshing: boolean;
  refreshTrigger: number;
};

export type NavigationProps = {
  replace: (screen: string) => void;
};

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

export interface TopTenInvestmentDetails {
  code: string;
  description: string;
  quantity: number;
  value: number;
  percentage: number;
}

export type PortfolioItem = {
  year: number;
  value: number;
  dataDownDate: string;
};

// Selected item when clicking on a bar
export type SelectedData = {
  clientTotal: number;
  dataDownDate: string;
  year: number;
};

export interface ContributionCap {
  accountName: string;
  financialYear: {
    endDate: string;
    financialYear: string;
    id: string;
    isCurrent: boolean;
    startDate: string;
  };
  members: {
    age: number;
    birthDate: string;
    concessionalAvailable: number;
    concessionalMaximum: number;
    concessionalPaidToDate: number;
    name: string;
    nonConcessionalAvailable: number;
    nonConcessionalMaximum: number;
    nonConcessionalPaidToDate: number;
  }[];
}

export interface PensionLimitDetails {
  accountName: string;
  financialYear: {
    endDate: string;
    financialYear: string;
    id: string;
    isCurrent: boolean;
    startDate: string;
  };
  members: {
    age: number;
    birthDate: string;
    drawdownsToDate: number;
    maximumPensionAmount: number;
    minimumPaidToDate: number;
    minimumPensionAmount: number;
    name: string;
    remainingToMaximum: number;
    requiredForMinimum: number;
  }[];
}

export interface EstimatedMemberDetails {
  accumulation: number;
  memberName: string;
  pension: number;
  taxFree: number;
  taxableTaxed: number;
  taxableUntaxed: number;
}

export interface InvestmentPerformanceDetails {
  cumulativePercent: number;
  date: string;
}

