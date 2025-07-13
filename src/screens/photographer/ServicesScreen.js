import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { onUserProfileChange, updateUserProfile } from '../../services/userService';
import { theme } from '../../theme/theme';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';
import Modal from '../../components/shared/Modal';
import Input from '../../components/shared/Input';

const ServicesScreen = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentService, setCurrentService] = useState({ name: '', price: '', description: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = onUserProfileChange(user.uid, (doc) => {
        if (doc.exists() && doc.data().services) {
          setServices(doc.data().services);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const openAddModal = () => {
    setIsEditing(false);
    setCurrentService({ name: '', price: '', description: '' });
    setModalVisible(true);
  };

  const openEditModal = (service, index) => {
    setIsEditing(true);
    setCurrentService(service);
    setEditingIndex(index);
    setModalVisible(true);
  };

  const handleSaveService = async () => {
    if (!currentService.name || !currentService.price) {
      Alert.alert('Missing Fields', 'Please enter a name and price for the service.');
      return;
    }
    let updatedServices = [...services];
    if (isEditing) {
      updatedServices[editingIndex] = currentService;
    } else {
      updatedServices.push(currentService);
    }

    try {
      await updateUserProfile(user.uid, { services: updatedServices });
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to save service.');
    }
  };

  const handleDeleteService = (index) => {
    Alert.alert(
      'Delete Service',
      'Are you sure you want to delete this service?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedServices = services.filter((_, i) => i !== index);
            try {
              await updateUserProfile(user.uid, { services: updatedServices });
            } catch (error) {
              Alert.alert('Error', 'Failed to delete service.');
            }
          },
        },
      ]
    );
  };

  const renderService = ({ item, index }) => (
    <Card style={styles.card}>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.servicePrice}>${item.price}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <View style={styles.actions}>
        <Button title="Delete" onPress={() => handleDeleteService(index)} style={styles.deleteButton} textStyle={styles.deleteButtonText} />
        <Button title="Edit" onPress={() => openEditModal(item, index)} style={styles.editButton} />
      </View>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Services</Text>
      <FlatList
        data={services}
        renderItem={renderService}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.emptyText}>You have not added any services yet.</Text>}
      />
      <Button title="Add New Service" onPress={openAddModal} style={styles.addButton} />

      <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>{isEditing ? 'Edit Service' : 'Add New Service'}</Text>
          <Input
            label="Service Name"
            value={currentService.name}
            onChangeText={(text) => setCurrentService({ ...currentService, name: text })}
          />
          <Input
            label="Price ($)"
            value={String(currentService.price)}
            onChangeText={(text) => setCurrentService({ ...currentService, price: text })}
            keyboardType="numeric"
          />
          <Input
            label="Description"
            value={currentService.description}
            onChangeText={(text) => setCurrentService({ ...currentService, description: text })}
            multiline
            style={styles.descriptionInput}
          />
          <Button title="Save Service" onPress={handleSaveService} style={styles.saveButton} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  serviceName: {
    ...theme.typography.h3,
  },
  servicePrice: {
    ...theme.typography.body1,
    color: theme.colors.primary,
    marginVertical: theme.spacing.sm,
  },
  serviceDescription: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing.md,
  },
  editButton: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  deleteButton: {
    backgroundColor: theme.colors.lightGrey,
    flex: 1,
  },
  deleteButtonText: {
    color: theme.colors.text,
  },
  addButton: {
    margin: theme.spacing.lg,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  modalContent: {
    padding: theme.spacing.lg,
  },
  modalTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  descriptionInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: theme.spacing.md,
  }
});

export default ServicesScreen;