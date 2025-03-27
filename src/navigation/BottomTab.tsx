import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import MessageScreen from "../screens/MessageScreen";
import { TouchableOpacity } from "react-native";

const Tab = createBottomTabNavigator();

export default function BottomTab() {
  const navigation = useNavigation();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12, 
          fontWeight: 'bold', 
        },
        tabBarIconStyle: {
          marginBottom: 0, 
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessageScreen}
        options={{
          headerShown: false,
          tabBarLabel: "Messages",
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="message" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={HomeScreen} 
        options={{
          headerShown: false,
          tabBarLabel: "Menu",
          tabBarIcon: ({ color, size }) => (
            <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <MaterialIcons name="menu" size={size} color={color} />
            </TouchableOpacity>
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
