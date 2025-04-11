import React, { useEffect, useState, useRef } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getInvestmentPerformance } from "../src/utils/pimsApi";
import {
  WindowSize,
  InvestmentPerformanceDetails,
  Props,
} from "../src/navigation/types";

export default function InvestmentPerformanceChart({ refreshTrigger }: Props) {
  const { userData } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );
  const [data, setData] = useState<InvestmentPerformanceDetails[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<{
    value: number;
    date: string;
    x: number;
    y: number;
  } | null>(null);
  const chartContainerRef = useRef<View>(null);
  const [containerLayout, setContainerLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updateSize = () => {
      setWindowSize(Dimensions.get("window"));
    };
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription.remove();
  }, []);

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

  useEffect(() => {
    if (selectedPoint) {
      const timeout = setTimeout(() => {
        setSelectedPoint(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [selectedPoint]);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (loading) {
    return <Text style={styles.bodyText}>Loading...</Text>;
  }

  if (!data || error) {
    return (
      <Text style={styles.errorText}>
        {error || "No investment performance data available"}
      </Text>
    );
  }

  const def_labels = data.map((item) =>
    new Date(item.date).toLocaleDateString("en-GB")
  );

  const labels = data.map((item) => {
    const date = new Date(item.date);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(2);
    return `${day}/${month}/${year}`;
  });

  const values = data.map((item) => item.cumulativePercent);

  const reducedLabels = labels.map(() => "");

  const fixedDates = [
    "01/12/24",
    "01/01/25",
    "01/02/25",
    "01/03/25",
    "01/04/25",
  ];

  fixedDates.forEach((targetDate) => {
    const index = labels.findIndex((label) => label === targetDate);
    if (index !== -1) {
      reducedLabels[index] = targetDate;
    }
  });

  const handleDataPointClick = ({ index, value, x, y }: any) => {
    chartContainerRef.current?.measure((fx, fy, w, h, px, py) => {
      setContainerLayout({
        x: px,
        y: py,
        width: w,
        height: h,
      });
    });

    setSelectedPoint({
      value,
      date: def_labels[index],
      x: x + containerLayout.x,
      y: y + containerLayout.y,
    });
  };

  return (
    <View style={styles.container} ref={chartContainerRef}>
      <Text style={styles.bodyText}>Investment Performance</Text>
      <View style={styles.chartContainer}>
        <LineChart
          data={{
            labels: reducedLabels,
            datasets: [
              {
                data: values,
                strokeWidth: 3,
                color: () => "#4A90E2",
              },
            ],
          }}
          width={width * 0.9}
          height={height * 0.45}
          yAxisInterval={1}
          withDots={false}
          withShadow={false}
          fromZero
          withInnerLines={true}
          withOuterLines={true}
          withVerticalLines={false}
          withHorizontalLines={true}
          segments={4}
          renderDotContent={({ x, y, index }) => {
            if (selectedPoint && selectedPoint.date === labels[index]) {
              return (
                <View
                  key={index}
                  style={{
                    position: "absolute",
                    left: x - 10,
                    top: y - 10,
                    backgroundColor: "#4A90E2",
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "white",
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                    }}
                  />
                </View>
              );
            }
            return null;
          }}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(74, 144, 226, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            propsForDots: {
              r: "4",
              strokeWidth: "2",
              stroke: "#fff",
            },
            propsForBackgroundLines: {
              stroke: "#f0f0f0",
              strokeDasharray: "",
            },
            propsForLabels: {
              fontSize: RFPercentage(1.5),
            },
            style: {
              borderRadius: 16,
            },
            fillShadowGradient: "#4A90E2",
            fillShadowGradientOpacity: 0.1,
          }}
          bezier
          onDataPointClick={handleDataPointClick}
        />

        {/* Horizontal zero line + label */}
        {Math.min(...values) < 0 && Math.max(...values) > 0 && (
          <>
            <View
              style={{
                position: "absolute",
                left: 72,
                right: 0,
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
                left: 50,
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

        {selectedPoint && (
          <View
            style={{
              position: "absolute",
              left: selectedPoint.x - containerLayout.x - 60,
              top: selectedPoint.y - containerLayout.y - 70,
              backgroundColor: "white",
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#4A90E2",
              zIndex: 99,
              minWidth: 120,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: RFPercentage(1.8),
                color: "#4A90E2",
                fontWeight: "bold",
                marginBottom: 4,
                textAlign: "center",
              }}
            >
              {selectedPoint.value.toFixed(2)}
            </Text>
            <Text
              style={{
                fontSize: RFPercentage(1.5),
                color: "#666",
                textAlign: "center",
              }}
            >
              {selectedPoint.date}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    chartContainer: {
      marginVertical: height > width ? height * 0.01 : height * 0.015,
      marginHorizontal: height > width ? height * 0.01 : height * 0.015,
      borderRadius: 10,
      backgroundColor: "#fff",
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      padding: width * 0.02,
    },
    bodyText: {
      fontWeight: "bold",
      color: "#4A90E2",
      paddingHorizontal: width * 0.02,
      marginTop: height * 0.05,
      fontSize: RFPercentage(3),
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
      fontSize: RFPercentage(2.5),
      textAlign: "center",
    },
  });
