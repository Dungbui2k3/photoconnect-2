import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { signOut } from '../../services/authService';
import { theme } from '../../theme/theme';
import Button from '../../components/shared/Button';

const SettingsScreen = () => {

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Sign Out", 
          onPress: () => signOut().catch(err => Alert.alert("Error", "Could not sign out.")),
          style: "destructive"
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <View style={styles.content}>
        {/* Add other settings options here in the future */}
      </View>
      <Button 
        title="Sign Out" 
        onPress={handleSignOut} 
        style={styles.signOutButton}
        textStyle={styles.signOutButtonText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.lg,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.lg,
  },
  content: {
    flex: 1,
  },
  signOutButton: {
    backgroundColor: theme.colors.lightGrey,
    elevation: 0, // No shadow for this button
  },
  signOutButtonText: {
    color: theme.colors.error,
  }
});

export default SettingsScreen;