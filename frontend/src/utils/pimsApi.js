export const API_BASE_URL = "https://mob.pimsolutions.net.au/api";

export const loginUser = async (username, password) => {
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
      return data.auth_token;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error("Login failed:", error);
    return null;
  }
};

export const getAssetAllocationSummary = async (authToken, accountId) => {
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

    const data = await response.json();
    if (data.assetCategories) {
      return data;
    } else {
      throw new Error(data.message || "Failed to fetch data");
    }
  } catch (error) {
    console.error("Fetch failed:", error);
    return null;
  }
};
