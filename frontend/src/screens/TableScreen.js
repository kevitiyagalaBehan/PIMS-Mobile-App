import React, { useEffect, useState } from "react";
import { View, ScrollView, ActivityIndicator } from "react-native";
import { DataTable } from "react-native-paper";
import { getAssetAllocationSummary } from "../utils/pimsApi";

export default function TableScreen({ route }) {
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
        setData(
          assetData.assetCategories.flatMap((category) =>
            category.assetClasses.map((cls) => ({
              assetClass: cls.assetClass,
              marketValue: cls.marketValue,
              percentage: cls.percentage,
            }))
          )
        );
      }
      setLoading(false);
    };

    fetchData();
  }, [authToken]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Asset Class</DataTable.Title>
          <DataTable.Title numeric>Market Value</DataTable.Title>
          <DataTable.Title numeric>Percentage</DataTable.Title>
        </DataTable.Header>

        {data.map((row, index) => (
          <DataTable.Row key={index}>
            <DataTable.Cell>{row.assetClass}</DataTable.Cell>
            <DataTable.Cell numeric>
              {row.marketValue.toFixed(2)}
            </DataTable.Cell>
            <DataTable.Cell numeric>{row.percentage}%</DataTable.Cell>
          </DataTable.Row>
        ))}
      </DataTable>
    </ScrollView>
  );
}
