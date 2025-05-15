import React from "react";
import { StyleSheet, RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { PortfolioBalanceSummary, HeaderWithMenu } from "../../components";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";
import { useWindowSize } from "../../hooks/useWindowSize";
import { View } from "react-native";

export default function PortfolioBalanceScreen() {
  const { width } = useWindowSize();
  const { refreshTrigger, refreshing, onRefresh } = useRefreshTrigger();

  const styles = getStyles(width);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithMenu />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.bodySection}>
          <PortfolioBalanceSummary
            refreshTrigger={refreshTrigger}
            refreshing={refreshing}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#eee",
    },
    bodySection: {
      paddingHorizontal: width * 0.02,
    },
  });
