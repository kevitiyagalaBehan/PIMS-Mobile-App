import {
  LoginResponse,
  LinkedUsers,
  AssetAllocationSummary,
} from "../navigation/types";

export const API_BASE_URL = "https://mob.pimsolutions.net.au/api";

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

export const getLinkedUsers = async (
  authToken: string
): Promise<LinkedUsers | null> => {
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

    return data.find((user) => user.isCurrent === true) || null;
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
    return data.assetCategories ? data : null;
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};
