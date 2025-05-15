import { View, Text, StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getLinkedUsers } from "../src/utils/pimsApi";
import { useWindowSize } from "../hooks/useWindowSize";
import Drawer from "./Drawer";

export default function Header() {
  const { userData, setCurrentAccountName, currentAccountName } = useAuth();

  const { width, height } = useWindowSize();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!userData?.authToken) {
        setCurrentAccountName(null);
        return;
      }

      const accountName = await getLinkedUsers(userData.authToken);
      setCurrentAccountName(accountName?.assignedAccount || "User not found");
    };

    fetchUserData();
  }, [userData?.authToken]);

  const styles = getStyles(width, height);

  if (!userData?.authToken || !userData?.accountId) return null;

  return (
    <View style={styles.headerSection}>
      <Drawer />
      <Text style={styles.accountNameText}>
        {currentAccountName || "Loading user..."}
      </Text>
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    headerSection: {
      backgroundColor: "#fff",
      paddingHorizontal: width * 0.02,
    },
    accountNameText: {
      fontSize: RFPercentage(2.7),
      fontWeight: "bold",
      color: "#1B77BE",
      marginBottom: height * 0.01,
    },
  });
