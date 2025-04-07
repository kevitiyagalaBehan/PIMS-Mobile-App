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
import { WindowSize, PortfolioData, Props } from "../src/navigation/types";

export default function PortfolioSummary({ refreshTrigger, refreshing }: Props) {
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
  }, [userData?.authToken, userData?.accountId, refreshTrigger, refreshing]);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (!userData || !userData.authToken || !userData.accountId) {
    //console.error("Error: userData or required fields are missing");
    return null;
  }

  const dataWithTotal = portfolioSummary
  ? [
      ...portfolioSummary.assetCategories,
      {
        assetCategory: "TOTAL",
        marketValue: portfolioSummary.totalMarketValue,
        percentage: portfolioSummary.totalPercentage,
      },
    ]
  : [];

  return (
    <View style={styles.container}>
      <Text style={styles.bodyText}>Portfolio Summary</Text>

      {refreshing ? (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : portfolioSummary ? (
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText1, { flex: 1 }]}>
              Asset Class
            </Text>
            <Text style={[styles.tableHeaderText2, { flex: 1 }]}>
              Current $
            </Text>
            <Text
              style={[styles.tableHeaderText2, styles.rightAlign, { flex: 1 }]}
            >
              Current %
            </Text>
          </View>

          <FlatList
            data={dataWithTotal}
            keyExtractor={(item) => item.assetCategory}
            renderItem={({ item }) => (
              <>
                <View style={[styles.row, styles.categoryRow]}>
                  <Text style={[styles.cell, styles.boldText, { flex: 1 }]}>
                    {item.assetCategory.toUpperCase()}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      styles.rightAlign,
                      styles.boldText,
                      { flex: 1 },
                    ]}
                  >
                    {item.marketValue.toLocaleString()}
                  </Text>
                  <Text
                    style={[
                      styles.cell,
                      styles.rightAlign,
                      styles.boldText,
                      { flex: 1 },
                    ]}
                  >
                    {item.percentage.toFixed(2)}
                  </Text>
                </View>

                {item.assetClasses &&
                  item.assetClasses.map((subItem, index) => (
                    <View key={index} style={styles.row}>
                      <Text style={[styles.cell, { flex: 1 }]}>
                        {subItem.assetClass}
                      </Text>
                      <Text
                        style={[styles.cell, styles.rightAlign, { flex: 1 }]}
                      >
                        {subItem.marketValue.toLocaleString()}
                      </Text>
                      <Text
                        style={[styles.cell, styles.rightAlign, { flex: 1 }]}
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
    container: {
      flex: 1,
    },
    loader: {
      marginTop: height * 0.20,
    },
    bodyText: {
      fontWeight: "bold",
      color: "#4A90E2",
      paddingHorizontal: width * 0.03,
      //marginLeft: width * 0.001,
      marginTop: height * 0.05,
      fontSize: RFPercentage(3),
    },
    tableContainer: {
      marginVertical: height > width ? height * 0.005 : height * 0.015,
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2.5),
      textAlign: "center",
      marginTop: height * 0.3,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#4A90E2",
      paddingVertical: height * 0.008,
      paddingHorizontal: width * 0.02,
      //marginVertical: height > width ? height * 0.005 : height * 0.015,
      borderRadius: 8,
      //marginBottom: height * 0.01,
    },
    tableHeaderText1: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
      textAlign: "left",
      paddingHorizontal: width * 0.01,
    },
    tableHeaderText2: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
      textAlign: "right",
      paddingHorizontal: width * 0.01,
    },
    row: {
      flexDirection: "row",
      paddingVertical: height * 0.008,
      paddingHorizontal: width * 0.02,
      borderBottomWidth: 1,
      borderBottomColor: "#fff",
      alignItems: "center",
      backgroundColor: "#eee",
      borderRadius: 8,
    },
    categoryRow: {
      backgroundColor: "#D0F0FF",
      borderRadius: 8,
    },
    leftAlign: {
      textAlign: "left",
    },
    rightAlign: {
      textAlign: "right",
    },
    cell: {
      fontSize: width * 0.035,
      color: "#333",
      paddingHorizontal: width * 0.01,
    },
    boldText: {
      fontWeight: "bold",
    },
  });
