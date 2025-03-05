import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Animated,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { userData } = useAuth();

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
            routes: [{ name: "Login" }],
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
          <TouchableWithoutFeedback onPress={handleLogout}>
            <MaterialIcons name="logout" size={32} color="white" />
          </TouchableWithoutFeedback>
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
          />
          <AnimatedButton
            text="Asset Allocation"
            onPress={() =>
              navigation.navigate("AssetAllocation", {
                authToken: userData.authToken,
                accountId: userData.accountId,
              })
            }
          />
          <AnimatedButton
            text="Portfolio"
            onPress={() => navigation.navigate("Portfolio")}
            large
          />
        </View>
      </View>
    </ImageBackground>
  );
}

const AnimatedButton = ({ text, onPress, large }) => {
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
    ]).start(() => onPress && onPress());
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
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

const styles = StyleSheet.create({
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
    height: 260,
    padding: 20,
    paddingTop: 40,
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
    fontSize: 36,
    fontWeight: "bold",
    paddingTop: 60,
    letterSpacing: 0.5,
  },
  imageContainer: {
    alignItems: "center",
    marginTop: -30,
    marginBottom: 10,
  },
  image: {
    width: 200,
    height: 100,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -150,
  },
  button: {
    backgroundColor: "#001F5B",
    paddingVertical: 18,
    paddingHorizontal: 35,
    borderRadius: 12,
    marginVertical: 8,
    width: "75%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  largeButton: {
    width: "65%",
  },
  buttonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

