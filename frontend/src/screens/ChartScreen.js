import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import portfolioData from "../data/portfolioData.json";

export default function ChartScreen() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const data = portfolioData.portfolioSummary.map((item) => ({
      name: item.asset,
      population: item.amount,
      color: getRandomColor(),
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    }));
    setChartData(data);
  }, []);

  const getRandomColor = () => {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Asset Allocation</Text>
      <PieChart
        data={chartData}
        width={Dimensions.get("window").width - 20}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
});
