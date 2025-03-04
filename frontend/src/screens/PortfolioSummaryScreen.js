import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { getAssetAllocationSummary } from "../utils/pimsApi";
import { MaterialIcons } from "@expo/vector-icons";

export default function PortfolioSummary({ route }) {
  const [data, setData] = useState(null);
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={30} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Portfolio Summary</Text>
      </LinearGradient>

      <View style={styles.tableHeader}>
        <Text style={[styles.tableHeaderText, { flex: 2 }]}>Asset Class</Text>
        <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Current $</Text>
        <Text style={[styles.tableHeaderText, { flex: 1 }]}>Current %</Text>
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
              <Text style={[styles.cell, styles.boldText, { flex: 2 }]}>
                {item.assetCategory.toUpperCase()}
              </Text>
              <Text style={[styles.cell, styles.boldText, { flex: 2 }]}>
                {item.marketValue.toLocaleString()}
              </Text>
              <Text style={[styles.cell, styles.boldText, { flex: 1 }]}>
                {item.percentage.toFixed(2)}
              </Text>
            </View>

            {item.assetClasses &&
              item.assetClasses.map((subItem, index) => (
                <View key={index} style={styles.row}>
                  <Text style={[styles.cell, { flex: 2 }]}>
                    {subItem.assetClass}
                  </Text>
                  <Text style={[styles.cell, { flex: 2 }]}>
                    {subItem.marketValue.toLocaleString()}
                  </Text>
                  <Text style={[styles.cell, { flex: 1 }]}>
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
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#4A90E2",
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginTop: 20,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  tableHeaderText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    alignItems: "center",
  },
  categoryRow: {
    backgroundColor: "#E6F0FF",
    borderRadius: 8,
    marginBottom: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  cell: {
    fontSize: 16,
    color: "#333",
    textAlign: "left",
    paddingVertical: 5,
  },
  boldText: {
    fontWeight: "bold",
  },
});
