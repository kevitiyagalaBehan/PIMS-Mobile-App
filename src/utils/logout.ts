import { NavigationProp } from "@react-navigation/native";
import { Alert } from "react-native";

export const handleLogout = (navigation: NavigationProp<any>) => {
  Alert.alert("Logout", "Are you sure you want to log out?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Logout",
      onPress: () => {
        navigation.reset({
          index: 0,
          routes: [{ name: "Login" }],
        });
      },
    },
  ]);
};
