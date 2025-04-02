import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { PieChart } from "react-native-chart-kit";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getAssetAllocationSummary } from "../src/utils/pimsApi";
import { PortfolioData, ChartData, WindowSize } from "../src/navigation/types";

export default function AssetAllocation() {
  const { userData } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioData | null>(null);

  useEffect(() => {
    const updateSize = () => setWindowSize(Dimensions.get("window"));
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription?.remove();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.authToken || !userData?.accountId) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await getAssetAllocationSummary(
          userData.authToken,
          userData.accountId
        );

        if (!response) {
          setError("No data received from server");
          return;
        }

        setPortfolioSummary(response);

        const processedData: ChartData[] = [];
        if (response.assetCategories) {
          response.assetCategories.forEach((category) => {
            category.assetClasses?.forEach((asset) => {
              processedData.push({
                name: asset.assetClass,
                percentage: asset.percentage,
                color: getRandomColor(),
                legendFontColor: "#333",
                legendFontSize: RFPercentage(1.8),
              });
            });
          });
        }

        if (processedData.length > 0) {
          setChartData(processedData);
        } else {
          setError("No asset allocation data available");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load asset allocation data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData]);

  const getRandomColor = () => {
    const colors = [
      "#4BA3C3",
      "#74B6E2",
      "#5568A8",
      "#9D7070",
      "#E2AB60",
      "#8A9B0F",
      "#FF6B6B",
      "#48D1CC",
      "#BA68C8",
      "#4DB6AC",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (!userData || !userData.authToken || !userData.accountId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Authentication data missing</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.bodyText}>Asset Allocation</Text>

      {chartData.length > 0 ? (
        <View style={styles.chartSection}>
          <PieChart
            data={chartData}
            width={width * 1.746}
            height={300}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 31, 91, ${opacity})`,
            }}
            accessor="percentage"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
            hasLegend={false}
          />

          <View style={styles.legendContainer}>
            {chartData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.colorBox, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>
                  {item.name}: {item.percentage.toFixed(2)}%
                </Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <Text style={styles.noDataText}>
          No asset allocation data available
        </Text>
      )}
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loader: {
      marginTop: height * 0.1,
    },
    bodyText: {
      fontWeight: "bold",
      color: "#4A90E2",
      paddingHorizontal: width * 0.02,
      marginLeft: width * 0.001,
      marginTop: height * 0.02,
      fontSize: RFPercentage(3),
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2.5),
      textAlign: "center",
    },
    noDataText: {
      textAlign: "center",
      marginTop: 20,
      fontSize: RFPercentage(2),
      color: "#666",
    },
    chartSection: {
      marginVertical: height > width ? height * 0.01 : height * 0.015,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    legendContainer: {
      marginTop: 15,
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    legendItem: {
      flexDirection: "row",
      alignItems: "center",
      width: "48%",
      marginBottom: 10,
    },
    colorBox: {
      width: 12,
      height: 12,
      marginRight: 8,
      borderRadius: 3,
    },
    legendText: {
      fontSize: RFPercentage(2),
      color: "#333",
    },
  });
