import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import HomeScreenFamily from "../screens/HomeScreenFamily";
import { BottomTabParamListFamily } from "./types";
import { useWindowSize } from "../../hooks/useWindowSize";
import { RFPercentage } from "react-native-responsive-fontsize";
import InboxStackNavigator from "./InboxStackNavigator";
import SignScreen from "../screens/SignScreen";

const Tab = createBottomTabNavigator<BottomTabParamListFamily>();

export default function BottomTabFamily() {
  const navigation = useNavigation();
  const { height } = useWindowSize();

  return (
    <Tab.Navigator
    initialRouteName="HomeFamily"
      screenOptions={{
        tabBarStyle: { height: height * 0.08 },
        tabBarLabelStyle: { fontSize: RFPercentage(1.4), fontWeight: "bold" }
      }}
    >
      <Tab.Screen
        name="HomeFamily"
        component={HomeScreenFamily}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Inbox"
        component={InboxStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: "Inbox",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbox-ellipses" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Sign"
        component={SignScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Signing",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="document-text" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={HomeScreenFamily}
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
