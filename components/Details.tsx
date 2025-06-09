import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useAuth } from "../src/context/AuthContext";
import { getClientAccountDetails } from "../src/utils/pimsApi";
import { ClientAccountDetails, Props } from "../src/navigation/types";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function Details({ refreshTrigger }: Props) {
  const { userData } = useAuth();
  const { width, height } = useWindowDimensions();
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<ClientAccountDetails[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const styles = getStyles(width, height);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.authToken || !userData?.accountId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const details = await getClientAccountDetails(
          userData.authToken,
          userData.accountId
        );
        setDetails(details);
      } catch (err) {
        setError("Failed to load account details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  if (loading) {
    return <Text style={styles.loader}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!details || details.length === 0) {
    return <Text style={styles.errorText}>No account details available</Text>;
  }

  const account = details[0];

  const rows = [
    { label: "Portfolio Code", value: account.superFundCode },
    { label: "Account Name", value: account.superFundName },
    { label: "Legal Type", value: account.legalType },
    { label: "Trustee(s)", value: account.trusteeName },
    { label: "Job Type", value: account.jobType },
    { label: "ABN", value: account.fundABN },
    { label: "TFN", value: account.fundTFN || "<<Recorded>>" },
    {
      label: "SOA Date",
      value: new Date(account.soaDate).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    },
    {
      label: "Fund Start Date",
      value: new Date(account.fundStartDate).toLocaleDateString("en-AU", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    },
    { label: "Adviser", value: account.adviserName },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.border}>
        <Text style={styles.bodyText}>Account Details</Text>
        {rows.map((item, index) => (
          <View key={index} style={styles.row}>
            <View style={styles.labelCell}>
              <Text style={styles.labelText}>{item.label}</Text>
            </View>
            <View style={styles.valueCell}>
              <Text style={styles.valueText}>{item.value}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      marginTop: height * 0.02,
      borderRadius: 6,
      backgroundColor: "#fff",
    },
    border: {
      borderWidth: 1,
      borderColor: "#1B77BE",
      borderRadius: 6,
      paddingHorizontal: width * 0.02,
      paddingBottom: height * 0.01,
    },
    bodyText: {
      //fontWeight: "bold",
      color: "#1B77BE",
      marginBottom: height * 0.01,
      fontSize: RFPercentage(2.6),
    },
    row: {
      flexDirection: "row",
      borderWidth: 0.5,
      borderColor: "#ccc",
    },
    labelCell: {
      flex: 1,
      backgroundColor: "#1B77BE",
      justifyContent: "center",
      padding: 10,
    },
    valueCell: {
      flex: 2,
      justifyContent: "center",
      padding: 10,
      backgroundColor: "#fff",
    },
    labelText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
    },
    valueText: {
      color: "#000",
      fontSize: RFPercentage(2),
    },
    errorText: {
      color: "red",
      textAlign: "center",
      fontSize: RFPercentage(2),
      fontWeight: "bold",
      marginTop: height * 0.2,
    },
    loader: {
      fontWeight: "bold",
      color: "#1B77BE",
      fontSize: RFPercentage(2.6),
      marginTop: height * 0.021,
      marginLeft: height * 0.013,
    },
  });
