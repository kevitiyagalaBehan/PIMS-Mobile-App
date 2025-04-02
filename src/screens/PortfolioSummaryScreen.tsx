import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { getLinkedUsers, getAssetAllocationSummary } from "../utils/pimsApi";
import { WindowSize, PortfolioData } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";

type PortfolioSummaryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function PortfolioSummaryScreen() {
  const navigation = useNavigation<PortfolioSummaryScreenNavigationProp>();
  const { userData, setCurrentUserName, currentUserName } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      setWindowSize(Dimensions.get("window"));
    };
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData?.authToken) {
        setCurrentUserName(null);
        return;
      }

      const userName = await getLinkedUsers(userData.authToken);

      if (userName && userName.fullName) {
        setCurrentUserName(userName.fullName);
      } else {
        setCurrentUserName("User not found");
      }
    };

    fetchUserData();
  }, [userData?.authToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.authToken || !userData?.accountId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const [summaryData] = await Promise.all([
        getAssetAllocationSummary(userData.authToken, userData.accountId),
      ]);

      if (summaryData) {
        setPortfolioSummary(summaryData);
      } else {
        setError("Failed to load portfolio summary");
      }

      setLoading(false);
    };

    fetchData();
  }, [userData]);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (!userData || !userData.authToken || !userData.accountId) {
    console.error("Error: userData or required fields are missing");
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#4A90E2" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

      <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
        <Text style={styles.userNameText}>
          {currentUserName ? `Hello, ${currentUserName}` : "Loading user..."}
        </Text>
      </LinearGradient>

      <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
        <Text style={styles.valueText}>
          {portfolioSummary
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(portfolioSummary.totalMarketValue)
            : "N/A"}
        </Text>

        <Text style={styles.dateText}>
          Current value as at {new Date().toLocaleDateString("en-GB")}
        </Text>
      </LinearGradient>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : portfolioSummary ? (
        <View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 4 }]}>
              Asset Class
            </Text>
            <Text style={[styles.tableHeaderText, { flex: 3.15 }]}>
              Current $
            </Text>
            <Text
              style={[styles.tableHeaderText, styles.rightAlign, { flex: 2.5 }]}
            >
              Current %
            </Text>
          </View>

          <FlatList
            data={[
              ...portfolioSummary.assetCategories,
              {
                assetCategory: "TOTAL",
                marketValue: portfolioSummary.totalMarketValue,
                percentage: portfolioSummary.totalPercentage,
              },
            ]}
            keyExtractor={(item) => item.assetCategory}
            renderItem={({ item }) => (
              <>
                <View style={[styles.row, styles.categoryRow]}>
                  <Text style={[styles.cell, styles.boldText, { flex: 4 }]}>
                    {item.assetCategory.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      styles.rightAlign,
                      styles.boldText,
                      { flex: 3 },
                    ]}
                  >
                    {item.marketValue.toLocaleString()}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      styles.rightAlign,
                      styles.boldText,
                      { flex: 3.8 },
                    ]}
                  >
                    {item.percentage.toFixed(2)}
                  </Text>
                </View>

                {item.assetClasses &&
                  item.assetClasses.map((subItem, index) => (
                    <View key={index} style={styles.row}>
                      <Text style={[styles.cell, { flex: 4 }]}>
                        {subItem.assetClass}
                      </Text>
                      <Text
                        style={[styles.cell, styles.rightAlign, { flex: 3 }]}
                      >
                        {subItem.marketValue.toLocaleString()}
                      </Text>
                      <Text
                        style={[styles.cell, styles.rightAlign, { flex: 3.8 }]}
                      >
                        {subItem.percentage.toFixed(2)}
                      </Text>
                    </View>
                  ))}
              </>
            )}
          />
        </View>
      ) : null}
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
    header: {
      marginTop: height * 0.005,
      width: "100%",
      height: height * 0.085,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      elevation: 5,
    },
    userNameText: {
      fontSize: RFPercentage(4),
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
    },
    valueText: {
      fontSize: RFPercentage(4),
      fontWeight: "bold",
      color: "white",
    },
    dateText: {
      color: "white",
      fontSize: RFPercentage(2),
    },
    loader: {
      marginTop: height * 0.25,
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2.5),
      textAlign: "center",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#4A90E2",
      paddingVertical: height > width ? height * 0.018 : height * 0.015,
      paddingHorizontal: width * 0.03,
      marginVertical: height > width ? height * 0.05 : height * 0.015,
      marginBottom: height * 0.01,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    tableHeaderText: {
      color: "white",
      fontWeight: "bold",
      fontSize: width * 0.04,
      textTransform: "uppercase",
    },
    row: {
      flexDirection: "row",
      paddingVertical: height * 0.006,
      paddingHorizontal: width * 0.03,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      alignItems: "center",
    },
    categoryRow: {
      backgroundColor: "#E6F0FF",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
    leftAlign: {
      textAlign: "left",
    },
    rightAlign: {
      textAlign: "right",
    },
    cell: {
      fontSize: width * 0.04,
      color: "#333",
      textAlign: "left",
      paddingVertical: height * 0.008,
    },
    boldText: {
      fontWeight: "bold",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginBottom: 10,
    },
    backButtonText: {
      color: "#4A90E2",
      fontSize: RFPercentage(2),
      marginLeft: 5,
    },
  });

