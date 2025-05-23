import { useState, useEffect } from "react";
import { getAssetAllocationSummaryOther } from "../src/utils/pimsApi";
import { PortfolioDataOther } from "../src/navigation/types";

export function useHomeData(authToken: string, accountId: string, refreshTrigger: number) {
  const [data, setData] = useState<PortfolioDataOther | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getAssetAllocationSummaryOther(authToken, accountId);
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
