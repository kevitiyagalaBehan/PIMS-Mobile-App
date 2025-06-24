import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  useWindowDimensions,
  Linking,
  FlatList,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getAASDocuments, getDocumentViewUrl } from "../src/utils/pimsApi";
import { Documents } from "../src/navigation/types";
import { Base64 } from "js-base64";
import { useRefreshTrigger } from "../hooks/useRefreshTrigger";

export default function Document() {
  const { userData } = useAuth();
  const { width, height } = useWindowDimensions();
  const [documents, setDocuments] = useState<Documents[] | null>(null);
  const [selectedTab, setSelectedTab] = useState<"aasFolders" | "aasDocuments">(
    "aasFolders"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<Documents | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    if (!userData?.authToken) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await getAASDocuments(userData.authToken);
      setDocuments(data?.slice(0, 20) || []);
    } catch (err) {
      setError("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const { refreshTrigger, refreshing, onRefresh } =
    useRefreshTrigger(fetchData);

  useEffect(() => {
    fetchData();
  }, [userData?.authToken, refreshTrigger]);

  const styles = getStyles(width, height);

  if (loading) {
    return <Text style={styles.loader}>Loading...</Text>;
  }

  if (!documents || documents.length === 0) {
    return <Text style={styles.errorText}>No documents available</Text>;
  }

  const handleCodePress = (item: Documents) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      <View style={styles.border}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "aasFolders" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("aasFolders")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "aasFolders" && styles.activeTabText,
              ]}
            >
              AAS Folders
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === "aasDocuments" && styles.activeTab,
            ]}
            onPress={() => setSelectedTab("aasDocuments")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "aasDocuments" && styles.activeTabText,
              ]}
            >
              AAS Documents
            </Text>
          </TouchableOpacity>
        </View>
        {selectedTab === "aasFolders" && (
          <View>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { flex: 1 }]}>Name</Text>
                <Text
                  style={[styles.headerCell, { flex: 1 }]}
                >
                  Modified Date
                </Text>
              </View>
            </View>
          </View>
        )}

        {selectedTab === "aasDocuments" && (
          <View>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={[styles.headerCell, { flex: 3.5 }]}>Name</Text>
                <Text
                  style={[styles.headerCell, { flex: 1, textAlign: "center" }]}
                >
                  Action
                </Text>
              </View>

              <FlatList
                data={documents}
                keyExtractor={(item) => item.id}
                renderItem={({ item, index }) => (
                  <View
                    style={[
                      styles.dataRow,
                      { backgroundColor: index % 2 === 0 ? "#eee" : "#fff" },
                    ]}
                  >
                    <TouchableOpacity
                      onPress={() => handleCodePress(item)}
                      style={{ flex: 3.5 }}
                    >
                      <Text
                        style={[
                          styles.dataCell,
                          styles.leftAlign,
                          styles.underlineText,
                        ]}
                        //numberOfLines={1}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: "center" }}>
                      <TouchableOpacity
                        style={styles.button}
                        onPress={async () => {
                          try {
                            if (!userData?.authToken) {
                              Alert.alert(
                                "Error",
                                "User is not authenticated."
                              );
                              return;
                            }

                            const encodedPath = Base64.encode(item.fullPath);
                            const docUrl = await getDocumentViewUrl(
                              encodedPath,
                              userData.authToken
                            );

                            if (docUrl) {
                              Linking.openURL(docUrl);
                            } else {
                              Alert.alert(
                                "Error",
                                "Unable to retrieve document URL."
                              );
                            }
                          } catch (error) {
                            Alert.alert(
                              "Error",
                              "Failed to open the document."
                            );
                          }
                        }}
                      >
                        <Text style={styles.buttonText}>Open</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                refreshing={refreshing}
                onRefresh={onRefresh}
                contentContainerStyle={{
                  flexGrow: 1,
                  paddingBottom: height * 0.43,
                }}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                  <Text style={styles.noData}>No documents available</Text>
                )}
              />
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
                      <Text style={styles.modalTitle}>{selectedItem.name}</Text>
                      <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Modified Date:</Text>
                        <Text style={styles.modalText}>
                          {new Date(
                            selectedItem.lastModified
                          ).toLocaleDateString("en-AU", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Folder:</Text>
                        <Text style={styles.modalText}>
                          {selectedItem.folder}
                        </Text>
                      </View>
                      <View style={styles.modalRow}>
                        <Text style={styles.modalLabel}>Size:</Text>
                        <Text style={styles.modalText}>
                          {selectedItem.sizeText}
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
        )}
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
    border: {
      borderWidth: 1,
      borderColor: "#1B77BE",
      borderRadius: 6,
      padding: width * 0.02,
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
      //marginBottom: height * 0.001,
    },
    headerCell: {
      color: "white",
      fontWeight: "bold",
      fontSize: RFPercentage(2),
      textAlign: "left",
    },
    dataRow: {
      flexDirection: "row",
      paddingVertical: height * 0.005,
      paddingHorizontal: width * 0.02,
      alignItems: "center",
      borderWidth: 1,
      borderColor: "#ccc",
    },
    dataCell: {
      fontSize: RFPercentage(2),
      color: "#333",
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
    button: {
      backgroundColor: "#1B77BE",
      paddingVertical: height * 0.007,
      paddingHorizontal: width * 0.04,
      borderRadius: 6,
    },
    buttonText: {
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
