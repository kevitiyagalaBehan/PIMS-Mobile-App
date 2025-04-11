import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getContributionCapSummary } from "../src/utils/pimsApi";
import { WindowSize, ContributionCap, Props } from "../src/navigation/types";

export default function ContributionCapSummary({ refreshTrigger }: Props) {
  const { userData } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );
  const [data, setData] = useState<ContributionCap | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      setWindowSize(Dimensions.get("window"));
    };
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.authToken || !userData?.accountId) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const result = await getContributionCapSummary(
          userData.authToken,
          userData.accountId
        );

        if (result) {
          setData(result);
        } else {
          setError("Failed to load contribution cap summary");
        }
      } catch (err) {
        console.error("Error fetching contribution cap summary:", err);
        setError("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (loading) {
    return <Text style={styles.bodyText}>Loading...</Text>;
  }

  if (!data || error) {
    return (
      <View style={styles.errorText}>
        <Text>{error || "No contribution cap data available"}</Text>
      </View>
    );
  }

  const { financialYear, members } = data;
  const endDate = new Date(financialYear.endDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const formatShortFinancialYear = (fy: string) => {
    const [start, end] = fy.split("/");
    return `${start.slice(-2)}/${end.slice(-2)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bodyText}>
        Contribution Cap Summary{" "}
        {formatShortFinancialYear(financialYear.financialYear)}
      </Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText1, { flex: 2 }]}>Members</Text>
          {members.map((member) => (
            <Text
              key={member.name}
              style={[styles.tableHeaderText2, styles.rightAlign, { flex: 2 }]}
            >
              {member.name}
            </Text>
          ))}
        </View>
        <TableRow
          label="Age"
          renderRow={(member) => member.age}
          members={members}
          styles={styles}
          endDate={endDate}
        />
        <TableSection label="CONCESSIONAL CONTRIBUTION" styles={styles} />
        <TableRow
          label="Paid to date"
          renderRow={(member) => member.concessionalPaidToDate}
          members={members}
          styles={styles}
        />
        <TableRow
          label="Maximum"
          renderRow={(member) => member.concessionalMaximum}
          members={members}
          styles={styles}
        />
        <TableRow
          label="Available"
          renderRow={(member) => member.concessionalAvailable}
          members={members}
          styles={styles}
        />
        <TableSection label="NON CONCESSIONAL CONTRIBUTION" styles={styles} />
        <TableRow
          label="Paid to date"
          renderRow={(member) => member.nonConcessionalPaidToDate}
          members={members}
          styles={styles}
        />
        <TableRow
          label="Maximum"
          renderRow={(member) => member.nonConcessionalMaximum}
          members={members}
          styles={styles}
        />
        <TableRow
          label="Available"
          renderRow={(member) => member.nonConcessionalAvailable}
          members={members}
          styles={styles}
        />
      </View>
    </View>
  );
}

const TableRow = ({
  label,
  renderRow,
  members,
  styles,
  endDate,
}: {
  label: string;
  renderRow: (member: any) => number;
  members: any[];
  styles: any;
  endDate?: string;
}) => (
  <View style={styles.row}>
    <Text style={[styles.cell, { flex: 2 }]}>
      {label === "Age" && endDate ? `Age (As At ${endDate})` : label}
    </Text>

    {members.map((member) => (
      <Text
        key={member.name}
        style={[styles.cell, styles.rightAlign, { flex: 2 }]}
      >
        {label === "Age"
          ? renderRow(member).toLocaleString()
          : renderRow(member).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
      </Text>
    ))}
  </View>
);

const TableSection = ({ label, styles }: { label: string; styles: any }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionLabel}>{label}</Text>
  </View>
);

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    bodyText: {
      fontWeight: "bold",
      color: "#4A90E2",
      paddingHorizontal: width * 0.015,
      marginTop: height * 0.05,
      fontSize: RFPercentage(2.9),
    },
    tableContainer: {
      marginVertical: height > width ? height * 0.005 : height * 0.015,
      marginHorizontal: height > width ? height * 0.01 : height * 0.015,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#4A90E2",
      paddingVertical: height * 0.008,
      paddingHorizontal: width * 0.02,
      marginBottom: height * 0.001,
      borderRadius: 8,
    },
    tableHeaderText1: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
      textAlign: "left",
    },
    tableHeaderText2: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
      textAlign: "right",
    },
    row: {
      flexDirection: "row",
      paddingVertical: height * 0.008,
      paddingHorizontal: width * 0.02,
      borderBottomWidth: 1,
      borderBottomColor: "#fff",
      alignItems: "center",
      backgroundColor: "#eee",
      borderRadius: 8,
      marginBottom: height * 0.001,
    },
    cell: {
      fontSize: width * 0.035,
      color: "#333",
    },
    rightAlign: {
      textAlign: "right",
    },
    sectionHeader: {
      backgroundColor: "#D0F0FF",
      paddingVertical: height * 0.01,
      paddingHorizontal: width * 0.02,
      marginBottom: height * 0.001,
      borderRadius: 8,
    },
    sectionLabel: {
      fontWeight: "bold",
      fontSize: RFPercentage(2),
    },
    loader: {
      marginTop: height * 0.2,
      alignItems: "center",
      justifyContent: "center",
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2.5),
      textAlign: "center",
      marginTop: height * 0.3,
    },
  });
