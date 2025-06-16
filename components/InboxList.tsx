import React, { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { InboxStackNavigationProp, Messages } from "../src/navigation/types";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../src/context/AuthContext";
import { getMessages } from "../src/utils/pimsApi";
import { useRefreshTrigger } from "../hooks/useRefreshTrigger";

export default function InboxList() {
  const { userData } = useAuth();
  const navigation = useNavigation<InboxStackNavigationProp<"InboxList">>();
  const [messages, setMessages] = useState<Messages[] | null>(null);
  const [selectedTab, setSelectedTab] = useState<"received" | "sent">(
    "received"
  );
  const [isScrollable, setIsScrollable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);

  const fetchData = async () => {
    if (!userData?.authToken || !userData?.accountId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const messages = await getMessages(
        userData.authToken,
        userData.accountId
      );
      setMessages(messages);
    } catch (err) {
      setError("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  const receivedCount = messages?.filter((msg) => msg.fromPIMS).length || 0;
  const sentCount = messages?.filter((msg) => !msg.fromPIMS).length || 0;

  const { refreshTrigger, refreshing, onRefresh } =
    useRefreshTrigger(fetchData);

  useEffect(() => {
    fetchData();
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  return (
    <View style={styles.container}>
      <View style={styles.border}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === "received" && styles.activeTab]}
            onPress={() => setSelectedTab("received")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "received" && styles.activeTabText,
              ]}
            >
              Received ({receivedCount})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, selectedTab === "sent" && styles.activeTab]}
            onPress={() => setSelectedTab("sent")}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === "sent" && styles.activeTabText,
              ]}
            >
              Sent ({sentCount})
            </Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <Text style={styles.loader}>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={
              messages?.filter((msg) =>
                selectedTab === "received" ? msg.fromPIMS : !msg.fromPIMS
              ) || []
            }
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.item}
                onPress={() =>
                  navigation.navigate("InboxDetail", {
                    queryId: item.id,
                    title: item.description,
                  })
                }
              >
                <Text style={styles.title}>{item.description}</Text>
                <Text style={styles.date}>
                  {new Date(item.uploadedDate).toLocaleDateString("en-AU", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </Text>
              </TouchableOpacity>
            )}
            refreshing={refreshing}
            onRefresh={onRefresh}
            onContentSizeChange={(_, contentHeight) => {
              setIsScrollable(contentHeight > height);
            }}
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: isScrollable ? height * 0.1 : 0,
            }}
            ListEmptyComponent={() => (
              <Text style={styles.noData}>No messages available</Text>
            )}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      //flex: 1,
      marginVertical: height * 0.02,
      borderRadius: 6,
    },
    border: {
      borderWidth: 1,
      borderColor: "#1B77BE",
      borderRadius: 6,
      paddingHorizontal: height * 0.01,
      //marginBottom: height * 0.01,
    },
    tabContainer: {
      flexDirection: "row",
      marginTop: height * 0.01,
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
      fontSize: RFPercentage(2.2),
      fontWeight: "600",
      color: "#1B77BE",
    },
    activeTabText: {
      color: "#fff",
    },
    errorText: {
      color: "red",
      fontSize: RFPercentage(2),
      textAlign: "center",
      marginTop: height * 0.3,
    },
    loader: {
      fontWeight: "bold",
      color: "#1B77BE",
      fontSize: RFPercentage(2.6),
      marginTop: height * 0.021,
      marginLeft: height * 0.01,
    },
    item: {
      paddingVertical: height * 0.01,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    title: {
      fontSize: RFPercentage(2.5),
      fontWeight: "600",
      color: "#1B77BE",
    },
    date: {
      fontSize: RFPercentage(2),
      color: "#555",
      marginTop: 4,
    },
    noData: {
      textAlign: "center",
      marginVertical: height * 0.02,
      color: "#888",
      fontSize: RFPercentage(2),
    },
  });
