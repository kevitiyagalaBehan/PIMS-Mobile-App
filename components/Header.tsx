import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import React, { useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../src/context/AuthContext";
import {
  getLinkedUsers,
  getAssetAllocationSummary,
} from "../src/utils/pimsApi";
import { WindowSize, PortfolioData, Props } from "../src/navigation/types";

export default function Header({ refreshTrigger }: Props) {
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
  }, [userData?.authToken, refreshTrigger]);

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
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (!userData || !userData.authToken || !userData.accountId) {
    //console.error("Error: userData or required fields are missing");
    return null;
  }

  return (
    <View>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/pims_logo.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>


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

    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    imageContainer: {
      paddingHorizontal: width * 0.02,
      alignItems: "center",
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
      marginTop: height * 0.005,
      width: "100%",
      height: height * 0.07,
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
      paddingBottom: 5,
    },
  });
