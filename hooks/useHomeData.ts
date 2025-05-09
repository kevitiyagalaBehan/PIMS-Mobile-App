import { useState, useEffect } from "react";
import { getAssetAllocationSummary } from "../src/utils/pimsApi";
import { PortfolioData } from "../src/navigation/types";

export function useHomeData(authToken: string, accountId: string, refreshTrigger: number) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAssetAllocationSummary(authToken, accountId);
        if (response) {
          setData(response);
        } else {
          setError("No data received");
        }
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authToken, accountId, refreshTrigger]);

  return { data, loading, error };
}
