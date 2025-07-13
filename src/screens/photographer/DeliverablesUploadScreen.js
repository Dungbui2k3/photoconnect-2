import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadDeliverable } from '../../services/storageService';
import { theme } from '../../theme/theme';
import Button from '../../components/shared/Button';

const DeliverablesUploadScreen = ({ route }) => {
  const { bookingId } = route.params;
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const selectFiles = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setFiles(result.assets);
    }
  };

  const handleUpload = async () => {
    if (files.length > 0) {
      setUploading(true);
      try {
        const uploadPromises = files.map(file => 
          uploadDeliverable(bookingId, { uri: file.uri, name: file.fileName || `file_${Date.now()}` })
        );
        await Promise.all(uploadPromises);
        Alert.alert('Upload Complete', 'All files have been uploaded successfully.');
        setFiles([]);
      } catch (error) {
        Alert.alert('Upload Failed', 'Could not upload all files. Please try again.');
        console.error('Failed to upload deliverables:', error);
      } finally {
        setUploading(false);
      }
    }
  };

  const renderFile = ({ item }) => (
    <View style={styles.fileItem}>
      <Image source={{ uri: item.uri }} style={styles.previewImage} />
      <Text style={styles.fileName} numberOfLines={1}>{item.fileName || 'Image'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Deliverables</Text>
      <Button title="Select Files from Library" onPress={selectFiles} style={styles.button} />
      
      <FlatList
        data={files}
        renderItem={renderFile}
        keyExtractor={(item) => item.uri}
        numColumns={3}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>No files selected.</Text>
          </View>
        }
      />

      {files.length > 0 && (
        <Button
          title={`Upload ${files.length} File(s)`}
          onPress={handleUpload}
          loading={uploading}
          style={styles.uploadButton}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50%',
  },
  title: {
    ...theme.typography.h1,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginBottom: theme.spacing.md,
  },
  uploadButton: {
    marginTop: theme.spacing.md,
  },
  list: {
    flexGrow: 1,
  },
  fileItem: {
    flex: 1/3,
    aspectRatio: 1,
    padding: theme.spacing.xs,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '80%',
    borderRadius: 12,
  },
  fileName: {
    marginTop: theme.spacing.sm,
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
  },
  emptyText: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
});

export default DeliverablesUploadScreen;
