import { useCallback, useState } from "react";

export function useRefreshTrigger(onRefreshCallback?: () => void) {
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(Date.now());

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshTrigger(Date.now());
    onRefreshCallback?.();
    setTimeout(() => setRefreshing(false), 1000);
  }, [onRefreshCallback]);

  return {
    refreshTrigger,
    refreshing,
    onRefresh,
    setRefreshing,
  };
}
