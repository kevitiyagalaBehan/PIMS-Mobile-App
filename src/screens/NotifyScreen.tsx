import { Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function NotifyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.bodytext}>Under Maintenance</Text>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  bodytext: {
    color: "#FF0000",
    fontSize: 25,
    fontWeight: "bold",
  }
})