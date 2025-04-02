import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WindowSize } from "../navigation/types";
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
      <ScrollView style={styles.scrollView}>
        <Header />
        <PortfolioSummary />
      </ScrollView>
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
