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

export default function PortfolioSummary({ route }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
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
        const result = await getAssetAllocationSummary(authToken, accountId);
        if (result) {
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
          style={[styles.tableHeaderText, styles.rightAlign, { flex: 2.5 }]}
        >
          Current %
        </Text>
      </View>

      <FlatList
        data={[
          ...data.assetCategories,
          {
            assetCategory: "TOTAL",
            marketValue: data.totalMarketValue,
            percentage: data.totalPercentage,
          },
        ]}
        keyExtractor={(item) => item.assetCategory}
        renderItem={({ item }) => (
          <>
            <View style={[styles.row, styles.categoryRow]}>
              <Text
                style={[
                  styles.cell,
                  styles.leftAlign,
                  styles.boldText,
                  { flex: 4 },
                ]}
              >
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

const getStyles = (width, height) =>
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
