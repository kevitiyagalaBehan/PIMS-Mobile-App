import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Linking,
} from "react-native";
import { getEsignDocuments } from "../src/utils/pimsApi";
import { EsignDocument, Props } from "../src/navigation/types";
import { useAuth } from "../src/context/AuthContext";
import { useWindowSize } from "../hooks/useWindowSize";
import { RFPercentage } from "react-native-responsive-fontsize";
import Constants from "expo-constants";

const eSigningBaseUrl = Constants.expoConfig?.extra?.eSigningBaseUrl as string;

export default function ESigning({ refreshTrigger }: Props) {
  const { userData } = useAuth();
  const [documents, setDocuments] = useState<EsignDocument[]>([]);
  const [selectedTab, setSelectedTab] = useState<"toSign" | "signed">("toSign");
  const [selectedDocument, setSelectedDocument] =
    useState<EsignDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const { width, height } = useWindowSize();
  const styles = getStyles(width, height);

  useEffect(() => {
    const fetchData = async () => {
      if (!userData?.authToken || !userData?.accountId) {
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        const data = await getEsignDocuments(
          userData.authToken,
          userData.accountId
        );
        setDocuments(data || []);
      } catch (err) {
        console.error("Failed to load documents:", err);
        setDocuments([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  const filteredDocs = documents.filter((doc) =>
    selectedTab === "toSign"
      ? doc.signatories.some((s) => s.esigningStatus !== "Signed")
      : doc.signatories.every((s) => s.esigningStatus === "Signed")
  );

  const toBeSignedCount = documents.filter((doc) =>
    doc.signatories.some((s) => s.esigningStatus !== "Signed")
  ).length;

  const signedCount = documents.filter((doc) =>
    doc.signatories.every((s) => s.esigningStatus === "Signed")
  ).length;

  const handleSign = (esigningDetailId: string) => {
    Linking.openURL(
      `${eSigningBaseUrl}/ESigning/EmbeddedSigning.aspx?id=${esigningDetailId}`
    );
  };

  const renderItem = ({
    item,
    index,
  }: {
    item: EsignDocument;
    index: number;
  }) => {
    const hasSignable = item.signatories.some((s) => s.esigningDetailId);
    const firstValidId = item.signatories.find(
      (s) => s.esigningDetailId
    )?.esigningDetailId;
    const documentToOpen = item.documents?.[0]?.documentPath;

    return (
      <View
        style={[
          styles.dataRow,
          { backgroundColor: index % 2 === 0 ? "#eee" : "#fff" },
        ]}
      >
        <TouchableOpacity
          style={{ flex: 1.3 }}
          onPress={() => setSelectedDocument(item)}
        >
          <Text
            style={[styles.dataCell, styles.boldText, styles.underlineText]}
          >
            {item.subject}
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1.5 }}>
          <Text
            style={[styles.dataCell, styles.boldText, { flexWrap: "wrap" }]}
          >
            {item.signatories.map((s, index) => {
              let color = "#D41515";
              if (s.esigningStatus === "Signed") color = "#48C738";
              else if (s.esigningStatus === "Viewed") color = "#CAD415";

              return (
                <Text key={index} style={{ color }}>
                  {s.signatoryName}
                  {index < item.signatories.length - 1 ? ", " : ""}
                </Text>
              );
            })}
          </Text>
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          {selectedTab === "toSign" && hasSignable && firstValidId && (
            <TouchableOpacity
              style={styles.signBtn}
              onPress={() => handleSign(firstValidId)}
            >
              <Text style={styles.signBtnText}>Sign</Text>
            </TouchableOpacity>
          )}
          {selectedTab === "signed" && documentToOpen && (
            <TouchableOpacity
              style={styles.signBtn}
              onPress={() =>
                Linking.openURL(`${eSigningBaseUrl}/${documentToOpen}`)
              }
            >
              <Text style={styles.signBtnText}>Open</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return <Text style={styles.loader}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.border}>
        <Text style={styles.bodyText}>E-Signing Documents</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "toSign" && styles.activeTab]}
            onPress={() => setSelectedTab("toSign")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "toSign" && styles.activeTabText,
              ]}
            >
              To Be Signed ({toBeSignedCount})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "signed" && styles.activeTab]}
            onPress={() => setSelectedTab("signed")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "signed" && styles.activeTabText,
              ]}
            >
              Signed ({signedCount})
            </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.tableContainer}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { flex: 1.3 }]}>Subject</Text>
            <Text style={[styles.headerCell, { flex: 1.5 }]}>Signatories</Text>
            <Text style={[styles.headerCell, { flex: 1, textAlign: "center" }]}>
              Action
            </Text>
          </View>

          {filteredDocs.length > 0 ? (
            <FlatList
              data={filteredDocs}
              renderItem={({ item, index }) => renderItem({ item, index })}
              keyExtractor={(_, i) => i.toString()}
            />
          ) : (
            <Text style={styles.noData}>No documents available</Text>
          )}

          <Modal
            animationType="fade"
            transparent={true}
            visible={!!selectedDocument}
            onRequestClose={() => setSelectedDocument(null)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>
                  {selectedDocument?.subject}
                </Text>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Code:</Text>
                  <Text style={styles.modalText}>
                    {selectedDocument?.esigningCode || "N/A"}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Sent Date:</Text>
                  <Text style={styles.modalText}>
                    {selectedDocument?.sentDate
                      ? new Date(selectedDocument.sentDate).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Account:</Text>
                  <Text style={styles.modalText}>
                    {selectedDocument?.accountName || "N/A"}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Sent By:</Text>
                  <Text style={styles.modalText}>
                    {selectedDocument?.sentBy || "N/A"}
                  </Text>
                </View>
                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Signatories: </Text>
                  <Text style={styles.modalText}>
                    {selectedDocument?.signatories
                      .map((s) => s.signatoryName)
                      .join(", ")}
                  </Text>
                </View>

                <View style={styles.modalRow}>
                  <Text style={styles.modalLabel}>Due Date:</Text>
                  <Text style={styles.modalText}>
                    {selectedDocument?.dueDate
                      ? new Date(selectedDocument.dueDate).toLocaleDateString()
                      : "N/A"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedDocument(null)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
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
    loader: {
      fontWeight: "bold",
      color: "#1B77BE",
      fontSize: RFPercentage(2.6),
      marginTop: height * 0.021,
      marginLeft: height * 0.013,
    },
    border: {
      borderWidth: 1,
      borderColor: "#1B77BE",
      borderRadius: 6,
      paddingHorizontal: width * 0.02,
    },
    bodyText: {
      fontWeight: "bold",
      color: "#1B77BE",
      fontSize: RFPercentage(2.6),
      marginBottom: height * 0.005,
    },
    tabContainer: {
      flexDirection: "row",
    },
    tab: {
      flex: 1,
      padding: 12,
      backgroundColor: "#fff",
      alignItems: "center",
    },
    activeTab: {
      backgroundColor: "#1B77BE",
    },
    tabText: {
      fontSize: RFPercentage(2),
      fontWeight: "bold",
      color: "#1B77BE",
    },
    activeTabText: {
      color: "#fff",
    },
    tableContainer: {
      paddingBottom: height * 0.01,
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#1B77BE",
      paddingVertical: height * 0.006,
      paddingHorizontal: width * 0.02,
    },
    headerCell: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
    },
    dataRow: {
      flexDirection: "row",
      paddingVertical: height * 0.007,
      paddingHorizontal: width * 0.02,
      alignItems: "center",
    },
    dataCell: {
      fontSize: RFPercentage(2),
      color: "#333",
    },
    underlineText: {
      textDecorationLine: "underline",
      color: "#4A90E2",
    },
    boldText: {
      fontWeight: "bold",
    },
    signBtn: {
      backgroundColor: "#1B77BE",
      paddingVertical: height * 0.007,
      paddingHorizontal: width * 0.04,
      borderRadius: 6,
    },
    signBtnText: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
    },
    noData: {
      textAlign: "center",
      marginVertical: height * 0.02,
      color: "#888",
      fontSize: RFPercentage(2),
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
      fontSize: RFPercentage(2.6),
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
