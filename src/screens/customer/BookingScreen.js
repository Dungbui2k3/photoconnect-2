import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { getBooking } from '../../services/bookingService';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../theme/theme';
import Button from '../../components/shared/Button';
import Card from '../../components/shared/Card';

const BookingScreen = ({ route }) => {
  const { bookingId } = route.params;
  const navigation = useNavigation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = getBooking(bookingId, (data) => {
      setBooking(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [bookingId]);

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed':
        return { color: theme.colors.primary, ...styles.statusText };
      case 'pending':
        return { color: 'orange', ...styles.statusText };
      case 'cancelled':
      case 'declined':
        return { color: theme.colors.error, ...styles.statusText };
      default:
        return styles.statusText;
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} style={styles.centered} />;
  }

  if (!booking) {
    return (
      <View style={styles.centered}>
        <Text>Booking not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card>
        <View style={styles.header}>
          <Text style={styles.headerText}>Booking with {booking.photographerName}</Text>
          <Text style={getStatusStyle(booking.status)}>{booking.status.toUpperCase()}</Text>
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Service</Text>
          {booking.service ? (
            <Text style={styles.value}>{booking.service.name} - ${booking.service.price}</Text>
          ) : (
            <Text style={styles.value}>No service selected</Text>
          )}
        </View>

        <View style={styles.detailRow}>
          <Text style={styles.label}>Date & Time</Text>
          <Text style={styles.value}>{new Date(booking.date).toLocaleString()}</Text>
        </View>

        {booking.details ? (
          <View style={styles.detailRow}>
            <Text style={styles.label}>Additional Details</Text>
            <Text style={styles.value}>{booking.details}</Text>
          </View>
        ) : null}
      </Card>

      {booking.status === 'confirmed' && (
        <View style={styles.deliverablesSection}>
          <Button
            title="View Deliverables"
            onPress={() => navigation.navigate('Deliverables', { bookingId: booking.id })}
            disabled={!booking.deliverables || booking.deliverables.length === 0}
          />
          {(!booking.deliverables || booking.deliverables.length === 0) && (
            <Text style={styles.noDeliverablesText}>No deliverables are available yet.</Text>
          )}
        </View>
      )}
    </ScrollView>
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
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerText: {
    ...theme.typography.h2,
    flexShrink: 1,
  },
  statusText: {
    ...theme.typography.body2,
    fontWeight: 'bold',
    marginLeft: theme.spacing.sm,
  },
  detailRow: {
    marginBottom: theme.spacing.md,
  },
  label: {
    ...theme.typography.h3,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  value: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  },
  deliverablesSection: {
    marginTop: theme.spacing.lg,
  },
  noDeliverablesText: {
    textAlign: 'center',
    marginTop: theme.spacing.md,
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  }
});

export default BookingScreen;
