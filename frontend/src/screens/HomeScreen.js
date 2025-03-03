import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  StyleSheet,
} from "react-native";
import { fetchAssetAllocation } from "../api/pimsApi";

export default function HomeScreen({ userData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchAssetAllocation(
          userData.authToken,
          userData.accountId
        );
        setData(response);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <ActivityIndicator size="large" style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asset Allocation Summary</Text>
      <FlatList
        data={data.assetCategories}
        keyExtractor={(item) => item.assetCategory}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.category}>
              {item.assetCategory} - {item.percentage}%
            </Text>
            {item.assetClasses.map((asset) => (
              <Text key={asset.assetClass}>
                {asset.assetClass}: ${asset.marketValue.toLocaleString()} (
                {asset.percentage}%)
              </Text>
            ))}
          </View>
        )}
      />
      <Text style={styles.total}>
        Total Market Value: ${data.totalMarketValue.toLocaleString()}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  card: { padding: 15, borderWidth: 1, borderRadius: 8, marginBottom: 10 },
  category: { fontSize: 18, fontWeight: "bold" },
  total: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  loader: { flex: 1, justifyContent: "center" },
  error: { color: "red", textAlign: "center" },
});
