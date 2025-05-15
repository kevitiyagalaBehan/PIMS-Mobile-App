import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getInvestmentPerformance } from "../src/utils/pimsApi";
import { InvestmentPerformanceDetails, Props } from "../src/navigation/types";
import { useWindowSize } from "../hooks/useWindowSize";

export default function InvestmentPerformanceChart({ refreshTrigger }: Props) {
  const { userData } = useAuth();
  const { width, height } = useWindowSize();
  const [data, setData] = useState<InvestmentPerformanceDetails[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.authToken || !userData?.accountId) return;
      setLoading(true);
      try {
        const result = await getInvestmentPerformance(
          userData.authToken,
          userData.accountId
        );
        if (result) {
          setData(result);
        } else {
          setError("Failed to load investment performance.");
        }
      } catch {
        setError("Error fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  const styles = getStyles(width, height);

  if (loading) {
    return <Text style={styles.loader}>Loading...</Text>;
  }

  if (!data || error) {
    return (
      <Text style={styles.errorText}>
        {error || "No investment performance data available"}
      </Text>
    );
  }

  const labels = data.map((item) => {
    const date = new Date(item.date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}-${month}-${year}`;
  });

  const values = data.map((item) => item.cumulativePercent);

  const reducedLabels = labels.map(() => "");

  const fixedDates = [
    "01-12-24",
    "01-01-25",
    "01-02-25",
    "01-03-25",
    "01-04-25",
  ];

  fixedDates.forEach((targetDate) => {
    const index = labels.findIndex((label) => label === targetDate);
    if (index !== -1) {
      reducedLabels[index] = targetDate;
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.border}>
        <Text style={styles.bodyText}>Investment Performance</Text>
        <View style={{ alignItems: "center", paddingBottom: height * 0.01 }}>
          <LineChart
            data={{
              labels: reducedLabels,
              datasets: [
                {
                  data: values,
                  strokeWidth: 3,
                  color: () => "#1B77BE",
                },
              ],
            }}
            width={width * 0.9}
            height={height * 0.4}
            yAxisInterval={1}
            withDots={false}
            withShadow={false}
            fromZero
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={true}
            withHorizontalLines={true}
            segments={4}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForBackgroundLines: {
                stroke: "#f0f0f0",
                strokeDasharray: "",
              },
              propsForLabels: {
                fontSize: RFPercentage(1.5),
                rotation: 45,
                textAnchor: "start",
              },
            }}
            bezier
          />

          {/* Horizontal zero line + label */}
          {Math.min(...values) < 0 && Math.max(...values) > 0 && (
            <>
              <View
                style={{
                  position: "absolute",
                  left: 67,
                  right: 4,
                  top:
                    height *
                    0.45 *
                    (1 -
                      (0 - Math.min(...values)) /
                        (Math.max(...values) - Math.min(...values))),
                  height: 1,
                  backgroundColor: "#FF0000",
                }}
              />
              <Text
                style={{
                  position: "absolute",
                  left: 41,
                  top:
                    height *
                      0.45 *
                      (1 -
                        (0 - Math.min(...values)) /
                          (Math.max(...values) - Math.min(...values))) -
                    RFPercentage(1),
                  fontSize: RFPercentage(1.5),
                  color: "#000",
                  paddingLeft: 4,
                }}
              >
                0
              </Text>
            </>
          )}
        </View>
      </View>
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      marginTop: height * 0.02,
      borderRadius: 6,
    },
    border: {
      borderWidth: 1,
      borderColor: "#1B77BE",
      borderRadius: 6,
      paddingHorizontal: width * 0.02,
    },
    loader: {
      fontWeight: "bold",
      color: "#1B77BE",
      fontSize: RFPercentage(2.6),
      marginTop: height * 0.021,
      marginLeft: height * 0.01,
    },
    bodyText: {
      fontWeight: "bold",
      color: "#1B77BE",
      marginBottom: height * 0.005,
      fontSize: RFPercentage(2.6),
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    errorContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 20,
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2),
      fontWeight: "bold",
      textAlign: "center",
      marginTop: height * 0.2,
    },
  });
