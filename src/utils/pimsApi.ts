import {
  LoginResponse,
  LinkedUsers,
  SuperFundDetails,
  TopTenInvestmentDetails,
  PortfolioData,
  ContributionCap,
  PensionLimitDetails,
  EstimatedMemberDetails,
  InvestmentPerformanceDetails,
  ForgotPassword,
} from "../navigation/types";
import Constants from 'expo-constants';

const apiBaseUrl = Constants.expoConfig?.extra?.apiBaseUrl as string;
const appEnv = Constants.expoConfig?.extra?.appEnv as string;
const projectId = Constants.expoConfig?.extra?.eas?.projectId as string;

//console.log("API:", apiBaseUrl);
//console.log("ENV:", appEnv);
//console.log("PROJECT_ID:", projectId);

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse | null> => {
  try {
    const response = await fetch(`${apiBaseUrl}/Auth/header`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      return { authToken: data.auth_token, accountId: data.account_id };
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export const requestPasswordReset = async (
  email: string
): Promise<ForgotPassword | null> => {
  try {
    const response = await fetch(`${apiBaseUrl}/Auth/ResetPasswordRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Password reset request failed");
    }

    return await response.json();
  } catch (error) {
    console.error("Error requesting password reset:", error);
    throw error;
  }
};

export const getLinkedUsers = async (
  authToken: string
): Promise<LinkedUsers | null> => {
  try {
    const response = await fetch(`${apiBaseUrl}/Auth/LinkedUsers`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch linked users");
    }

    const data: LinkedUsers[] = await response.json();

    return data.find((user) => user.isCurrent === true) || null;
  } catch (error) {
    console.error("Error fetching linked users:", error);
    return null;
  }
};

export const getAssetAllocationSummary = async (
  authToken: string,
  accountId: string
): Promise<PortfolioData | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/ClientDashboard/AssetAllocationSummary/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: PortfolioData = await response.json();
    return data.assetCategories ? data : null;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

export const getSuperFundDetails = async (
  authToken: string,
  accountId: string
): Promise<SuperFundDetails[] | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/InvestmentGraphPortfolioBalanceSummaryGraph/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    //console.log("Super Fund Data:", data);

    if (Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error fetching portfolio balance summary:", error);
    return null;
  }
};

export const getTopTenInvestmentDetails = async (
  authToken: string,
  accountId: string
): Promise<TopTenInvestmentDetails[] | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/ClientDashboard/TopTenInvestments/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Expected array response");
    }

    return data as TopTenInvestmentDetails[];
  } catch (error) {
    console.error(
      "Fetch failed:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
};

export const getContributionCapSummary = async (
  authToken: string,
  accountId: string
): Promise<ContributionCap | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/ClientDashboard/ContributionCapSummary/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: ContributionCap = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

export const getPensionLimitSummary = async (
  authToken: string,
  accountId: string
): Promise<PensionLimitDetails | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/ClientDashboard/PensionLimitSummary/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data: PensionLimitDetails = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

export const getEstimatedMemberStatement = async (
  authToken: string,
  accountId: string,
  fromDate: Date,
  toDate: Date
): Promise<EstimatedMemberDetails | null> => {
  try {
    const formatDate = (date: Date) => encodeURIComponent(date.toUTCString());

    const formattedFromDate = formatDate(fromDate);
    const formattedToDate = formatDate(toDate);

    const url = `${apiBaseUrl}/ClientDashboard/EstimatedMemberStatement/${accountId}/${formattedFromDate}/${formattedToDate}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: EstimatedMemberDetails = await response.json();
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

export const getInvestmentPerformance = async (
  authToken: string,
  accountId: string
): Promise<InvestmentPerformanceDetails[] | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/ClientDashboard/InvestmentPerformance/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Expected array response");
    }

    return data as InvestmentPerformanceDetails[];
  } catch (error) {
    console.error(
      "Fetch failed:",
      error instanceof Error ? error.message : String(error)
    );
    return null;
  }
};
