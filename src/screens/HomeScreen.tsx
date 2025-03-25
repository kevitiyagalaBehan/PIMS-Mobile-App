import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialIcons } from "@expo/vector-icons";
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

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" as never }],
          });
        },
      },
    ]);
  };

  return (
    <ImageBackground
      source={require("../../assets/background.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.container}>
        <LinearGradient colors={["#4A90E2", "#003366"]} style={styles.header}>
          <Text style={styles.headerText}>You’re Welcome to PIMS</Text>
          <View style={styles.logout}>
            <TouchableOpacity onPress={handleLogout} activeOpacity={0.7}>
              <MaterialIcons name="logout" size={32} color="white" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <View style={styles.imageContainer}>
          <Image
            source={require("../../assets/PIMS.png")}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.buttonContainer}>
          <AnimatedButton
            text="Portfolio Summary"
            onPress={() =>
              navigation.navigate("PortfolioSummary", {
                authToken: userData.authToken,
                accountId: userData.accountId,
              })
            }
            styles={styles}
          />

          <AnimatedButton
            text="Asset Allocation"
            onPress={() =>
              navigation.navigate("AssetAllocation", {
                authToken: userData.authToken,
                accountId: userData.accountId,
              })
            }
            styles={styles}
          />

          <AnimatedButton
            text="Portfolio"
            onPress={() => navigation.navigate("Portfolio")}
            large
            styles={styles}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

interface AnimatedButtonProps {
  text: string;
  onPress: () => void;
  large?: boolean;
  styles: ReturnType<typeof getStyles>;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  text,
  onPress,
  large,
  styles,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1.1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.7,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    onPress();
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPress={handlePressOut}
    >
      <Animated.View
        style={[
          styles.button,
          large && styles.largeButton,
          { transform: [{ scale: scaleAnim }], opacity: opacityAnim },
        ]}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

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
    buttonContainer: {
      flex: 0.8,
      alignItems: "center",
      justifyContent: "center",
    },
    button: {
      backgroundColor: "#001F5B",
      paddingVertical: height > width ? height * 0.019 : height * 0.015,
      paddingHorizontal: width * 0.08,
      borderRadius: 12,
      marginVertical: 8,
      width: width > height ? width * 0.4 : width * 0.75,
      height: height > width ? height * 0.07 : height * 0.05,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 6,
    },
    largeButton: {
      width: width > height ? width * 0.55 : width * 0.9,
      height: height > width ? height * 0.1 : height * 0.07,
      paddingVertical: height > width ? height * 0.025 : height * 0.02,
    },
    buttonText: {
      color: "white",
      fontSize: RFPercentage(2.5),
      fontWeight: "bold",
      textTransform: "uppercase",
    },
  });
