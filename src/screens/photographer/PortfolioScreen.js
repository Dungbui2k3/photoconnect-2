import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Alert, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { onUserProfileChange, updateUserProfile } from '../../services/userService';
import { uploadImage, getDownloadURL } from '../../services/storageService';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../theme/theme';
import Button from '../../components/shared/Button';

const PortfolioScreen = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const unsubscribe = onUserProfileChange(user.uid, (doc) => {
        if (doc.exists() && doc.data().portfolio) {
          setPortfolio(doc.data().portfolio);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handleAddImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setLoading(true);
      try {
        const uri = result.assets[0].uri;
        const path = `portfolios/${user.uid}/${Date.now()}`;
        await uploadImage(uri, path);
        const downloadURL = await getDownloadURL(path);
        const updatedPortfolio = [...portfolio, downloadURL];
        await updateUserProfile(user.uid, { portfolio: updatedPortfolio });
      } catch (error) {
        Alert.alert('Error', 'Failed to upload image.');
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleDeleteImage = (imageUrl) => {
    Alert.alert(
      'Delete Image',
      'Are you sure you want to delete this image?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedPortfolio = portfolio.filter((url) => url !== imageUrl);
            try {
              await updateUserProfile(user.uid, { portfolio: updatedPortfolio });
              // Note: This does not delete the image from Firebase Storage.
            } catch (error) {
              Alert.alert('Error', 'Failed to delete image.');
            }
          },
        },
      ]
    );
  };

  const renderPortfolioItem = ({ item }) => (
    <View style={styles.imageContainer}>
      <Image source={{ uri: item }} style={styles.image} />
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(item)}>
        <Text style={styles.deleteButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Portfolio</Text>
      <FlatList
        data={portfolio}
        renderItem={renderPortfolioItem}
        keyExtractor={(item) => item}
        numColumns={3}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Your portfolio is empty.</Text>
          </View>
        }
      />
      <Button title="Add New Image" onPress={handleAddImage} loading={loading} style={styles.addButton} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: '50%',
  },
  title: {
    ...theme.typography.h1,
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  list: {
    paddingHorizontal: theme.spacing.sm,
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
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    lineHeight: 20,
  },
  addButton: {
    margin: theme.spacing.lg,
  },
  emptyText: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
});

export default PortfolioScreen;