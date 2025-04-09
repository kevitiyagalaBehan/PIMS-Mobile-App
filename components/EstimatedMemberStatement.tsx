import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getEstimatedMemberStatement } from "../src/utils/pimsApi";
import {
  WindowSize,
  EstimatedMemberDetails,
  Props,
} from "../src/navigation/types";

export default function EstimatedMemberStatement({ refreshTrigger }: Props) {
  const { userData } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );
  const [estimatedMemberStatement, setEstimatedMemberStatement] = useState<
    EstimatedMemberDetails[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setFullYear(toDate.getFullYear() - 1);

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

      const data = await getEstimatedMemberStatement(
        userData.authToken,
        userData.accountId,
        fromDate,
        toDate
      );

      if (Array.isArray(data)) {
        setEstimatedMemberStatement(data);
      } else {
        setError("Invalid response format");
      }

      setLoading(false);
    };

    fetchData();
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (loading) {
    return (
      <View style={styles.loader}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!estimatedMemberStatement || error) {
    return (
      <View style={styles.loader}>
        <Text style={styles.errorText}>{error || "No data available"}</Text>
      </View>
    );
  }

  const members = estimatedMemberStatement;

  const formatWithPercentage = (value: number, total: number): string => {
    if (!total || total === 0) return "0 (0%)";
    const percentage = (value / total) * 100;
    return `${value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
    })} (${percentage.toFixed(2)}%)`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.bodyText}>
        Estimated Member Statement As At{" "}
        {new Date().toLocaleDateString("en-GB")}
      </Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableHeaderText1, { flex: 2 }]}>Members</Text>
          {members.map((member) => (
            <Text
              key={member.memberName}
              style={[styles.tableHeaderText2, styles.rightAlign, { flex: 2 }]}
            >
              {member.memberName}
            </Text>
          ))}
        </View>

        <TableRow
          label="ACCUMULATION"
          renderRow={(member) =>
            formatWithPercentage(
              member.accumulation,
              member.accumulation + member.pension
            )
          }
          members={members}
          styles={styles}
        />
        <TableRow
          label="PENSION"
          renderRow={(member) =>
            formatWithPercentage(
              member.pension,
              member.accumulation + member.pension
            )
          }
          members={members}
          styles={styles}
        />
        <TableRow
          label={`TOTAL AS AT ${new Date().toLocaleDateString("en-GB")}`}
          renderRow={(member) =>
            (member.accumulation + member.pension).toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })
          }
          members={members}
          styles={styles}
          bold
        />

        <TableSection label="TAX COMPONENTS" styles={styles} />
        <TableRow
          label="TAX FREE"
          renderRow={(member) =>
            formatWithPercentage(
              member.taxFree,
              member.taxFree + member.taxableTaxed + member.taxableUntaxed
            )
          }
          members={members}
          styles={styles}
        />
        <TableRow
          label="TAXABLE TAXED"
          renderRow={(member) =>
            formatWithPercentage(
              member.taxableTaxed,
              member.taxFree + member.taxableTaxed + member.taxableUntaxed
            )
          }
          members={members}
          styles={styles}
        />
        <TableRow
          label="TAXABLE UNTAXED"
          renderRow={(member) =>
            formatWithPercentage(
              member.taxableUntaxed,
              member.taxFree + member.taxableTaxed + member.taxableUntaxed
            )
          }
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
  bold = false,
}: {
  label: string;
  renderRow: (member: any) => string;
  members: any[];
  styles: any;
  bold?: boolean;
}) => (
  <View style={styles.row}>
    <Text style={[styles.cell, bold && styles.boldText, { flex: 2 }]}>
      {label}
    </Text>
    {members.map((member) => (
      <Text
        key={member.memberName}
        style={[styles.cell, styles.rightAlign, bold && styles.boldText, { flex: 2 }]}
      >
        {renderRow(member)}
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
      fontSize: RFPercentage(2.4),
    },
    tableContainer: {
      marginVertical: height > width ? height * 0.005 : height * 0.015,
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
      fontSize: RFPercentage(1.6),
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
    boldText: {
      fontWeight: "bold",
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
    },
  });
