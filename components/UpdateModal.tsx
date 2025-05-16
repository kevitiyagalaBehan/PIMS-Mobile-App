import { Modal, View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';

export default function UpdateModal({ visible, updateUrl }: { visible: boolean; updateUrl: string }) {
  const goToStore = () => Linking.openURL(updateUrl);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <Text style={styles.title}>New Update Available!</Text>
          <Text style={styles.message}>
            A new version of this app is required. Please update to continue using the app.
          </Text>
          <TouchableOpacity style={styles.button} onPress={goToStore}>
            <Text style={styles.buttonText}>Update Now!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: '#0009',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  message: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
