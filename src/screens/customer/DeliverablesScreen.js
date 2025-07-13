import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ActivityIndicator, TouchableOpacity, Modal, SafeAreaView } from 'react-native';
import { getBooking } from '../../services/bookingService';
import { theme } from '../../theme/theme';
import Button from '../../components/shared/Button';

const DeliverablesScreen = ({ route }) => {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const unsubscribe = getBooking(bookingId, (data) => {
      setBooking(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [bookingId]);

  const openImageModal = (imageUri) => {
    setSelectedImage(imageUri);
    setModalVisible(true);
  };

  const renderDeliverable = ({ item }) => (
    <TouchableOpacity style={styles.imageContainer} onPress={() => openImageModal(item)}>
      <Image source={{ uri: item }} style={styles.image} />
    </TouchableOpacity>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} style={styles.centered} />;
  }

  if (!booking || !booking.deliverables || booking.deliverables.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>No deliverables found for this booking.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deliverables</Text>
      <FlatList
        data={booking.deliverables}
        renderItem={renderDeliverable}
        keyExtractor={(item, index) => index.toString()}
        numColumns={3}
      />
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={styles.modalContainer}>
          <Image source={{ uri: selectedImage }} style={styles.fullscreenImage} resizeMode="contain" />
          <View style={styles.closeButtonContainer}>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.sm,
  },
  title: {
    ...theme.typography.h1,
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  imageContainer: {
    flex: 1 / 3,
    aspectRatio: 1,
    padding: theme.spacing.xs,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  emptyText: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '70%',
  },
  closeButtonContainer: {
    position: 'absolute',
    bottom: 40,
    width: '80%',
  }
});

export default DeliverablesScreen;
