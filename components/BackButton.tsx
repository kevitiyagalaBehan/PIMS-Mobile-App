import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { RFPercentage } from "react-native-responsive-fontsize";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../src/navigation/types";
import { StackNavigationProp } from "@react-navigation/stack";

type AssetAllocationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Home"
>;

export default function BackButton() {
    const navigation = useNavigation<AssetAllocationScreenNavigationProp>();

  return (
    <View>
      <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#4A90E2" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
      },
      backButtonText: {
        color: "#4A90E2",
        fontSize: RFPercentage(2),
        marginLeft: 5,
      },
})