{/*
  
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";
import { getAssetAllocationSummary } from "../utils/pimsApi";
import { PortfolioSummaryProps, PortfolioData, } from "../navigation/types";

export default function PortfolioSummary({ route }: PortfolioSummaryProps) {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { authToken, accountId } = route.params;
  const [windowSize, setWindowSize] = useState(Dimensions.get("window"));

  useEffect(() => {
    if (!authToken || !accountId) {
      console.error("Missing authToken or accountId");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const result: PortfolioData | null = await getAssetAllocationSummary(
          authToken,
          accountId
        );
        if (result !== null) {
          setData(result);
        } else {
          console.error("API response is null");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [authToken, accountId]);

  useEffect(() => {
    const updateSize = () => setWindowSize(Dimensions.get("window"));
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription?.remove();
  }, []);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 4 }]}>Asset Class</Text>
        <Text style={[styles.tableHeaderText, { flex: 3.15 }]}>Current $</Text>
        <Text
          style={[styles.tableHeaderText, styles.rightAlign, { flex: 2.5 }]}>
          Current %
        </Text>
      </View>

      <FlatList
        data={[
          ...data!.assetCategories,
          {
            assetCategory: "TOTAL",
            marketValue: data!.totalMarketValue,
            percentage: data!.totalPercentage,
          },
        ]}
        keyExtractor={(item) => item.assetCategory}
        renderItem={({ item }) => (
          <>
            <View style={[styles.row, styles.categoryRow]}>
              <Text
                style={[styles.cell, styles.leftAlign, styles.boldText, { flex: 4 }]}>
                {item.assetCategory.toUpperCase()}
              </Text>
              <Text
                style={[styles.cell, styles.rightAlign, styles.boldText, { flex: 3 }]}>
                {item.marketValue.toLocaleString()}
              </Text>
              <Text
                style={[styles.cell, styles.rightAlign, styles.boldText, { flex: 3.8 }]}>
                {item.percentage.toFixed(2)}
              </Text>
            </View>

            {item.assetClasses &&
              item.assetClasses.map((subItem, index) => (
                <View key={index} style={styles.row}>
                  <Text style={[styles.cell, styles.leftAlign, { flex: 4 }]}>
                    {subItem.assetClass}
                  </Text>
                  <Text style={[styles.cell, styles.rightAlign, { flex: 3 }]}>
                    {subItem.marketValue.toLocaleString()}
                  </Text>
                  <Text style={[styles.cell, styles.rightAlign, { flex: 3.8 }]}>
                    {subItem.percentage.toFixed(2)}
                  </Text>
                </View>
              ))}
          </>
        )}
      />
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5",
      paddingHorizontal: width * 0.02,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#4A90E2",
      paddingVertical: height > width ? height * 0.025 : height * 0.015,
      paddingHorizontal: width * 0.03,
      marginVertical: height > width ? height * 0.03 : height * 0.015,
      marginBottom: height * 0.01,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 2,
    },
    tableHeaderText: {
      color: "white",
      fontWeight: "bold",
      fontSize: width * 0.04,
      textTransform: "uppercase",
    },
    row: {
      flexDirection: "row",
      paddingVertical: height * 0.02,
      paddingHorizontal: width * 0.03,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
      alignItems: "center",
    },
    categoryRow: {
      backgroundColor: "#E6F0FF",
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
    leftAlign: {
      textAlign: "left",
    },
    rightAlign: {
      textAlign: "right",
    },
    cell: {
      fontSize: width * 0.04,
      color: "#333",
      textAlign: "left",
      paddingVertical: height * 0.008,
    },
    boldText: {
      fontWeight: "bold",
    },
  });

  
  */}