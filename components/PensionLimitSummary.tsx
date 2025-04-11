import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getPensionLimitSummary } from "../src/utils/pimsApi";
import {
  WindowSize,
  Props,
  PensionLimitDetails,
} from "../src/navigation/types";

export default function PensionLimitSummary({ refreshTrigger }: Props) {
  const { userData } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );
  const [pensionLimitSummary, setPensionLimitSummary] =
    useState<PensionLimitDetails | null>(null);
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
        const data = await getPensionLimitSummary(
          userData.authToken,
          userData.accountId
        );

        if (data) {
          setPensionLimitSummary(data);
        } else {
          setError("Failed to load pension limit summary");
        }
      } catch (err) {
        console.error("Error fetching pension limit summary:", err);
        setError("Something went wrong while fetching pension limit summary");
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

  if (!pensionLimitSummary || error) {
    return (
      <View style={styles.errorText}>
        <Text>{error || "No pension data available"}</Text>
      </View>
    );
  }

  const { financialYear, members } = pensionLimitSummary;
  const formatShortFinancialYear = (fy: string) => {
    const [start, end] = fy.split("/");
    return `${start.slice(-2)}/${end.slice(-2)}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bodyText}>
        Pension Limit Summary{" "}
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
        <TableSection label="MINIMUM PENSION PAYMENTS" styles={styles} />
        <TableRow
          label="Paid to date"
          renderRow={(member) => member.drawdownsToDate}
          members={members}
          styles={styles}
        />
        <TableRow
          label="Minimum Pension Amount"
          renderRow={(member) => member.minimumPensionAmount}
          members={members}
          styles={styles}
        />
        <TableRow
          label="Required For Minimum"
          renderRow={(member) => member.requiredForMinimum}
          members={members}
          styles={styles}
        />
        <TableSection label="MAXIMUM PENSION PAYMENTS" styles={styles} />
        <TableRow
          label="Maximum Pension Amount"
          renderRow={(member) => member.maximumPensionAmount}
          members={members}
          styles={styles}
        />
        <TableRow
          label="Remaining To Maximum"
          renderRow={(member) => member.remainingToMaximum}
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
}: {
  label: string;
  renderRow: (member: any) => number;
  members: any[];
  styles: any;
}) => (
  <View style={styles.row}>
    <Text style={[styles.cell, { flex: 2 }]}>{label}</Text>
    {members.map((member) => (
      <Text
        key={member.name}
        style={[styles.cell, styles.rightAlign, { flex: 2 }]}
      >
        {renderRow(member).toLocaleString()}
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
      fontSize: RFPercentage(3),
    },
    tableContainer: {
      marginVertical: height > width ? height * 0.01 : height * 0.015,
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
