import { StyleSheet, Text, SafeAreaView, useWindowDimensions } from 'react-native'
import React from 'react'
import { HeaderWithMenu } from '../../components'

export default function DocumentScreen() {
const { width, height } = useWindowDimensions();
  const styles = getStyles(width);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderWithMenu />
      <Text>Under Maintenance</Text>
    </SafeAreaView>
  )
}

const getStyles = (width: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });