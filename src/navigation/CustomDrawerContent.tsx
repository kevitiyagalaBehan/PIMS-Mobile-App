import React from "react";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Text, View, TouchableOpacity, Image, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useAuth } from "../context/AuthContext";
import { handleLogout } from "../utils/logout"; 

export default function CustomDrawerContent(props: any) {
  const { currentUserName } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.headerContainer}>
        <Image
          source={require("../../assets/PIMS.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.userName}>Welcome, {currentUserName || "User"}</Text>
      </View>

      <DrawerItemList {...props} />

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => handleLogout(props.navigation)} 
      >
        <Icon name="logout" size={24} color="red" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 120,
    height: 60,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  logoutText: {
    fontSize: 16,
    color: "red",
    marginLeft: 10,
  },
});
