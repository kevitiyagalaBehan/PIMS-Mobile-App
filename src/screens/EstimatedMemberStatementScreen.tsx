import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { getLinkedUsers, getAssetAllocationSummary } from "../utils/pimsApi";
import { WindowSize, PortfolioData } from "../navigation/types";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/types";
import Ionicons from "react-native-vector-icons/Ionicons";

type PortfolioSummaryScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Home'
>;

export default function EstimatedMemberStatementScreen() {
  const navigation = useNavigation<PortfolioSummaryScreenNavigationProp>();
  const { userData, setCurrentUserName, currentUserName } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );
  const [portfolioSummary, setPortfolioSummary] =
    useState<PortfolioData | null>(null);
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

      if (userName && userName.fullName) {
        setCurrentUserName(userName.fullName);
      } else {
        setCurrentUserName("User not found");
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

      const [summaryData] = await Promise.all([
        getAssetAllocationSummary(userData.authToken, userData.accountId),
      ]);

      if (summaryData) {
        setPortfolioSummary(summaryData);
      } else {
        setError("Failed to load portfolio summary");
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

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#4A90E2" />
        <Text style={styles.backButtonText}>Home</Text>
      </TouchableOpacity>

      <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
        <Text style={styles.userNameText}>
          {currentUserName ? `Hello, ${currentUserName}` : "Loading user..."}
        </Text>
      </LinearGradient>

      <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
        <Text style={styles.valueText}>
          {portfolioSummary
            ? new Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
              }).format(portfolioSummary.totalMarketValue)
            : "N/A"}
        </Text>

        <Text style={styles.dateText}>
          Current value as at {new Date().toLocaleDateString("en-GB")}
        </Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: width * 0.02,
      flex: 1,
      backgroundColor: "transparent",
    },
    scrollView: {
      flexGrow: 1,
      paddingBottom: height * 0.1,
    },
    header: {
      marginTop: height * 0.005,
      width: "100%",
      height: height * 0.085,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
      elevation: 5,
    },
    userNameText: {
      fontSize: RFPercentage(3.5),
      fontWeight: "bold",
      color: "white",
      textAlign: "center",
    },
    valueText: {
      fontSize: RFPercentage(3.5),
      fontWeight: "bold",
      color: "white",
    },
    dateText: {
      color: "white",
      fontSize: RFPercentage(2),
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2.5),
      textAlign: "center",
    },
    backButton: {
      flexDirection: "row",
      alignItems: "center",
      padding: 10,
      marginBottom: 10,
    },
    backButtonText: {
      color: "#4A90E2",
      fontSize: RFPercentage(2),
      marginLeft: 5,
    },
  });