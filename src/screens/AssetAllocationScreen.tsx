import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import { RFPercentage } from "react-native-responsive-fontsize";
import { getAssetAllocationSummary } from "../utils/pimsApi";
import { AssetAllocationProps } from "../navigation/types"; // Correct import

interface AssetData {
  name: string;
  percentage: number;
}

interface AssetCategory {
  assetClass: string;
  percentage: number;
}

interface AssetAllocationResponse {
  assetCategories: { assetClasses: AssetCategory[] }[];
}

export default function AssetAllocationScreen({ route }: AssetAllocationProps) {
  const [data, setData] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { authToken, accountId } = route.params;
  const [windowSize, setWindowSize] = useState(Dimensions.get("window"));

  useEffect(() => {
    const updateSize = () => {
      setWindowSize(Dimensions.get("window"));
    };

    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription?.remove();
  }, []);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  useEffect(() => {
    if (!authToken || !accountId) {
      console.error("Missing authToken or accountId");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getAssetAllocationSummary(authToken, accountId);
    
        if (!result || !result.assetCategories) {
          console.error("API response is null or invalid");
          setData([]); 
          return;
        }
    
        const extractedData: AssetData[] = result.assetCategories.flatMap(
          (category) =>
            category.assetClasses?.map((asset) => ({
              name: asset.assetClass,
              percentage: asset.percentage,
            })) || [] 
        );
    
        setData(extractedData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setData([]); 
      } finally {
        setLoading(false);
      }
    };    

    fetchData();
  }, [authToken, accountId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  const chartColors: Record<string, string> = {
    Cash: "#4BA3C3",
    "Aust. Equities": "#74B6E2",
    "Int. Equities": "#5568A8",
    Property: "#9D7070",
    Other: "#E2AB60",
  };

  const chartData = data.map((item) => ({
    name: item.name,
    percentage: item.percentage,
    color: chartColors[item.name] || "#CCCCCC",
    legendFontColor: "#333",
    legendFontSize: 14,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={width * 0.95}
          height={height * 0.4}
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            color: (opacity = 1) => `rgba(0, 31, 91, ${opacity})`,
          }}
          accessor="percentage"
          backgroundColor="transparent"
          center={[width * (height > width ? 0.24 : 0.35), 0]}
          hasLegend={false}
          paddingLeft="15"
        />
      </View>

      <View style={styles.breakdownContainer}>
        {chartData.map((item, index) => (
          <View key={index} style={styles.breakdownRow}>
            <View
              style={[styles.colorIndicator, { backgroundColor: item.color }]}
            />
            <Text style={styles.breakdownText}>{item.name}</Text>
            <Text style={styles.breakdownText}>
              {item.percentage.toFixed(2)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5",
      paddingHorizontal: width * 0.02,
      alignItems: "center",
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
    },
    chartContainer: {
      width: "100%",
      height: "50%",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: 15,
      elevation: 5,
      marginVertical: height * 0.03,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 3 },
    },
    breakdownContainer: {
      width: "100%",
      backgroundColor: "white",
      padding: width * 0.04,
      borderRadius: 10,
      elevation: 3,
      shadowColor: "#000",
      shadowOpacity: 0.1,
      shadowOffset: { width: 0, height: 2 },
      maxHeight: height > width ? "auto" : height * 0.5,
    },
    breakdownRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: height * 0.015,
      borderBottomWidth: 1,
      borderBottomColor: "#ddd",
    },
    colorIndicator: {
      width: width * 0.04,
      height: width * 0.04,
      borderRadius: 7.5,
      marginRight: 10,
    },
    breakdownText: {
      fontSize: RFPercentage(2.2),
      fontWeight: "500",
      color: "#333",
    },
  });
