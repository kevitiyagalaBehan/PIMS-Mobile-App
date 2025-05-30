import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { ReactNode } from "react";

export type AuthContextType = {
  userData: LoginResponse | null;
  setUserData: React.Dispatch<React.SetStateAction<LoginResponse | null>>;
  currentUserName: string | null;
  setCurrentUserName: React.Dispatch<React.SetStateAction<string | null>>;
  currentAccountName: string | null;
  setCurrentAccountName: React.Dispatch<React.SetStateAction<string | null>>;
  entityAccounts: AccountEntity[];
  setEntityAccounts: React.Dispatch<React.SetStateAction<AccountEntity[]>>;

  resetAuthState: () => void;
};

export type AuthProviderProps = {
  children: ReactNode;
};

// Root Stack Navigation
export type RootStackParamList = {
  Login: undefined;
  Other: undefined;
  Family: undefined;
};

// Bottom Tab Navigation
export type BottomTabParamListOther = {
  HomeOther: { authToken: string; accountId: string };
  Inbox: { authToken: string; accountId: string };
  Sign: { authToken: string; accountId: string };
  Menu: { authToken: string; accountId: string };
};

export type BottomTabParamListFamily = {
  HomeFamily: { authToken: string; accountId: string };
  Inbox: { authToken: string; accountId: string };
  Sign: { authToken: string; accountId: string };
  Menu: { authToken: string; accountId: string };
};

// Drawer Navigation
export type DrawerParamListOther = {
  MainTabs: { authToken: string; accountId: string };
  PortfolioSummary: { authToken: string; accountId: string };
  TopTenInvestments: { authToken: string; accountId: string };
  InvestmentPerformance: { authToken: string; accountId: string };
  PortfolioBalance: { authToken: string; accountId: string };
  ContributionCap: { authToken: string; accountId: string };
  PensionLimit: { authToken: string; accountId: string };
  EstimatedMemberStatement: { authToken: string; accountId: string };
};

export type DrawerParamListFamily = {
  MainTabs: { authToken: string; accountId: string };
  AccountList: { authToken: string; accountId: string };
  ConsolidatedAssetAllocation: { authToken: string; accountId: string };
  TopTenInvestmentsFamily: { authToken: string; accountId: string };
  ConsolidatedAccounts: { authToken: string; accountId: string };
};

export type InboxStackParamList = {
  InboxList: { authToken: string; accountId: string };
  InboxDetail: { queryId: string; title: string };
};

export type InboxStackNavigationProp<T extends keyof InboxStackParamList> =
  StackNavigationProp<InboxStackParamList, T>;

export type InboxRouteProp<T extends keyof InboxStackParamList> = RouteProp<
  InboxStackParamList,
  T
>;

export type PortfolioSummaryRouteProp = RouteProp<
  { PortfolioSummary: { authToken: string; accountId: string } },
  "PortfolioSummary"
>;

export type SubScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Other" | "Family"
>;

export type Props = {
  refreshing: boolean;
  refreshTrigger: number;
};

export type NavigationProps = {
  replace: (screen: string) => void;
};

export interface ClientAccountDetails {
  superFundName: string;
}

export interface LinkedUsers {
  fullName: string;
  isCurrent: boolean;
  //assignedAccount: string;
  assignedAccountType?: string;
  emailAddress?: string;
  role?: string;
  userId?: string;
}

//export type AccountType = "Family" | string;

export interface LoginResponse {
  authToken: string;
  accountId: string;
  accountType: string;
}

export interface AssetAllocationSummary {
  assetCategory: string;
  assetClass: string;
  marketValue: number;
  marketPercentage: number;
  order: number;
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

export interface PortfolioData {
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

export interface WindowSize {
  width: number;
  height: number;
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

export interface TopTenInvestmentDetailsFamily {
  code: string;
  id: string;
  owner: string;
  marketValue: number;
  marketPercentage: number;
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

export interface ForgotPassword {
  message: string;
  success: boolean;
}

export interface Comment {
  id: string;
  text: string;
  date: string;
  author: string;
}

export interface Inbox {
  id: string;
  title: string;
  lastCommentDate: string;
  comments: Comment[];
}

export interface AccountEntity {
  accountName: string;
  accountType: string;
  activePortfolio: string;
  id: string;
}

export interface AccountEntityResponse {
  entities: AccountEntity[];
  individuals: any[];
}

export interface AccountOption {
  key: string;
  value: string;
  accountType: string;
}

export interface ConsolidateData {
  clientCode: string;
  clientId: string;
  clientName: string;
  entityType: string;
  portfolioPercentage: number;
  portfolioValue: number;
}
