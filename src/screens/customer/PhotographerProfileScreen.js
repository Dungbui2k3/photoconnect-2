import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, FlatList, ActivityIndicator } from 'react-native';
import { onUserProfileChange } from '../../services/userService';
import { theme } from '../../theme/theme';
import Button from '../../components/shared/Button';
import Avatar from '../../components/shared/Avatar';
import Card from '../../components/shared/Card';

const PhotographerProfileScreen = ({ route, navigation }) => {
  const { photographerId } = route.params;
  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onUserProfileChange(photographerId, (doc) => {
      if (doc.exists()) {
        setPhotographer({ id: doc.id, ...doc.data() });
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [photographerId]);

  const renderService = ({ item }) => (
    <Card style={styles.serviceCard}>
      <Text style={styles.serviceName}>{item.name}</Text>
      <Text style={styles.servicePrice}>${item.price}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
    </Card>
  );

  const renderPortfolioChunk = ({ item }) => (
    <View style={styles.portfolioRow}>
      {item.map((imageUri, index) => (
        <Image key={index} source={{ uri: imageUri }} style={styles.portfolioImage} />
      ))}
    </View>
  );

  const chunkArray = (arr, size) => {
    return arr.reduce((acc, e, i) => {
      if (i % size === 0) {
        acc.push([e]);
      } else {
        acc[acc.length - 1].push(e);
      }
      return acc;
    }, []);
  };

  const renderHeader = () => (
    <View>
      <View style={styles.header}>
        <Avatar uri={photographer.avatarUrl} size={120} />
        <Text style={styles.name}>{photographer.name}</Text>
        <Text style={styles.location}>{photographer.location || 'Location not set'}</Text>
        <Text style={styles.phoneNumber}>{photographer.phoneNumber}</Text>
        <Text style={styles.bio}>{photographer.bio}</Text>
      </View>
      {photographer.services?.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          <FlatList
            data={photographer.services}
            renderItem={renderService}
            keyExtractor={(item, index) => `service-${index}`}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: theme.spacing.lg }}
          />
        </View>
      )}
      {photographer.portfolio?.length > 0 && (
        <Text style={styles.sectionTitle}>Portfolio</Text>
      )}
    </View>
  );

  const renderFooter = () => (
     <Button
        title="Book a Session"
        onPress={() => navigation.navigate('CreateBooking', { photographerId: photographer.id })}
        style={styles.bookButton}
      />
  );

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} style={styles.centered} />;
  }

  if (!photographer) {
    return (
      <View style={styles.centered}>
        <Text>Photographer not found.</Text>
      </View>
    );
  }

  const portfolioChunks = photographer.portfolio ? chunkArray(photographer.portfolio, 3) : [];

  return (
    <FlatList
      style={styles.container}
      data={portfolioChunks}
      renderItem={renderPortfolioChunk}
      keyExtractor={(item, index) => `portfolio-row-${index}`}
      ListHeaderComponent={renderHeader}
      ListFooterComponent={renderFooter}
      ListEmptyComponent={
        // Render header and footer even if portfolio is empty
        <View>
          {photographer.portfolio?.length === 0 && <Text style={styles.emptyPortfolioText}>This photographer has no portfolio items yet.</Text>}
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.lightGrey,
  },
  name: {
    ...theme.typography.h1,
    marginTop: theme.spacing.md,
  },
  location: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  phoneNumber: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  bio: {
    ...theme.typography.body1,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    color: theme.colors.text,
  },
  section: {
    paddingVertical: theme.spacing.lg,
  },
  sectionTitle: {
    ...theme.typography.h2,
    marginBottom: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  serviceCard: {
    marginRight: theme.spacing.md,
    width: 250,
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
  portfolioRow: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.lg - (theme.spacing.xs / 2),
  },
  portfolioImage: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: theme.spacing.xs / 2,
    borderRadius: 8,
    marginBottom: theme.spacing.xs,
  },
  bookButton: {
    margin: theme.spacing.lg,
  },
  emptyPortfolioText: {
    textAlign: 'center',
    marginVertical: theme.spacing.lg,
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  }
});

export default PhotographerProfileScreen;
