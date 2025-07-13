import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../hooks/useAuth';
import { getUserProfile, updateUserProfile, onUserProfileChange } from '../../services/userService';
import { uploadImage, getDownloadURL } from '../../services/storageService';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../theme/theme';
import Input from '../../components/shared/Input';
import Button from '../../components/shared/Button';
import Avatar from '../../components/shared/Avatar';

const ProfileEditScreen = () => {
  const { user } = useAuth();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    if (user) {
      const unsubscribe = onUserProfileChange(user.uid, (doc) => {
        if (doc.exists()) {
          const data = doc.data();
          setProfile(data);
          setAvatarUri(data.avatarUrl);
        }
      });
      return () => unsubscribe();
    }
  }, [user]);

  const handlePickAvatar = async () => {

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      let newAvatarUrl = profile.avatarUrl;
      if (avatarUri && avatarUri !== profile.avatarUrl) {
        setUploading(true);
        const path = `avatars/${user.uid}`;
        await uploadImage(avatarUri, path);
        newAvatarUrl = await getDownloadURL(path);
        setUploading(false);
      }

      const updatedProfile = {
        ...profile,
        avatarUrl: newAvatarUrl,
        name_lowercase: profile.name.toLowerCase(),
      };

      await updateUserProfile(user.uid, updatedProfile);
      Alert.alert('Profile Updated', 'Your profile has been successfully updated.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (!profile) {
    return <ActivityIndicator size="large" color={theme.colors.primary} style={styles.centered} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Edit Profile</Text>
      <View style={styles.avatarSection}>
        <Avatar uri={avatarUri} size={120} />
        <Button title={avatarUri ? "Change Avatar" : "Add Avatar"} onPress={handlePickAvatar} style={styles.avatarButton} />
        {uploading && <ActivityIndicator size="small" color={theme.colors.primary} style={{ marginTop: theme.spacing.sm }} />}
      </View>

      <Input
        label="Name"
        value={profile.name}
        onChangeText={(text) => setProfile({ ...profile, name: text })}
      />
      <Input
        label="Bio"
        value={profile.bio}
        onChangeText={(text) => setProfile({ ...profile, bio: text })}
        multiline
        style={styles.bioInput}
      />
      <Input
        label="Location"
        value={profile.location}
        onChangeText={(text) => setProfile({ ...profile, location: text })}
      />

      <Button title="Save Changes" onPress={handleSaveChanges} loading={loading} style={styles.saveButton} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.lg,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  avatarButton: {
    marginTop: theme.spacing.md,
  },
  bioInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: theme.spacing.lg,
  },
});

export default ProfileEditScreen;