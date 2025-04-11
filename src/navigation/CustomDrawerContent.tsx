import React, { useEffect, useState } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Text, View, TouchableOpacity, Image, StyleSheet, Dimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";
import { handleLogout } from "../utils/logout";
import { WindowSize } from "./types";

export default function CustomDrawerContent(props: any) {
  const { currentUserName } = useAuth();
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

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/pims_logo.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.userName}>
          Welcome, {currentUserName || "User"}
        </Text>
      </View>

      <DrawerItemList {...props} />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleLogout(props.navigation)}
      >
        <Ionicons name="log-out" size={30} color="red" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: width * 1.2,
    height: height * 0.06,
  },
  userName: {
    fontSize: RFPercentage(2),
    fontWeight: "bold",
    marginTop: height * 0.01,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  logoutText: {
    fontSize: RFPercentage(2),
    color: "red",
    fontWeight: "bold",
    marginLeft: width * 0.03,
  },
});
