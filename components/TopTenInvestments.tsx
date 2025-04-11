import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getTopTenInvestmentDetails } from "../src/utils/pimsApi";
import {
  WindowSize,
  TopTenInvestmentDetails,
  Props,
} from "../src/navigation/types";

export default function TopTenInvestments({ refreshTrigger }: Props) {
  const { userData } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );
  const [investments, setInvestments] = useState<
    TopTenInvestmentDetails[] | null
  >(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] =
    useState<TopTenInvestmentDetails | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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
        const data = await getTopTenInvestmentDetails(
          userData.authToken,
          userData.accountId
        );
        setInvestments(data);
      } catch (err) {
        setError("Failed to load investment details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  const handleCodePress = (item: TopTenInvestmentDetails) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  if (!investments || error) {
    return (
      <Text style={styles.errorText}>
        {error || "No investments data available"}
      </Text>
    );
  }

  if (loading) {
    return <Text style={styles.bodyText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.bodyText}>Top Ten Investments</Text>

      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.headerCell1, { flex: 1 }]}>Code</Text>
          <Text style={[styles.headerCell2, { flex: 1 }]}>Value $</Text>
          <Text style={[styles.headerCell2, { flex: 1 }]}>%</Text>
        </View>

        {investments?.map((item) => (
          <View key={item.code} style={styles.dataRow}>
            <TouchableOpacity
              onPress={() => handleCodePress(item)}
              style={{ flex: 1 }}
            >
              <Text
                style={[styles.dataCell, styles.boldText, styles.leftAlign]}
                numberOfLines={1}
              >
                {item.code}
              </Text>
            </TouchableOpacity>
            <Text
              style={[styles.dataCell, styles.rightAlign, { flex: 1 }]}
              numberOfLines={1}
            >
              {item.value.toLocaleString()}
            </Text>
            <Text
              style={[styles.dataCell, styles.rightAlign, { flex: 1 }]}
              numberOfLines={1}
            >
              {item.percentage.toFixed(2)}
            </Text>
          </View>
        ))}
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
                <Text style={styles.modalTitle}>{selectedItem.code}</Text>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Description:</Text>
                  <Text style={styles.modalText}>
                    {selectedItem.description}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Quantity:</Text>
                  <Text style={styles.modalText}>
                    {selectedItem.quantity.toFixed(1)}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Value:</Text>
                  <Text style={styles.modalText}>
                    ${selectedItem.value.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Percentage:</Text>
                  <Text style={styles.modalText}>
                    {selectedItem.percentage.toFixed(2)}%
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
  );
}

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
      marginVertical: height > width ? height * 0.005 : height * 0.015,
      marginHorizontal: height > width ? height * 0.01 : height * 0.015,
    },
    loader: {
      marginTop: height * 0.3,
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2.5),
      textAlign: "center",
      marginTop: height * 0.3,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#4A90E2",
      paddingVertical: height * 0.008,
      paddingHorizontal: width * 0.02,
      borderRadius: 8,
      marginBottom: height * 0.001,
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
      paddingVertical: height * 0.008,
      paddingHorizontal: width * 0.02,
      borderBottomWidth: 1,
      borderBottomColor: "#fff",
      alignItems: "center",
      backgroundColor: "#eee",
      borderRadius: 8,
    },
    dataCell: {
      fontSize: width * 0.035,
      color: "#333",
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
      fontSize: RFPercentage(3),
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
      fontSize: width * 0.04,
    },
    modalText: {
      flex: 1,
      fontSize: width * 0.04,
    },
    closeButton: {
      marginTop: height * 0.02,
      backgroundColor: "#4A90E2",
      padding: width * 0.03,
      borderRadius: 5,
      alignItems: "center",
    },
    closeButtonText: {
      color: "white",
      fontWeight: "bold",
    },
  });
