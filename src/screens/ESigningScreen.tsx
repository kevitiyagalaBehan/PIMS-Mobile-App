import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ESigning } from "../../components";
import { useWindowSize } from "../../hooks/useWindowSize";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function ESigningScreen() {
  const { refreshTrigger, refreshing, onRefresh } = useRefreshTrigger();
  const { width, height } = useWindowSize();
  const styles = getStyles(width, height);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Signing</Text>
      </View>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.bodySection}>
          <ESigning refreshTrigger={refreshTrigger} refreshing={refreshing} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: "#fff",
    },
    header: {
      height: height * 0.08,
      justifyContent: "center",
      paddingHorizontal: width * 0.04,
      backgroundColor: "#fff",
    },
    headerText: {
      fontSize: RFPercentage(2.6),
      fontWeight: "bold",
      color: "#1B77BE",
    },
    bodySection: {
      flex: 1,
      paddingHorizontal: width * 0.02,
      backgroundColor: "#eee",
    },
  });
