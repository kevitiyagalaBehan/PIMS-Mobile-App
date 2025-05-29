import React, { useEffect } from "react";
import { StyleSheet, RefreshControl, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { InvestmentPerformance, HeaderWithMenu } from "../../components";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";
import { useWindowSize } from "../../hooks/useWindowSize";
import * as ScreenOrientation from "expo-screen-orientation";

export default function InvestmentPerformanceScreen() {
  const { width, height } = useWindowSize();
  const { refreshTrigger, refreshing, onRefresh } = useRefreshTrigger();
  const styles = getStyles(width, height);

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
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: height * 0.1,
        }}
        showsVerticalScrollIndicator={false}
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
