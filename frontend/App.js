import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthProvider, useAuth } from "./src/context/AuthContext";
import ChartScreen from "./src/screens/ChartScreen";
import TableScreen from "./src/screens/TableScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  const { userData } = useAuth();

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={userData ? "Home" : "Login"}>
        {!userData ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="DoughnutChart" component={ChartScreen} />
            <Stack.Screen name="Table" component={TableScreen} />
          </>
        )}
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
