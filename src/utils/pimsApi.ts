export const API_BASE_URL = "https://mob.pimsolutions.net.au/api";

export interface LinkedUsers {
  fullName: string;
  isCurrent: boolean;
  assignedAccount?: string;
  assignedAccountType?: string;
  emailAddress?: string;
  role?: string;
  userId?: string;
}

interface LoginResponse {
  authToken: string;
  accountId: string;
}

interface SuperFundDetails {
  dataDownDate: string;
  year: number;
  clientTotal: number;
}

interface AssetClass {
  assetClass: string;
  marketValue: number;
  percentage: number;
}

interface AssetCategory {
  assetCategory: string;
  marketValue: number;
  percentage: number;
  assetClasses?: AssetClass[];
}

interface AssetAllocationSummary {
  assetCategories: AssetCategory[];
  totalMarketValue: number;
  totalPercentage: number;
}

export const loginUser = async (
  username: string,
  password: string
): Promise<LoginResponse | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/header`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
      mode: "cors",
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

export const getLinkedUsers = async (authToken: string): Promise<LinkedUsers | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/Auth/LinkedUsers`, {
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

    //console.log("Fetched linked users:", data);

    const currentUser = data.find((user) => user.isCurrent === true);

    if (currentUser) {
      return currentUser;
    } else {
      console.log("No current user found in the response.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching linked users:", error);
    return null;
  }
};


export const getAssetAllocationSummary = async (
  authToken: string,
  accountId: string
): Promise<AssetAllocationSummary | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/ClientDashboard/AssetAllocationSummary/${accountId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: AssetAllocationSummary = await response.json();

    if (data.assetCategories) {
      return data;
    } else {
      throw new Error("Failed to fetch asset allocation data");
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};

export const getSuperFundDetails = async (
  authToken: string,
  accountId: string
): Promise<SuperFundDetails | null> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/InvestmentGraphPortfolioBalanceSummaryGraph/${accountId}`,
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

    if (Array.isArray(data) && data.length > 0) {
      const portfolioData = data[0];
      if (portfolioData.year && portfolioData.clientTotal) {
        return portfolioData;
      } else {
        throw new Error("Invalid response structure");
      }
    } else {
      throw new Error("Invalid response structure");
    }
  } catch (error) {
    console.error("Error fetching portfolio balance summary:", error);
    return null;
  }
};
