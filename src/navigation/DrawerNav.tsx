import React from "react";
import { useAuth } from "../context/AuthContext";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollViewProps,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@react-navigation/native";
import BottomTab from "./BottomTabNav";
import { SafeAreaView } from "react-native-safe-area-context";
import { handleLogout } from "../utils/logout";

const Drawer = createDrawerNavigator();

const menuItems = [
  //{ name: "Home", icon: "home-outline" },
  { name: "Valuation", icon: "chart-line" },
  { name: "Bank", icon: "bank-outline" },
  { name: "Contributions", icon: "cash-plus" },
  { name: "Pensions", icon: "currency-usd" },
  { name: "Performance", icon: "chart-areaspline" },
  { name: "Details", icon: "file-document-outline" },
  { name: "Messages", icon: "message-outline" },
];

function CustomDrawerContent(
  props: React.JSX.IntrinsicAttributes &
    ScrollViewProps & {
      children: React.ReactNode;
    }
) {
  const navigation = useNavigation<NavigationProp<any>>();
  const { currentUserName } = useAuth();

  return (
    <DrawerContentScrollView {...props}>
      <SafeAreaView style={styles.drawerContainer}>
        <View style={styles.headerContainer}>
          <Image
            source={require("../../assets/PIMS.png")}
            style={styles.Image}
          />
          <Text style={styles.userName}>Welcome, {currentUserName || "User"}</Text>
        </View>

        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.drawerItem}
            onPress={() => navigation.navigate(item.name as never)}
          >
            <Icon name={item.icon} size={35} color="#555" style={styles.icon} />
            <Text style={styles.drawerLabel}>{item.name}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[styles.drawerItem, styles.logoutButton]}
          onPress={() => handleLogout(navigation)}
        >
          <Icon name="logout" size={40} color="red" style={styles.icon} />
          <Text style={[styles.drawerLabel, { color: "red" }]}>Logout</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </DrawerContentScrollView>
  );
}

export default function DrawerNav() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerPosition: "right",
      }}
      drawerContent={(props) => (
        <CustomDrawerContent children={undefined} {...props} />
      )}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTab}
        options={{ headerShown: false }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  Image: {
    width: "100%",
    height: 60,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    marginBottom: 10,
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  icon: {
    marginRight: 15,
  },
  drawerLabel: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
  },
  logoutButton: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
});
