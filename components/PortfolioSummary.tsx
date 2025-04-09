import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getAssetAllocationSummary } from "../src/utils/pimsApi";
import { WindowSize, PortfolioData, Props } from "../src/navigation/types";

export default function PortfolioSummary({ refreshTrigger }: Props) {
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
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (!userData || !userData.authToken || !userData.accountId) {
    return null;
  }

  const dataWithTotal = portfolioSummary
    ? [
        ...portfolioSummary.assetCategories,
        {
          assetCategory: "TOTAL",
          marketValue: portfolioSummary.totalMarketValue,
          percentage: portfolioSummary.totalPercentage,
          assetClasses: [],
        },
      ]
    : [];

  if (loading) {
    return <Text style={styles.bodyText}>Loading...</Text>;
  }

  if (!portfolioSummary || error) {
    return <Text style={styles.errorText}>{error || "No data available"}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.bodyText}>Portfolio Summary</Text>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText1, { flex: 1 }]}>Asset Class</Text>
          <Text style={[styles.tableHeaderText2, styles.rightAlign, { flex: 1 }]}>Current $</Text>
          <Text style={[styles.tableHeaderText2, styles.rightAlign, { flex: 1 }]}>
            Current %
          </Text>
        </View>

        {dataWithTotal.map((category, index) => (
          <View key={index}>
            <TableRow
              label={category.assetCategory.toUpperCase()}
              marketValue={category.marketValue}
              percentage={category.percentage}
              styles={styles}
              isCategory
            />

            {category.assetClasses?.map((subItem, idx) => (
              <TableRow
                key={idx}
                label={subItem.assetClass}
                marketValue={subItem.marketValue}
                percentage={subItem.percentage}
                styles={styles}
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
}

const TableRow = ({
  label,
  marketValue,
  percentage,
  styles,
  isCategory = false,
}: {
  label: string;
  marketValue: number;
  percentage: number;
  styles: any;
  isCategory?: boolean;
}) => (
  <View style={[styles.row, isCategory && styles.categoryRow]}>
    <Text
      style={[
        styles.cell,
        isCategory && styles.boldText,
        { flex: 1 },
      ]}
    >
      {label}
    </Text>
    <Text
      style={[
        styles.cell,
        styles.rightAlign,
        isCategory && styles.boldText,
        { flex: 1 },
      ]}
    >
      {marketValue.toLocaleString()}
    </Text>
    <Text
      style={[
        styles.cell,
        styles.rightAlign,
        isCategory && styles.boldText,
        { flex: 1 },
      ]}
    >
      {percentage.toFixed(2)}
    </Text>
  </View>
);

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    bodyText: {
      fontWeight: "bold",
      color: "#4A90E2",
      paddingHorizontal: width * 0.015,
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
      marginBottom: height * 0.001,
      borderRadius: 8,
    },
    tableHeaderText1: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
      textAlign: "left",
    },
    tableHeaderText2: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
      textAlign: "right",
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
    },
    rightAlign: {
      textAlign: "right",
    },
    cell: {
      fontSize: width * 0.035,
      color: "#333",
    },
    boldText: {
      fontWeight: "bold",
    },
  });
