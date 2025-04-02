import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import Svg, { Rect } from "react-native-svg";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getSuperFundDetails } from "../src/utils/pimsApi";
import { WindowSize } from "../src/navigation/types";
import { useIsFocused } from '@react-navigation/native'; 

export default function PortfolioBalanceSummary() {
  const { userData } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(Dimensions.get("window"));
  const [portfolioData, setPortfolioData] = useState<{ dataDownDate: string; year: number; value: number }[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedData, setSelectedData] = useState<{
    clientTotal: number;
    dataDownDate: string;
    x: number;
    y: number;
  } | null>(null);

  const isFocused = useIsFocused();

  useEffect(() => {
    const updateSize = () => {
      setWindowSize(Dimensions.get("window"));
    };

    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.authToken || !userData?.accountId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const data = await getSuperFundDetails(userData.authToken, userData.accountId);

      if (data) {
        setPortfolioData(
          data.map((item) => ({
            year: item.year,
            value: item.clientTotal,
            dataDownDate: item.dataDownDate,
          }))
        );
      } else {
        setError("Failed to load data");
      }

      setLoading(false);
    };

    fetchData();
  }, [userData]);

  useEffect(() => {
    if (isFocused) {
      setSelectedData(null); 
    }
  }, [isFocused]);  

  const { width, height } = windowSize;
  const chartWidth = width * 1;
  const chartHeight = 250;
  const styles = getStyles(width, height);

  if (!userData || !userData.authToken || !userData.accountId) {
    console.error("Error: userData or required fields are missing");
    return null;
  }

  const handlePressOutside = () => {
    setSelectedData(null); 
  };

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View>
        <Text style={styles.bodyText}>Portfolio Summary Balance</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : portfolioData ? (
          <View>
            <View>
              <BarChart
                style={styles.chartContainer}
                data={{
                  labels: portfolioData.map((item) => `${item.year}`),
                  datasets: [
                    {
                      data: portfolioData.map((item) => item.value / 1_000_000),
                    },
                  ],
                }}
                width={chartWidth}
                height={chartHeight}
                yAxisLabel="$"
                yAxisSuffix="M"
                chartConfig={{
                  backgroundColor: "#f5f5f5",
                  backgroundGradientFrom: "#ffffff",
                  backgroundGradientTo: "#ffffff",
                  decimalPlaces: 0,
                  color: () => `rgba(195, 16, 231, 1)`,
                  labelColor: () => `rgba(0, 0, 0, 1)`,
                  barPercentage: 1,
                  propsForBackgroundLines: {
                    strokeWidth: 1,
                    stroke: "#e0e0e0",
                    strokeDasharray: "5,5",
                  },
                  propsForLabels: {
                    fontSize: RFPercentage(2),
                  },
                }}
                fromZero={true}
              />
              <Svg width={chartWidth} height={chartHeight} style={StyleSheet.absoluteFill}>
                {portfolioData.map((item, index) => {
                  const barWidth = chartWidth / portfolioData.length - 20;
                  const x = (chartWidth * index) / portfolioData.length + 15;
                  const y = chartHeight - (item.value / 1_000_000) * 200;

                  return (
                    <Rect
                      key={index}
                      x={x}
                      y={y}
                      width={barWidth}
                      height={chartHeight - y}
                      fill="transparent"
                      onPress={() => {
                        setSelectedData({
                          clientTotal: item.value,
                          dataDownDate: item.dataDownDate,
                          x,
                          y: Math.max(y, 0) + 10,
                        });
                      }}
                    />
                  );
                })}
              </Svg>
            </View>

            {selectedData && (
              <View
                style={[
                  styles.tooltip,
                  {
                    position: "absolute",
                    left: Math.min(selectedData.x, width - 150),
                    top: selectedData.y,
                  },
                ]}
              >
                <Text style={styles.tooltipText}>
                  ${selectedData.clientTotal.toLocaleString()}
                </Text>
                <Text style={styles.tooltipText}>
                  {new Date(selectedData.dataDownDate).toLocaleDateString("en-GB")}
                </Text>
              </View>
            )}
          </View>
        ) : null}
      </View>
    </TouchableWithoutFeedback>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    chartContainer: {
      alignItems: "center",
      width: "100%",
      borderRadius: 15,
      marginVertical: height > width ? height * 0.01 : height * 0.015,
      elevation: 3,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    loader: {
      marginTop: 100,
    },
    bodyText: {
      fontWeight: "bold",
      color: "#4A90E2",
      paddingHorizontal: width * 0.02,
      marginLeft: width * 0.001,
      marginTop: height * 0.02,
      fontSize: RFPercentage(3),
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2.5),
      textAlign: "center",
    },
    tooltip: {
      position: "absolute",
      backgroundColor: "white",
      padding: 10,
      borderRadius: 8,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3,
      zIndex: 10,
    },
    tooltipText: {
      fontSize: RFPercentage(2),
      color: "#333",
      textAlign: "center",
    },
  });
