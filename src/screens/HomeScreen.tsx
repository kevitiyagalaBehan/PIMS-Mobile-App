import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, Dimensions, ScrollView } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
//import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
//import { useAuth } from "../context/AuthContext";
//import { getLinkedUsers, getAssetAllocationSummary } from "../utils/pimsApi";
import { WindowSize, PortfolioData } from "../navigation/types";
import { Header, PortfolioSummary } from "../../components";

export default function HomeScreen() {
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );

  useEffect(() => {
    const updateSize = () => {
      setWindowSize(Dimensions.get("window"));
    };
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription.remove();
  }, []);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <PortfolioSummary />
    </SafeAreaView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: width * 0.02,
      flex: 1,
      backgroundColor: "transparent",
    },
    scrollView: {
      flexGrow: 1,
      paddingBottom: height * 0.1,
    },
  });
