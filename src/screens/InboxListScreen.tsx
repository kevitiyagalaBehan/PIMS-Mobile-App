import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useWindowSize } from "../../hooks/useWindowSize";
import { InboxStackNavigationProp } from "../navigation/types";
import { RFPercentage } from "react-native-responsive-fontsize";

const dummyQueries = [
  { id: "1", title: "Account Statement Request", lastCommentDate: "2025-05-10" },
  { id: "2", title: "Incorrect Balance Issue", lastCommentDate: "2025-05-12" },
];

export default function InboxList() {
  const navigation = useNavigation<InboxStackNavigationProp<"InboxList">>();
  const { width, height } = useWindowSize();
  const styles = getStyles(width, height);

  return (
    <View style={styles.container}>
      {dummyQueries.length === 0 ? (
        <Text style={styles.emptyText}>No queries found.</Text>
      ) : (
        <FlatList
          data={dummyQueries}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => navigation.navigate("InboxDetail", { queryId: item.id, title: item.title })}
            >
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.lastCommentDate}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: width * 0.02,
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
