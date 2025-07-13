import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { searchPhotographers } from '../../services/userService';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import Card from '../../components/shared/Card';
import Avatar from '../../components/shared/Avatar';
import Input from '../../components/shared/Input';

const HomeScreen = () => {
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = searchPhotographers(searchQuery, (data) => {
      setPhotographers(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [searchQuery]);

  const renderPhotographer = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('PhotographerProfile', { photographerId: item.id })}>
      <Card style={styles.card}>
        <Avatar uri={item.avatarUrl} size={70} />
        <View style={styles.photographerInfo}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.location}>{item.location || 'Location not set'}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find a Photographer</Text>
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={photographers}
          renderItem={renderPhotographer}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No photographers found.</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.md,
  },
  list: {
    paddingHorizontal: theme.spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  photographerInfo: {
    marginLeft: theme.spacing.md,
  },
  name: {
    ...theme.typography.h3,
    color: theme.colors.text,
  },
  location: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  loader: {
    marginTop: theme.spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  }
});

export default HomeScreen;