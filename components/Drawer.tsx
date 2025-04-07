import { View, TouchableOpacity } from "react-native";
import React from "react";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function Drawer() {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{ paddingTop: 10 }}
      >
        <Ionicons name="menu" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}
