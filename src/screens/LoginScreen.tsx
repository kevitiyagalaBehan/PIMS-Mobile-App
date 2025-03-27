import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../utils/pimsApi";

type NavigationProps = {
  replace: (screen: string) => void;
};

export default function LoginScreen() {
  const { setUserData } = useAuth();
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProps>();

  const handleLogin = async () => {
    try {
      const response = await loginUser(username, password);

      if (!response) throw new Error("Invalid login credentials");

      const { authToken, accountId } = response;

      setUserData({ authToken, accountId });
      navigation.replace("Home");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/PIMS_Logo.png")}
        style={styles.logo}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter Password"
          secureTextEntry={secureTextEntry}
          onChangeText={setPassword}
          value={password}
          autoCapitalize="none"
        />
        <TouchableOpacity onPress={() => setSecureTextEntry(!secureTextEntry)}>
          <FontAwesome
            name={secureTextEntry ? "eye" : "eye-slash"}
            size={24}
            color="black"
            style={styles.eyeIcon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => console.log("Forgot Password Pressed")}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: {
    width: 250,
    height: 60,
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  passwordInput: {
    flex: 1,
    padding: 12,
  },
  eyeIcon: {
    padding: 10,
  },
  loginButton: {
    backgroundColor: "#001F5B",
    padding: 12,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    color: "#001F5B",
    fontSize: 14,
    textDecorationLine: "underline",
  },
});
