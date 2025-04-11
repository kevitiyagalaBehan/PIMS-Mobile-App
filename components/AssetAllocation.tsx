import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { PieChart } from "react-native-chart-kit";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getAssetAllocationSummary } from "../src/utils/pimsApi";
import {
  PortfolioData,
  ChartData,
  WindowSize,
  Props,
} from "../src/navigation/types";

export default function AssetAllocation({ refreshTrigger }: Props) {
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

      try {
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
                color: getColorForAssetClass(asset.assetClass),
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
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  const getColorForAssetClass = (assetClass: string) => {
    const colorMap: { [key: string]: string } = {
      "Cash": "#5DA8A7",
      "Aust. Equities": "#7AC2E1",
      "Int. Equities": "#677EB5",
      "Property": "#A46E7E",
      "Other": "#EDBE72",
    };
  
    return colorMap[assetClass];
  };  

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (!userData || !userData.authToken || !userData.accountId) {
    return null;
  }

  if (loading) {
    return <Text style={styles.bodyText}>Loading...</Text>;
  }

  if (!portfolioSummary || error) {
    return (
      <Text style={styles.errorText}>
        {error || "No asset allocation data available"}
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.bodyText}>Asset Allocation</Text>

      {chartData.length > 0 ? (
        <View style={styles.chartContainer}>
          <PieChart
            data={chartData}
            width={width * 1.71}
            height={height * 0.3}
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
    container: {
      flex: 1,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loader: {
      marginTop: height * 0.25,
    },
    bodyText: {
      fontWeight: "bold",
      color: "#4A90E2",
      paddingHorizontal: width * 0.02,
      marginTop: height * 0.05,
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
    chartContainer: {
      marginVertical: height > width ? height * 0.01 : height * 0.015,
      marginHorizontal: height > width ? height * 0.01 : height * 0.015,
      backgroundColor: "white",
      borderRadius: 10,
      padding: width * 0.03,
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
