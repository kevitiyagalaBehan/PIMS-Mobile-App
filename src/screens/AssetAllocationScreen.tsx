import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { PieChart } from "react-native-chart-kit";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { getLinkedUsers, getAssetAllocationSummary } from "../utils/pimsApi";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { PortfolioData, RootStackParamList } from "../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";

type AssetAllocationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

interface ChartData {
  name: string;
  percentage: number;
  color: string;
  legendFontColor: string;
  legendFontSize: number;
}

export default function AssetAllocationScreen() {
  const navigation = useNavigation<AssetAllocationScreenNavigationProp>();
  const { userData, setCurrentUserName, currentUserName } = useAuth();
  const [windowSize, setWindowSize] = useState(Dimensions.get("window"));
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => setWindowSize(Dimensions.get("window"));
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription?.remove();
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
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
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
      </ScrollView>
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
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    loader: {
      marginTop: height * 0.1,
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
    chartSection: {
      backgroundColor: "white",
      borderRadius: 10,
      padding: 15,
      marginTop: height * 0.02,
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
