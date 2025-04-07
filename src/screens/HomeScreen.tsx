import React, { useState, useEffect } from "react";
import { StyleSheet, Dimensions, FlatList,
  RefreshControl,
  View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { WindowSize } from "../navigation/types";
import { useRefreshTrigger } from "../../hooks/useRefreshTrigger";
import { Header, PortfolioSummary, Drawer } from "../../components";

export default function HomeScreen() {
  const [windowSize, setWindowSize] = useState<WindowSize>(
    Dimensions.get("window")
  );
  const { refreshTrigger, refreshing, onRefresh } = useRefreshTrigger();

  useEffect(() => {
    const updateSize = () => {
      setWindowSize(Dimensions.get("window"));
    };
    const subscription = Dimensions.addEventListener("change", updateSize);
    return () => subscription.remove();
  }, []);

  const { width, height } = windowSize;
  const styles = getStyles(width, height);

  return (
    <SafeAreaView style={styles.container}>
      <Drawer />
      <FlatList
        data={[]}
        keyExtractor={() => "dummy"}
        renderItem={null}
        ListHeaderComponent={
          <View>
            <Header refreshTrigger={refreshTrigger} refreshing={refreshing} />
            <PortfolioSummary refreshTrigger={refreshTrigger} refreshing={refreshing} />
          </View>
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}

const getStyles = (width: number, height: number) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: width * 0.02,
      flex: 1,
      backgroundColor: "#fff",
    },
  });
