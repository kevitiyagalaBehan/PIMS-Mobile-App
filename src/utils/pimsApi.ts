export const API_BASE_URL = "https://mob.pimsolutions.net.au/api";

// Define login response structure
interface LoginResponse {
  authToken: string;
  accountId: string;
}

// Define asset class structure
interface AssetClass {
  assetClass: string;
  marketValue: number;
  percentage: number;
}

// Define asset category structure
interface AssetCategory {
  assetCategory: string;
  marketValue: number;
  percentage: number;
  assetClasses?: AssetClass[];
}

// Define Asset Allocation Summary response structure
interface AssetAllocationSummary {
  assetCategories: AssetCategory[];
  totalMarketValue: number;
  totalPercentage: number;
}

// Function to log in a user
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
