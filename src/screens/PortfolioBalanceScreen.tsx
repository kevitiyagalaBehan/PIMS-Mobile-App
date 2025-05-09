import React from "react";
import { StyleSheet, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header, PortfolioBalanceSummary, Drawer } from "../../components";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";
import { useWindowSize } from "../../hooks/useWindowSize";

export default function PortfolioBalanceScreen() {
  const { width, height } = useWindowSize();
  const { refreshTrigger, refreshing, onRefresh } = useRefreshTrigger();

  const styles = getStyles(width, height);

  return (
    <SafeAreaView style={styles.container}>
      <Drawer />
      <Header />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <PortfolioBalanceSummary
          refreshTrigger={refreshTrigger}
          refreshing={refreshing}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginHorizontal: width * 0.02,
    },
  });
