import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getAssetAllocationSummary } from "../src/utils/pimsApi";
import { WindowSize, PortfolioData } from "../src/navigation/types";

export default function PortfolioSummary() {
  const { userData } = useAuth();
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
    <View>
      <Text style={styles.bodyText}>Portfolio Summary</Text>

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
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    loader: {
      marginTop: height * 0.25,
    },
    bodyText: {
      fontWeight: "bold",
      color: "#4A90E2",
      paddingHorizontal: width * 0.02,
      marginLeft: width * 0.001,
      marginTop: height * 0.05,
      fontSize: RFPercentage(3),
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
      marginVertical: height > width ? height * 0.005 : height * 0.015,
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
  });
