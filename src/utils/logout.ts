import { NavigationProp } from "@react-navigation/native";
import { Alert } from "react-native";

export const handleLogout = (
  navigation: NavigationProp<any>,
  showConfirmation: boolean = true
) => {
  if (showConfirmation) {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          performLogout(navigation);
        },
      },
    ]);
  } else {
    performLogout(navigation);
  }
};

const performLogout = (navigation: NavigationProp<any>) => {
  navigation.reset({
    index: 0,
    routes: [{ name: "Login" }],
  });
};
