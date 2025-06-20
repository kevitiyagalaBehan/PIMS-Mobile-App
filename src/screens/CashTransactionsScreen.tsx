import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { HeaderWithMenu, CashTransactions } from "../../components";

export default function CashTransactionsScreen() {
  const { width, height } = useWindowDimensions();
  const styles = getStyles(width);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithMenu />
        <View style={styles.bodySection}>
          <CashTransactions />
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
