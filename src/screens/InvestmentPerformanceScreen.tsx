import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  FlatList,
  RefreshControl,
  View,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { SafeAreaView } from "react-native-safe-area-context";
import { WindowSize } from "../navigation/types";
import { Header, InvestmentPerformance, Drawer } from "../../components";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";

export default function InvestmentPerformanceScreen() {
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );

  const { refreshTrigger, refreshing, onRefresh } = useRefreshTrigger();

  useEffect(() => {
    const updateSize = () => setWindowSize(Dimensions.get("window"));
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription?.remove();
  }, []);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  return (
    <SafeAreaView style={styles.container}>
      <Drawer />
      <FlatList
        data={[]}
        keyExtractor={() => "dummy"}
        renderItem={null}
        ListHeaderComponent={
          <View>
            <Header refreshTrigger={refreshTrigger} refreshing={refreshing} />
            <InvestmentPerformance
              refreshTrigger={refreshTrigger}
              refreshing={refreshing}
            />
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: width * 0.02,
      flex: 1,
      backgroundColor: "#fff",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      //marginBottom: height * 0.01,
    },
    backButtonText: {
      color: "#4A90E2",
      fontSize: RFPercentage(2),
      marginLeft: 5,
    },
  });
