import axios from "axios";

const BASE_URL = "https://mob.pimsolutions.net.au/api";

export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${BASE_URL}/Auth/header`, {
      username,
      password,
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login Failed");
  }
};

export const fetchAssetAllocation = async (authToken, accountId) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/ClientDashboard/AssetAllocationSummary/${accountId}`,
      {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch data");
  }
};
