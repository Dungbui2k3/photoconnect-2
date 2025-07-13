import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { getBookingsForPhotographer, updateBookingStatus } from '../../services/bookingService';
import { useAuth } from '../../hooks/useAuth';
import { theme } from '../../theme/theme';
import Card from '../../components/shared/Card';
import Button from '../../components/shared/Button';

const HomeScreen = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const unsubscribe = getBookingsForPhotographer(user.uid, (data) => {
        setBookings(data.sort((a, b) => new Date(b.date) - new Date(a.date)));
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleUpdateStatus = (bookingId, status) => {
    const action = status === 'confirmed' ? 'confirm' : 'decline';
    Alert.alert(
      `Confirm ${action}`,
      `Are you sure you want to ${action} this booking?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => updateBookingStatus(bookingId, status).catch(err => Alert.alert('Error', 'Failed to update booking status.')),
        },
      ]
    );
  };

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

  const renderBooking = ({ item }) => (
    <Card style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{item.customerName || 'Customer'}</Text>
        <Text style={getStatusStyle(item.status)}>{item.status.toUpperCase()}</Text>
      </View>
      <Text style={styles.serviceName}>{item.service?.name || 'Custom Request'}</Text>
      
      <Text style={styles.customerName}>{item.customerPhone || 'Customer'}</Text>
      <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
      {item.details ? <Text style={styles.details}>{item.details}</Text> : null}
      
      {item.status === 'pending' && (
        <View style={styles.actions}>
          <Button title="Decline" onPress={() => handleUpdateStatus(item.id, 'declined')} style={styles.declineButton} textStyle={styles.declineButtonText} />
          <Button title="Accept" onPress={() => handleUpdateStatus(item.id, 'confirmed')} style={styles.acceptButton} />
        </View>
      )}
    </Card>
  );

  if (loading) {
    return <ActivityIndicator size="large" color={theme.colors.primary} style={styles.centered} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Requests</Text>
      {bookings.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>You have no booking requests.</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
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
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  customerName: {
    ...theme.typography.h3,
  },
  serviceName: {
    ...theme.typography.body1,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  statusText: {
    ...theme.typography.body2,
    fontWeight: 'bold',
  },
  date: {
    ...theme.typography.body2,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  details: {
    ...theme.typography.body2,
    color: theme.colors.text,
    fontStyle: 'italic',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  acceptButton: {
    flex: 1,
  },
  declineButton: {
    backgroundColor: theme.colors.lightGrey,
    flex: 1,
  },
  declineButtonText: {
    color: theme.colors.text,
  },
  emptyText: {
    ...theme.typography.body1,
    color: theme.colors.textSecondary,
  }
});

export default HomeScreen;