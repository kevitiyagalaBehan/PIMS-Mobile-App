import React from "react";
import {
  StyleSheet,
  ScrollView,
  RefreshControl,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";
import { useHomeData } from "../../hooks/useHomeDataFamily";
import {
  AssetAllocationFamily,
  Header,
  ConsolidatedAssetAllocation,
} from "../../components";
import { useAuth } from "../context/AuthContext";

export default function HomeScreenFamily() {
  const { width, height } = useWindowDimensions();
  const { refreshTrigger, refreshing, onRefresh } = useRefreshTrigger();
  const { userData } = useAuth();
  const { authToken = "", accountId = "" } = userData ?? {};
  const { data, loading, error } = useHomeData(
    authToken,
    accountId,
    refreshTrigger
  );
  const styles = getStyles(width, height);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: height * 0.1,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.bodySection}>
          <ConsolidatedAssetAllocation
            data={data}
            loading={loading}
            error={error}
          />
          <AssetAllocationFamily data={data} loading={loading} error={error} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#eee",
    },
    bodySection: {
      paddingHorizontal: width * 0.02,
    },
  });
