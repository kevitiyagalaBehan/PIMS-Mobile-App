import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import HomeScreen from "../screens/HomeScreen";
import TableScreen from "../screens/TableScreen";
import ChartScreen from "../screens/ChartScreen";
import { Ionicons } from "react-native-vector-icons";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === "Home") iconName = "home";
            else if (route.name === "Table") iconName = "list";
            else if (route.name === "Chart") iconName = "pie-chart";
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Table" component={TableScreen} />
        <Tab.Screen name="Chart" component={ChartScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
