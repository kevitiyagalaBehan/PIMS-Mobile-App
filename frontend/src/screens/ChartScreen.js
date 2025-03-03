import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";
import { getAssetAllocationSummary } from "../utils/pimsApi";

export default function ChartScreen({ route }) {
  const { authToken } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const assetData = await getAssetAllocationSummary(
        authToken,
        "f99f33a5-6873-4735-a48e-2d5bc062ae9c"
      );
      if (assetData) {
        setData(assetData.assetCategories);
      }
      setLoading(false);
    };

    fetchData();
  }, [authToken]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const chartData = data.map((item, index) => ({
    name: item.assetCategory,
    population: item.marketValue,
    color: ["#f54242", "#42f554", "#4287f5", "#f5a442", "#8d42f5"][index],
    legendFontColor: "#7F7F7F",
    legendFontSize: 15,
  }));

  return (
    <View>
      <Text style={{ textAlign: "center", fontSize: 18, marginTop: 20 }}>
        Asset Allocation Summary
      </Text>
      <PieChart
        data={chartData}
        width={Dimensions.get("window").width - 16}
        height={220}
        chartConfig={{
          backgroundColor: "#fff",
          backgroundGradientFrom: "#fff",
          backgroundGradientTo: "#fff",
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
      />
    </View>
  );
}
