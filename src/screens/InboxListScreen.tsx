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

export default function InboxList({ refreshTrigger }: Props) {
  const { userData } = useAuth();
  const navigation = useNavigation<InboxStackNavigationProp<"InboxList">>();
  const [messages, setMessages] = useState<Messages[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);

  useEffect(() => {
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

    fetchData();
  }, [userData?.authToken, userData?.accountId, refreshTrigger]);

  if (loading) {
    return <Text style={styles.loader}>Loading...</Text>;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!messages || messages.length === 0) {
    return <Text style={styles.errorText}>No messages available</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Inbox</Text>
      </View>
      <View style={styles.bodySection}>
        {messages.length === 0 ? (
          <Text style={styles.emptyText}>No queries found.</Text>
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
                  {new Date(item.uploadedDate).toLocaleDateString("en-GB")}
                </Text>
              </TouchableOpacity>
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
      paddingHorizontal: width * 0.02,
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
      paddingVertical: height * 0.02,
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
      fontSize: RFPercentage(2.2),
      color: "#999",
      textAlign: "center",
      marginTop: height * 0.2,
    },
  });
