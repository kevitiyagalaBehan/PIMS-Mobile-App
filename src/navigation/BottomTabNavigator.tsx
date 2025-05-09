import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import NotifyScreen from "../screens/NotifyScreen";
import { BottomTabParamList } from "./types";
import { useWindowSize } from "../../hooks/useWindowSize";
import { RFPercentage } from "react-native-responsive-fontsize";

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTab() {
  const navigation = useNavigation();
  const { width, height } = useWindowSize();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { height: height * 0.06, paddingBottom: 5 },
        tabBarLabelStyle: { fontSize: RFPercentage(1.4), fontWeight: "bold" },
        tabBarIconStyle: { marginBottom: 0 },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotifyScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="notifications" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={HomeScreen}
        options={{
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, size }) => (
              <Ionicons name="menu" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.dispatch(DrawerActions.openDrawer());
          },
        }}
      />
    </Tab.Navigator>
  );
}
