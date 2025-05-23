import React from "react";
import { StyleSheet, ScrollView, RefreshControl, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";
import { useHomeData } from "../../hooks/useHomeDataOther";
import { Header, PortfolioSummaryOther, AssetAllocationOther } from "../../components";
import { useAuth } from "../context/AuthContext";
import { useWindowSize } from "../../hooks/useWindowSize";

export default function HomeScreenOther() {
  const { width, height } = useWindowSize();
  const { refreshTrigger, refreshing, onRefresh } = useRefreshTrigger();
  const { userData } = useAuth();
  const { authToken, accountId } = userData ?? {};
  const { data, loading, error } =
    authToken && accountId
      ? useHomeData(authToken, accountId, refreshTrigger)
      : { data: null, loading: true, error: null };

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
          <PortfolioSummaryOther data={data} loading={loading} error={error} />
          <AssetAllocationOther data={data} loading={loading} error={error} />
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
