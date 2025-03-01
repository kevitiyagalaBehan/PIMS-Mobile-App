import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import portfolioData from "../data/portfolioData.json";

export default function TableScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(portfolioData.portfolioSummary);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Portfolio Summary</Text>
      <FlatList
        data={data}
        keyExtractor={(item) => item.asset}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.asset}</Text>
            <Text style={styles.cell}>${item.amount.toLocaleString()}</Text>
            <Text style={styles.cell}>{item.percentage}%</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
  },
  cell: { fontSize: 16 },
});
