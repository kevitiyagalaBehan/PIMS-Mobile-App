import React from "react";
import { StyleSheet, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ContributionCapSummary } from "../../components";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";
import { useWindowSize } from "../../hooks/useWindowSize";
import HeaderWithMenu from "../../components/HeaderWithMenu";

export default function ContributionCapSummaryScreen() {
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
          <ContributionCapSummary
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
