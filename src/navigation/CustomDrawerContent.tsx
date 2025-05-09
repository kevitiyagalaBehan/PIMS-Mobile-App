import React, { useEffect } from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useAuth } from "../context/AuthContext";
import { handleLogout } from "../utils/logout";
import { useWindowSize } from "../../hooks/useWindowSize";
import { getLinkedUsers } from "../utils/pimsApi";

export default function CustomDrawerContent(props: any) {
  const { userData, setCurrentUserName, currentUserName } = useAuth();
  const { width, height } = useWindowSize();

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

  const styles = getStyles(width, height);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/pims_logo_v1.png")}
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
