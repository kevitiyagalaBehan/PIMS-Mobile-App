import React from "react";
import {
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Document, HeaderWithMenu } from "../../components";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";

export default function DocumentScreen() {
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width);

  return (
      <SafeAreaView style={styles.container}>
        <HeaderWithMenu />
          <View style={styles.bodySection}>
            <Document />
          </View>
      </SafeAreaView>
    );
  }
  
  const getStyles = (width: number) =>
    StyleSheet.create({
      container: {
        flex: 1,
      },
      bodySection: {
        paddingHorizontal: width * 0.02,
      },
    });
