import React, { useState, useEffect } from "react";
import {
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "../context/AuthContext";
//import { HomeScreenNavigationProp } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";

interface WindowSize {
  width: number;
  height: number;
}

export default function HomeScreen() {
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
        <Text style={styles.headerText}>You’re Welcome to PIMS</Text>
      </LinearGradient>
    </SafeAreaView>
  );
}

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
      height: height * 0.10,
      paddingHorizontal: 20,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
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
      textAlign: "auto",
    },
  });

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
