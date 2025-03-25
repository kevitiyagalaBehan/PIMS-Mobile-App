import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import { RootStackParamList } from "./src/navigation/types";
import AssetAllocationScreen from "./src/screens/AssetAllocationScreen";
import PortfolioSummaryScreen from "./src/screens/PortfolioSummaryScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";

const Stack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  const { userData } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userData ? "Home" : "Login"}>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AssetAllocation"
          component={AssetAllocationScreen}
          options={{
            headerTitle: "Asset Allocation",
            headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name="PortfolioSummary"
          component={PortfolioSummaryScreen}
          options={{
            headerTitle: "Asset Allocation",
            headerTitleAlign: "center",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppNavigator />
    </AuthProvider>
  );
}
