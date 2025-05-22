import React, { useEffect } from "react";
import { StyleSheet, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InvestmentPerformance, HeaderWithMenu } from "../../components";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";
import { useWindowSize } from "../../hooks/useWindowSize";
import * as ScreenOrientation from "expo-screen-orientation";

export default function InvestmentPerformanceScreen() {
  const { width } = useWindowSize();
  const { refreshTrigger, refreshing, onRefresh } = useRefreshTrigger();
  const styles = getStyles(width);

  useEffect(() => {
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.DEFAULT);

    return () => {
      ScreenOrientation.unlockAsync();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithMenu />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.bodySection}>
          <InvestmentPerformance
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
