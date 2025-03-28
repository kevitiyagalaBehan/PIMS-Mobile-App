import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { BarChart } from "react-native-chart-kit";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Button from '../../components/Button';
//import { HomeScreenNavigationProp } from "../navigation/types";
//import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { getLinkedUsers, getSuperFundDetails } from "../utils/pimsApi";

interface WindowSize {
  width: number;
  height: number;
}

export default function HomeScreen() {
  const { userData } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );

  const [currentUserName, setCurrentUserName] = useState<{
    FullName: string;
    IsCurrent: boolean;
  } | null>(null);
  const [portfolioData, setPortfolioData] = useState<{
    dataDownDate: string;
    year: number;
    value: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      setWindowSize(Dimensions.get("window"));
    };

    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData?.authToken) {
        setCurrentUserName(null);
        return;
      }

      const userName = await getLinkedUsers(userData.authToken);

      if (userName) {
        setCurrentUserName(userName);
      } else {
        setCurrentUserName({ FullName: "User not found", IsCurrent: false });
      }
    };

    fetchUserData();
  }, [userData?.authToken]);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.authToken || !userData?.accountId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      const data = await getSuperFundDetails(
        userData.authToken,
        userData.accountId
      );

      if (data) {
        //console.log("Fetched Super Fund Data:", data);
        setPortfolioData({
          year: data.year,
          value: data.clientTotal,
          dataDownDate: data.dataDownDate,
        });
      } else {
        setError("Failed to load data");
      }

      setLoading(false);
    };

    fetchData();
  }, [userData]);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (!userData || !userData.authToken || !userData.accountId) {
    console.error("Error: userData or required fields are missing");
    return null;
  }

  const formattedValue = portfolioData
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(portfolioData.value)
    : "$0.00";

  const formattedDate = portfolioData
    ? new Date(portfolioData.dataDownDate).toLocaleDateString("en-GB")
    : "";

  return (
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.imageContainer}>
        <Image
          source={require("../../assets/PIMS.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </SafeAreaView>

      <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
        <Text style={styles.userNameText}>
          {currentUserName ? `Hello, ${currentUserName}!` : "Loading user..."}
        </Text>
      </LinearGradient>

      <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
        <Text style={styles.valueText}>{formattedValue}</Text>
        <Text style={styles.dateText}>Current Value at {formattedDate}</Text>
      </LinearGradient>

      <Text style={styles.bodyText}>What is my portfolio worth?</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      ) : error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : portfolioData ? (
        <View>
          <BarChart
            style={styles.chartContainer}
            data={{
              labels: [`${portfolioData.year}`],
              datasets: [
                {
                  data: [portfolioData.value / 1_000_000],
                },
              ],
            }}
            width={width * 0.95}
            height={250}
            yAxisLabel="$"
            yAxisSuffix="M"
            chartConfig={{
              backgroundColor: "#f5f5f5",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
        </View>
      ) : null}

<Button onPress={() => console.log("More Details Pressed")} />
      
    </SafeAreaView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 5,
      flex: 1,
      backgroundColor: "transparent",
      //alignItems: "center",
      //justifyContent: "center",
    },
    imageContainer: {
      paddingHorizontal: 5,
      alignItems: "center",
    },
    chartContainer: {
      alignItems: "center",
      width: "100%",
      borderRadius: 10,
      paddingTop: 25,
    },
    image: {
      width: width * 0.5,
      height: height * 0.12,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    header: {
      marginTop: 5,
      width: "100%",
      height: height * 0.1,
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
    loader: {
      marginTop: 100,
    },
    bodyText: {
      paddingHorizontal: 5,
      marginLeft: 3,
      marginTop: 25,
      fontSize: RFPercentage(3),
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2.5),
      textAlign: "center",
    },
  });

{
  /*
    <SafeAreaView style={styles.container}>
      <SafeAreaView style={styles.imageContainer}>
        <Image
          source={require("../../assets/PIMS.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </SafeAreaView>
      <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
        <Text style={styles.headerText}>You’re Welcome to PIMS</Text>
      </LinearGradient>
      <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.amount}>
        {loading ? (
          <ActivityIndicator size="large" color="#FFF" />
        ) : (
          <Text style={styles.headerText}>
            ${portfolioData?.currentValue?.toLocaleString()}
          </Text>
        )}
      </LinearGradient>

      <Text style={styles.chartTitle}>What is my portfolio worth?</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#001F5B" />
      ) : (
        <LineChart
          data={{
            labels: portfolioData?.history?.map((item: any) =>
              item.date.slice(0, 10)
            ),
            datasets: [
              { data: portfolioData?.history?.map((item: any) => item.value) },
            ],
          }}
          width={width - 40}
          height={220}
          yAxisLabel="$"
          chartConfig={{
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 31, 91, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: { borderRadius: 8 },
          }}
          style={styles.chart}
        />
      )}
    </SafeAreaView>
  );
  */
}

{
  /*
  const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "transparent",
      paddingHorizontal: 5,
    },
    imageContainer: {
      alignItems: "center",
      marginBottom: 5,
    },
    image: {
      width: width * 0.5,
      height: height * 0.12,
      borderRadius: 15,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    header: {
      height: height * 0.1,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 8,
    },
    amount: {
      marginTop: 10,
      height: height * 0.15,
      paddingHorizontal: 20,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 5,
      elevation: 8,
    },
    headerText: {
      color: "white",
      fontSize: RFPercentage(4),
      fontWeight: "bold",
      letterSpacing: 0.5,
      textAlign: "center",
    },
    chartTitle: {
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 20,
      textAlign: "center",
    },
    chart: {
      borderRadius: 8,
      marginTop: 10,
      alignSelf: "center",
    },
  });
*/
}
{
  /*
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
    </ImageBackground>

background: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
*/
}
