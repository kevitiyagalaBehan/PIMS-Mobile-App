import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomTab from "./BottomTabNavigator";
import AssetAllocationScreen from "../screens/AssetAllocationScreen";
import PortfolioSummaryScreen from "../screens/PortfolioSummaryScreen";
import TopTenInvestmentsScreen from "../screens/TopTenInvestmentsScreen";
import PortfolioBalanceScreen from "../screens/PortfolioBalanceScreen";
import ContributionCapScreen from "../screens/ContributionCapScreen";
import PensionLimitScreen from "../screens/PensionLimitScreen";
import EstimatedMemberStatementScreen from "../screens/EstimatedMemberStatementScreen";
import CustomDrawerContent from "./CustomDrawerContent";
import { DrawerParamList } from "./types";
import { useAuth } from "../context/AuthContext";

const Drawer = createDrawerNavigator<DrawerParamList>();

export default function DrawerNavigator() {
  const { userData } = useAuth();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerPosition: "right",
        headerShown: false,
        drawerStyle: { width: "75%" },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: -3,
          marginVertical: 4,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTab}
        initialParams={{ 
          authToken: userData?.authToken, 
          accountId: userData?.accountId 
        }}
        options={{
          drawerLabel: "Home",
          drawerItemStyle: { display: "none" },
        }}
      />
      <Drawer.Screen
        name="AssetAllocation"
        component={AssetAllocationScreen}
        initialParams={{ 
          authToken: userData?.authToken, 
          accountId: userData?.accountId 
        }}
        options={{
          drawerLabel: "Asset Allocation",
          drawerIcon: ({ color }) => (
            <Ionicons name="pie-chart" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="PortfolioSummary"
        component={PortfolioSummaryScreen}
        initialParams={{ 
          authToken: userData?.authToken, 
          accountId: userData?.accountId 
        }}
        options={{
          drawerLabel: "Portfolio Summary",
          drawerIcon: ({ color }) => (
            <Ionicons name="document-text" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TopTenInvestments"
        component={TopTenInvestmentsScreen}
        initialParams={{ 
          authToken: userData?.authToken, 
          accountId: userData?.accountId 
        }}
        options={{
          drawerLabel: "Top 10 Investments",
          drawerIcon: ({ color }) => (
            <Ionicons name="list" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="PortfolioBalance"
        component={PortfolioBalanceScreen}
        initialParams={{ 
          authToken: userData?.authToken, 
          accountId: userData?.accountId 
        }}
        options={{
          drawerLabel: "Portfolio Balance",
          drawerIcon: ({ color }) => (
            <Ionicons name="wallet" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ContributionCap"
        component={ContributionCapScreen}
        initialParams={{ 
          authToken: userData?.authToken, 
          accountId: userData?.accountId 
        }}
        options={{
          drawerLabel: "Contribution Cap",
          drawerIcon: ({ color }) => (
            <Ionicons name="checkmark-circle" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="PensionLimit"
        component={PensionLimitScreen}
        initialParams={{ 
          authToken: userData?.authToken, 
          accountId: userData?.accountId 
        }}
        options={{
          drawerLabel: "Pension Limit",
          drawerIcon: ({ color }) => (
            <Ionicons name="cash" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="EstimatedMemberStatement"
        component={EstimatedMemberStatementScreen}
        initialParams={{ 
          authToken: userData?.authToken, 
          accountId: userData?.accountId 
        }}
        options={{
          drawerLabel: "Estimated Member Statement",
          drawerIcon: ({ color }) => (
            <Ionicons name="document" size={30} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
