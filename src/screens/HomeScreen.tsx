import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";
import { HomeScreenNavigationProp } from "../navigation/types";

interface WindowSize {
  width: number;
  height: number;
}

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const { userData } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );

  useEffect(() => {
    const updateSize = () => {
      setWindowSize(Dimensions.get("window"));
    };

    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription.remove();
  }, []);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (!userData || !userData.authToken || !userData.accountId) {
    console.error("Error: userData or required fields are missing");
    return null;
  }

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
          <Text style={styles.headerText}>You’re Welcome to PIMS</Text>
        </LinearGradient>

        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/PIMS.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    background: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    container: {
      flex: 1,
      backgroundColor: "transparent",
    },
    header: {
      height: height * 0.25,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomLeftRadius: 25,
      borderBottomRightRadius: 25,
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
      textAlign: "auto",
    },
    logout: {
      paddingBottom: height * 0.1,
    },
    imageContainer: {
      alignItems: "center",
      marginTop: -30,
      marginBottom: 10,
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
  });
