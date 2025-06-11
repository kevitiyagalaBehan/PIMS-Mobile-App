import React, { useEffect, useState } from "react";
import {
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { InboxStackNavigationProp, Messages, Props } from "../navigation/types";
import { RFPercentage } from "react-native-responsive-fontsize";
import { useAuth } from "../context/AuthContext";
import { getMessages } from "../utils/pimsApi";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";

export default function InboxList() {
  const { userData } = useAuth();
  const navigation = useNavigation<InboxStackNavigationProp<"InboxList">>();
  const [messages, setMessages] = useState<Messages[] | null>(null);
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

  const { refreshTrigger, refreshing, onRefresh } =
    useRefreshTrigger(fetchData);

  useEffect(() => {
    fetchData();
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  const Header = () => (
    <View style={styles.header}>
      <Text style={styles.headerText}>Inbox</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.bodySection}>
        {loading ? (
          <Text style={styles.loader}>Loading...</Text>
        ) : error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <FlatList
            data={messages}
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
            contentContainerStyle={{
              flexGrow: 1,
              paddingBottom: height * 0.08,
            }}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No messages available</Text>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      height: height * 0.08,
      justifyContent: "center",
      paddingHorizontal: 16,
      backgroundColor: "#fff",
    },
    headerText: {
      fontSize: RFPercentage(2.6),
      fontWeight: "bold",
      color: "#1B77BE",
    },
    bodySection: {
      paddingHorizontal: width * 0.04,
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
    emptyText: {
      fontSize: RFPercentage(2),
      color: "#999",
      textAlign: "center",
      marginTop: height * 0.2,
    },
  });
