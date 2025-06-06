import {
  LoginResponse,
  LinkedUsers,
  SuperFundDetails,
  TopTenInvestmentDetails,
  TopTenInvestmentDetailsFamily,
  PortfolioData,
  AssetAllocationSummary,
  ContributionCap,
  PensionLimitDetails,
  EstimatedMemberDetails,
  InvestmentPerformanceDetails,
  ForgotPassword,
  AccountEntity,
  ClientAccountDetails,
  ConsolidateData,
  AccountListResponse,
  AccountIndividual,
  EsignDocument,
  CashTransactions,
} from "../navigation/types";
import Constants from "expo-constants";

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
    const response = await fetch(`${apiBaseUrl}/Auth/mobile/android`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
      return {
        authToken: data.auth_token,
        accountId: data.account_id,
        accountType: data.account_type,
      };
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

export const getSuperFundName = async (
  authToken: string,
  accountId: string
): Promise<ClientAccountDetails[] | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/ClientAccountDetails/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch linked users");
    }

    const data: ClientAccountDetails[] = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching linked users:", error);
    return null;
  }
};

export const getLinkedUsers = async (
  authToken: string
): Promise<LinkedUsers | null> => {
  try {
    //console.log("Fetching linked users with token:", authToken);
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

export const getEntityAccounts = async (
  authToken: string,
  accountId: string,
  parentAccount?: AccountEntity
): Promise<AccountEntity[]> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/FamilyGroupDashboard/AccountList/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch account entities");
    }

    const data: AccountListResponse = await response.json();

    const filteredEntities =
      data.entities?.filter((entity) => entity.activePortfolio === "Yes") || [];

    if (parentAccount) {
      return [parentAccount, ...filteredEntities];
    }

    return filteredEntities;
  } catch (error) {
    console.error("Error fetching account entities:", error);
    return parentAccount ? [parentAccount] : [];
  }
};

export const getAccountList = async (
  authToken: string,
  accountId: string
): Promise<{
  entities: AccountEntity[];
  individuals: AccountIndividual[];
}> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/FamilyGroupDashboard/AccountList/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch account list");
    }

    const data: AccountListResponse = await response.json();

    return {
      entities: data.entities || [],
      individuals: data.individuals || [],
    };
  } catch (error) {
    console.error("Error fetching account list:", error);

    return {
      entities: [],
      individuals: [],
    };
  }
};

export const getAssetAllocationSummaryOther = async (
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
    //console.log("Raw API response:", data);
    return data;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

export const getAssetAllocationSummaryFamily = async (
  authToken: string,
  accountId: string
): Promise<AssetAllocationSummary[] | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/FamilyGroupDashboard/AssetAllocationSummary/${accountId}`,
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

    const data: AssetAllocationSummary[] = await response.json();
    return data;
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
    console.error("Fetch failed:", error);
    return null;
  }
};

export const getTopTenInvestmentDetailsFamily = async (
  authToken: string,
  accountId: string
): Promise<TopTenInvestmentDetailsFamily[] | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/FamilyGroupDashboard/TopTenInvestments/${accountId}`,
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

    return data as TopTenInvestmentDetailsFamily[];
  } catch (error) {
    console.error("Fetch failed:", error);
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

export const getConsolidateData = async (
  authToken: string,
  accountId: string
): Promise<ConsolidateData[] | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/FamilyGroupDashboard/ConsolidateData/${accountId}`,
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

    return data as ConsolidateData[];
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

export const getClientAccountDetails = async (
  authToken: string,
  accountId: string
): Promise<ClientAccountDetails[] | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/ClientAccountDetails/${accountId}`,
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

    return data as ClientAccountDetails[];
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

export const getEsignDocuments = async (
  authToken: string,
  accountId: string
): Promise<EsignDocument[] | null> => {
  try {
    const response = await fetch(
      `${apiBaseUrl}/Esigning/CurrentUserV3/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.status}`);
    }
    const data = await response.json();
    //console.log("Data:", data);
    return data as EsignDocument[];
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

export const getCashTransactions = async (
  authToken: string,
  accountId: string
): Promise<CashTransactions[] | null> => {
  try {
    const today = new Date();
    const lastYear = new Date();
    lastYear.setFullYear(today.getFullYear() - 1);

    const formatDate = (date: Date) => date.toISOString().split("T")[0];

    const startDate = formatDate(lastYear);
    const endDate = formatDate(today);

    const response = await fetch(
      `${apiBaseUrl}/CashTransactionsV2/${accountId}/${startDate}/${endDate}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status}`);
    }

    const data = await response.json();
    return data as CashTransactions[];
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
