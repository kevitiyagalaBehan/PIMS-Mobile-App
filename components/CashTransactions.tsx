import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  useWindowDimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getCashTransactions } from "../src/utils/pimsApi";
import { CashTransactions } from "../src/navigation/types";
import { useRefreshTrigger } from "../hooks/useRefreshTrigger";

export default function Transactions() {
  const { userData } = useAuth();
  const { width, height } = useWindowDimensions();
  const [transactions, setTransactions] = useState<CashTransactions[] | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<CashTransactions | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    if (!userData?.authToken || !userData?.accountId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getCashTransactions(
        userData.authToken,
        userData.accountId
      );

      const classificationOptions = Array.from(
        new Set(transactions?.map((t) => t.classification))
      );
      const cashAccountOptions = Array.from(
        new Set(transactions?.map((t) => t.holdingDescription))
      );

      //console.log("Classifications:", classificationOptions);
      //console.log("Description:", cashAccountOptions);

      setTransactions(data);
    } catch (err) {
      setError("Failed to load transaction details");
    } finally {
      setLoading(false);
    }
  };

  const { refreshTrigger, refreshing, onRefresh } =
    useRefreshTrigger(fetchData);

  useEffect(() => {
    fetchData();
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  const handleCodePress = (item: CashTransactions) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const styles = getStyles(width, height);

  if (loading) {
    return <Text style={styles.loader}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!transactions || transactions.length === 0) {
    return <Text style={styles.errorText}>No transactions data available</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.border}>
        <Text style={styles.bodyText}>Cash Transactions</Text>

        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell1, { flex: 1.5 }]}>
              Date Description
            </Text>
            <Text style={[styles.headerCell2, { flex: 1 }]}>Amount $</Text>
            <Text style={[styles.headerCell2, { flex: 1 }]}>Balance $</Text>
          </View>
          {transactions.length > 0 ? (
            <FlatList
              data={transactions}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item, index }) => (
                <View
                  style={[
                    styles.dataRow,
                    { backgroundColor: index % 2 === 0 ? "#eee" : "#fff" },
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => handleCodePress(item)}
                    style={{ flex: 1.5 }}
                  >
                    <View style={{ flexDirection: "column" }}>
                      <Text style={[styles.dataCell, styles.leftAlign]}>
                        {new Date(item.transactionDate).toLocaleDateString(
                          "en-AU",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </Text>
                      <Text style={[styles.dataCell, styles.leftAlign]}>
                        {item.transactionDescription?.includes(
                          "Closing Balance"
                        )
                          ? item.transactionDescription
                              .replace("Closing Balance", "")
                              .trim()
                          : item.transactionDescription}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <Text
                    style={[styles.dataCell, styles.rightAlign, { flex: 1 }]}
                    numberOfLines={1}
                  >
                    {item.debit != null ? item.debit.toLocaleString() : ""}
                  </Text>
                  <Text
                    style={[styles.dataCell, styles.rightAlign, { flex: 1 }]}
                    numberOfLines={1}
                  >
                    {item.balance.toLocaleString()}
                  </Text>
                </View>
              )}
              refreshing={refreshing}
              onRefresh={onRefresh}
              style={styles.listContentContainer}
            />
          ) : (
            <Text style={styles.noData}>No transactions available</Text>
          )}
        </View>

        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedItem && (
                <>
                  <Text style={styles.modalTitle}>
                    {selectedItem.holdingDescription}
                  </Text>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Date:</Text>
                    <Text style={styles.modalText}>
                      {new Date(
                        selectedItem.transactionDate
                      ).toLocaleDateString("en-GB")}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Classification:</Text>
                    <Text style={styles.modalText}>
                      {selectedItem.classification}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Withdrawal:</Text>
                    <Text style={styles.modalText}>
                      {selectedItem.debit != null
                        ? selectedItem.debit.toLocaleString()
                        : ""}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Deposit:</Text>
                    <Text style={styles.modalText}>
                      {selectedItem.credit != null
                        ? selectedItem.credit.toLocaleString()
                        : ""}
                    </Text>
                  </View>
                  <View style={styles.modalRow}>
                    <Text style={styles.modalLabel}>Balance:</Text>
                    <Text style={styles.modalText}>
                      {selectedItem.balance.toLocaleString()}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModalVisible(false)}
                  >
                    <Text style={styles.closeButtonText}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      marginTop: height * 0.02,
      backgroundColor: "#fff",
      borderRadius: 6,
    },
    listContentContainer: {
      //paddingBottom: height * 0.44,
    },
    border: {
      borderWidth: 1,
      borderColor: "#1B77BE",
      borderRadius: 6,
      paddingHorizontal: width * 0.02,
    },
    bodyText: {
      //fontWeight: "bold",
      color: "#1B77BE",
      marginBottom: height * 0.005,
      fontSize: RFPercentage(2.6),
    },
    tableContainer: {
      paddingBottom: height * 0.01,
    },
    loader: {
      fontWeight: "bold",
      color: "#1B77BE",
      fontSize: RFPercentage(2.6),
      marginTop: height * 0.021,
      marginLeft: height * 0.01,
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2),
      textAlign: "center",
      marginTop: height * 0.3,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#1B77BE",
      paddingVertical: height * 0.005,
      paddingHorizontal: width * 0.02,
    },
    headerCell1: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
      textAlign: "left",
    },
    headerCell2: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
      textAlign: "right",
    },
    dataRow: {
      flexDirection: "row",
      paddingVertical: height * 0.005,
      paddingHorizontal: width * 0.02,
      borderBottomWidth: 1,
      borderBottomColor: "#fff",
      alignItems: "center",
    },
    dataCell: {
      fontSize: RFPercentage(2),
      color: "#333",
    },
    noData: {
      textAlign: "center",
      marginVertical: height * 0.02,
      color: "#888",
      fontSize: RFPercentage(2),
    },
    underlineText: {
      textDecorationLine: "underline",
      color: "#1B77BE",
    },
    leftAlign: {
      textAlign: "left",
    },
    centerAlign: {
      textAlign: "center",
    },
    rightAlign: {
      textAlign: "right",
    },
    boldText: {
      fontWeight: "bold",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      width: width * 0.8,
      backgroundColor: "white",
      borderRadius: 10,
      padding: width * 0.05,
    },
    modalTitle: {
      fontSize: RFPercentage(2.5),
      fontWeight: "bold",
      color: "#4A90E2",
      marginBottom: height * 0.02,
      textAlign: "center",
    },
    modalRow: {
      flexDirection: "row",
      marginBottom: height * 0.015,
    },
    modalLabel: {
      fontWeight: "bold",
      width: width * 0.3,
      fontSize: RFPercentage(2),
    },
    modalText: {
      flex: 1,
      fontSize: RFPercentage(2),
    },
    closeButton: {
      marginTop: height * 0.02,
      backgroundColor: "#00205A",
      padding: width * 0.03,
      borderRadius: 10,
      alignItems: "center",
    },
    closeButtonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
    },
  });
