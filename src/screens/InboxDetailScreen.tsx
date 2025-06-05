import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRoute, useNavigation } from "@react-navigation/native";
import { InboxRouteProp } from "../navigation/types";
import { RFPercentage } from "react-native-responsive-fontsize";

const dummyComments = [
  {
    id: "101",
    text: "Please send your latest account statement.",
    date: "2025-05-09",
    author: "Peter",
  },
];

export default function InboxDetail() {
  const route = useRoute<InboxRouteProp<"InboxDetail">>();
  const navigation = useNavigation();
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(dummyComments);
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width, height);
  const handleSend = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: String(Date.now()),
      text: newComment,
      date: new Date().toISOString().split("T")[0],
      author: "Behan",
    };
    setComments((prev) => [...prev, comment]);
    setNewComment("");
  };

  useLayoutEffect(() => {
    navigation.setOptions({ title: route.params.title });
  }, [navigation, route.params.title]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "android" ? "padding" : undefined}
    >
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.commentList}
        renderItem={({ item }) => {
          const isSent = item.author === "Behan";
          return (
            <View
              style={[
                styles.comment,
                isSent ? styles.sentComment : styles.receivedComment,
              ]}
            >
              {!isSent && <Text style={styles.author}>{item.author}</Text>}
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          );
        }}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a comment..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    commentList: {
      padding: width * 0.02,
    },
    comment: {
      maxWidth: "80%",
      padding: 10,
      borderRadius: 10,
      marginBottom: height * 0.015,
    },
    sentComment: {
      alignSelf: "flex-end",
      backgroundColor: "#CDEBFA",
      borderTopRightRadius: 0,
    },
    receivedComment: {
      alignSelf: "flex-start",
      backgroundColor: "#fff",
      borderTopLeftRadius: 0,
    },
    author: {
      fontWeight: "bold",
      fontSize: RFPercentage(2.2),
      color: "#1B77BE",
    },
    text: {
      fontSize: RFPercentage(2),
      marginVertical: 4,
      color: "#000",
    },
    date: {
      fontSize: RFPercentage(1.8),
      color: "#888",
    },
    inputContainer: {
      borderTopWidth: 1,
      borderColor: "#ccc",
      padding: width * 0.02,
      backgroundColor: "#f9f9f9",
    },
    input: {
      borderWidth: 1,
      borderColor: "#ccc",
      borderRadius: 10,
      padding: 10,
      fontSize: RFPercentage(2),
      marginBottom: 10,
      backgroundColor: "#fff",
    },
    button: {
      backgroundColor: "#00205A",
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: "center",
    },
    buttonText: {
      color: "#fff",
      fontSize: RFPercentage(2),
      fontWeight: "bold",
    },
  });
