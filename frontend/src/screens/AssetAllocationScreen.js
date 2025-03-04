import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { PieChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { Dimensions } from "react-native";
import { getAssetAllocationSummary } from "../utils/pimsApi";
import { MaterialIcons } from "@expo/vector-icons";

export default function AssetAllocation({ route }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { authToken, accountId } = route.params;

  useEffect(() => {
    if (!authToken || !accountId) {
      console.error("Missing authToken or accountId");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getAssetAllocationSummary(authToken, accountId);
        if (result && result.assetCategories) {
          const extractedData = [];
          result.assetCategories.forEach((category) => {
            category.assetClasses.forEach((asset) => {
              extractedData.push({
                name: asset.assetClass,
                percentage: asset.percentage,
              });
            });
          });

          setData(extractedData);
        } else {
          console.error("API response is null or invalid");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [authToken, accountId]);

  if (!data.length) {
    return (
      <View style={styles.loadingContainer}>
        <Text>No data available</Text>
      </View>
    );
  }

  const chartColors = {
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
      <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Asset Allocation</Text>
      </LinearGradient>

      <View style={styles.chartContainer}>
        <PieChart
          data={chartData}
          width={Dimensions.get("window").width - 40}
          height={260}
          chartConfig={{
            backgroundColor: "transparent",
            backgroundGradientFrom: "transparent",
            backgroundGradientTo: "transparent",
            color: (opacity = 1) => `rgba(0, 31, 91, ${opacity})`,
          }}
          accessor="percentage"
          backgroundColor="transparent"
          center={[85, 0]}
          hasLegend={false}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  header: {
    height: 80,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 15,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 8,
    position: "relative",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    letterSpacing: 1,
    position: "absolute",
    left: "52%",
    transform: [{ translateX: "-48%" }],
  },
  backButton: {
    position: "absolute",
    left: 15,
  },
  chartContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
  },
  breakdownContainer: {
    width: "100%",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  breakdownRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  colorIndicator: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  breakdownText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
});
