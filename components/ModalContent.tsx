import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const ModalContent = ({ selectedItem, styles, setModalVisible }: any) => (
  <View style={styles.modalContainer}>
    <View style={styles.modalContent}>
      {selectedItem && (
        <>
          <Text style={styles.modalTitle}>{selectedItem.code}</Text>
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Description:</Text>
            <Text style={styles.modalText}>{selectedItem.description}</Text>
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Quantity:</Text>
            <Text style={styles.modalText}>{selectedItem.quantity.toFixed(1)}</Text>
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Value:</Text>
            <Text style={styles.modalText}>${selectedItem.value.toLocaleString()}</Text>
          </View>
          <View style={styles.modalRow}>
            <Text style={styles.modalLabel}>Percentage:</Text>
            <Text style={styles.modalText}>{selectedItem.percentage.toFixed(2)}%</Text>
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  </View>
);
