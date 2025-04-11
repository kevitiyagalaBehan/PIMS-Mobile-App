import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { loginUser, requestPasswordReset } from "../utils/pimsApi";
import { WindowSize, NavigationProps } from "../navigation/types";
import { SafeAreaView } from "react-native-safe-area-context";
import { RFPercentage } from "react-native-responsive-fontsize";

export default function LoginScreen() {
  const { setUserData } = useAuth();
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [secureTextEntry, setSecureTextEntry] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string>("");
  const navigation = useNavigation<NavigationProps>();

  useEffect(() => {
    const updateSize = () => setWindowSize(Dimensions.get("window"));
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription?.remove();
  }, []);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    try {
      const response = await loginUser(username, password);

      if (!response) throw new Error("Invalid login credentials");

      const { authToken, accountId } = response;

      setUserData({ authToken, accountId });
      navigation.replace("Main");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    }
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    if (emailError) setEmailError("");
  };

  const handleForgotPasswordSubmit = async () => {
    if (!email) {
      setEmailError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    try {
      await requestPasswordReset("temporary-token-or-null", email);

      Alert.alert(
        "Reset Link Sent",
        "If this email is registered, you'll receive a password reset link shortly.",
        [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(false);
              setEmail("");
              setEmailError("");
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        "Reset Link Sent",
        "If this email is registered, you'll receive a password reset link shortly.",
        [
          {
            text: "OK",
            onPress: () => {
              setModalVisible(false);
              setEmail("");
              setEmailError("");
            },
          },
        ]
      );
    }
  };

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  return (
    <SafeAreaView style={styles.container}>
      <Image
        source={require("../../assets/pims_logo.png")}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        onChangeText={setUsername}
        value={username}
        autoCapitalize="none"
        placeholderTextColor="#999"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Enter Password"
          secureTextEntry={secureTextEntry}
          onChangeText={setPassword}
          value={password}
          autoCapitalize="none"
          placeholderTextColor="#999"
        />
        <TouchableOpacity
          onPress={() => setSecureTextEntry(!secureTextEntry)}
          style={styles.eyeIconContainer}
        >
          <FontAwesome
            name={secureTextEntry ? "eye" : "eye-slash"}
            size={20}
            color="#666"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        activeOpacity={0.2}
      >
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEmail("");
          setEmailError("");
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Forgot Password</Text>

            <Text style={styles.modalText}>
              Enter your email address and we'll send you a link to reset your
              password.
            </Text>

            <TextInput
              style={[styles.modalInput, emailError ? styles.inputError : null]}
              placeholder="Enter your email"
              placeholderTextColor="#999"
              onChangeText={handleEmailChange}
              value={email}
              autoCapitalize="none"
              keyboardType="email-address"
              autoFocus={true}
            />

            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.closeButton]}
                onPress={() => {
                  setModalVisible(false);
                  setEmail("");
                  setEmailError("");
                }}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleForgotPasswordSubmit}
                activeOpacity={0.8}
              >
                <Text style={styles.buttonText}>Send</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#fff",
      padding: 20,
    },
    logo: {
      width: width * 1,
      height: height * 0.1,
      marginBottom: height * 0.05,
    },
    input: {
      width: "100%",
      padding: 15,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 10,
      marginBottom: height * 0.01,
      fontSize: RFPercentage(1.8),
      color: "#333",
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "100%",
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 10,
      marginBottom: height * 0.02,
    },
    passwordInput: {
      flex: 1,
      padding: 15,
      fontSize: RFPercentage(1.8),
      color: "#333",
    },
    eyeIconContainer: {
      padding: 10,
      marginRight: width * 0.01,
    },
    loginButton: {
      backgroundColor: "#001F5B",
      padding: 15,
      borderRadius: 10,
      width: "100%",
      alignItems: "center",
      marginBottom: height * 0.02,
    },
    loginButtonText: {
      color: "#fff",
      fontSize: RFPercentage(1.8),
      fontWeight: "bold",
    },
    forgotPassword: {
      color: "#001F5B",
      fontSize: RFPercentage(1.8),
      textDecorationLine: "underline",
    },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      width: width * 0.85,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
    },
    modalTitle: {
      fontSize: RFPercentage(2.8),
      fontWeight: "bold",
      color: "#001F5B",
      marginBottom: height * 0.02,
      textAlign: "center",
    },
    modalText: {
      fontSize: RFPercentage(2),
      color: "#666",
      marginBottom: height * 0.02,
      textAlign: "center",
    },
    modalInput: {
      width: "100%",
      padding: 12,
      borderWidth: 1,
      borderColor: "#ddd",
      borderRadius: 8,
      marginBottom: height * 0.01,
      fontSize: RFPercentage(2),
    },
    inputError: {
      borderColor: "#ff4444",
    },
    errorText: {
      color: "#ff4444",
      fontSize: RFPercentage(1.8),
      marginBottom: height * 0.015,
      paddingHorizontal: width * 0.005,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: height * 0.01,
    },
    button: {
      padding: 12,
      borderRadius: 5,
      width: "48%",
      alignItems: "center",
    },
    submitButton: {
      backgroundColor: "#001F5B",
    },
    closeButton: {
      backgroundColor: "#ccc",
    },
    buttonText: {
      color: "white",
      fontSize: RFPercentage(2),
      fontWeight: "bold",
    },
  });
