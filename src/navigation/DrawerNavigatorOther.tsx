import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Ionicons from "react-native-vector-icons/Ionicons";
import BottomTabOther from "./BottomTabNavigatorOther";
import InvestmentPerformanceScreen from "../screens/InvestmentPerformanceScreen";
import TopTenInvestmentsScreen from "../screens/TopTenInvestmentsScreen";
import PortfolioBalanceScreen from "../screens/PortfolioBalanceScreen";
import ContributionCapScreen from "../screens/ContributionCapScreen";
import PensionLimitScreen from "../screens/PensionLimitSummaryScreen";
import EstimatedMemberStatementScreen from "../screens/EstimatedMemberStatementScreen";
import CustomDrawerContent from "./CustomDrawerContent";
import { DrawerParamListOther } from "./types";
import { useAuth } from "../context/AuthContext";
import { useAutoLogout } from "../../hooks/useAutoLogout";
import { RFPercentage } from "react-native-responsive-fontsize";

const Drawer = createDrawerNavigator<DrawerParamListOther>();

export default function DrawerNavigatorOther() {
  const { userData } = useAuth();

  useAutoLogout();

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        //drawerType: "back",
        drawerPosition: "right",
        headerShown: false,
        drawerStyle: { width: "75%" },
        drawerItemStyle: {
          borderRadius: 8,
          marginHorizontal: -3,
          marginVertical: 4,
        },
        drawerLabelStyle: {
          fontSize: RFPercentage(2),
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={BottomTabOther}
        initialParams={{
          authToken: userData?.authToken,
          accountId: userData?.accountId,
        }}
        options={{
          drawerLabel: "Home",
          //drawerItemStyle: { display: "none" },
          drawerIcon: ({ color }) => (
            <Ionicons name="home" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="TopTenInvestments"
        component={TopTenInvestmentsScreen}
        initialParams={{
          authToken: userData?.authToken,
          accountId: userData?.accountId,
        }}
        options={{
          drawerLabel: "Top Ten Investments",
          drawerIcon: ({ color }) => (
            <Ionicons name="trending-up" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="InvestmentPerformance"
        component={InvestmentPerformanceScreen}
        initialParams={{
          authToken: userData?.authToken,
          accountId: userData?.accountId,
        }}
        options={{
          drawerLabel: "Investment Performance",
          drawerIcon: ({ color }) => (
            <Ionicons name="speedometer" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="PortfolioBalance"
        component={PortfolioBalanceScreen}
        initialParams={{
          authToken: userData?.authToken,
          accountId: userData?.accountId,
        }}
        options={{
          drawerLabel: "Portfolio Balance Summary",
          drawerIcon: ({ color }) => (
            <Ionicons name="bar-chart" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="ContributionCap"
        component={ContributionCapScreen}
        initialParams={{
          authToken: userData?.authToken,
          accountId: userData?.accountId,
        }}
        options={{
          drawerLabel: "Contribution Cap Summary",
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
          accountId: userData?.accountId,
        }}
        options={{
          drawerLabel: "Pension Limit Summary",
          drawerIcon: ({ color }) => (
            <Ionicons name="briefcase" size={30} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="EstimatedMemberStatement"
        component={EstimatedMemberStatementScreen}
        initialParams={{
          authToken: userData?.authToken,
          accountId: userData?.accountId,
        }}
        options={{
          drawerLabel: "Estimated Member Statement",
          drawerIcon: ({ color }) => (
            <Ionicons name="document-text" size={30} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
