import React from "react";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerContentComponentProps } from "@react-navigation/drawer";
import { Alert } from "react-native";
import BottomTab from "./BottomTab";
import { useNavigation } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const navigation = useNavigation();

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
    <DrawerContentScrollView {...props}>
      <DrawerItem label="Home" onPress={() => navigation.navigate("Home" as never)} />
      <DrawerItem label="Valuation" onPress={() => navigation.navigate("Valuation" as never)} />
      <DrawerItem label="Bank" onPress={() => navigation.navigate("Bank" as never)} />
      <DrawerItem label="Contributions" onPress={() => navigation.navigate("Contributions" as never)} />
      <DrawerItem label="Pensions" onPress={() => navigation.navigate("Pensions" as never)} />
      <DrawerItem label="Performance" onPress={() => navigation.navigate("Performance" as never)} />
      <DrawerItem label="Details" onPress={() => navigation.navigate("Details" as never)} />
      <DrawerItem label="Messages" onPress={() => navigation.navigate("Messages" as never)} />
      <DrawerItem label="Logout" onPress={handleLogout} />
    </DrawerContentScrollView>
  );
}

export default function DrawerNav() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="MainTabs" component={BottomTab} options={{ headerShown: false }} />
      {/*
      <Drawer.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Help" component={HelpScreen} options={{ headerShown: false }} />
      */}
    </Drawer.Navigator>
  );
}
