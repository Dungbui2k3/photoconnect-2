import React, { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, Alert, Platform, ActivityIndicator, View } from 'react-native';
import { createBooking } from '../../services/bookingService';
import { getUserProfile } from '../../services/userService';
import { useAuth } from '../../hooks/useAuth';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { theme } from '../../theme/theme';
import Button from '../../components/shared/Button';
import Input from '../../components/shared/Input';

const CreateBookingScreen = ({ route }) => {
  const { photographerId } = route.params;
  const { user, userProfile } = useAuth();
  const navigation = useNavigation();
  const [photographer, setPhotographer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(Platform.OS === 'ios');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (photographerId) {
      getUserProfile(photographerId)
        .then((doc) => {
          if (doc.exists()) {
            setPhotographer(doc.data());
          } else {
            Alert.alert('Error', 'Photographer not found.');
            navigation.goBack();
          }
        })
        .catch((error) => {
          console.error('Failed to fetch photographer:', error);
          Alert.alert('Error', 'Could not load photographer details.');
          navigation.goBack();
        })
        .finally(() => {
          setPageLoading(false);
        });
    }
  }, [photographerId, navigation]);

  const handleBooking = async () => {
    if (!date) {
      Alert.alert('Missing Information', 'Please select a date.');
      return;
    }

    if (!user || !photographer) {
      Alert.alert('Error', 'User or photographer data is not loaded yet.');
      return;
    }

    setLoading(true);
    try {
      await createBooking({
        userId: user.uid,
        customerName: userProfile.name,
        customerPhone: userProfile.phoneNumber,
        photographerId,
        photographerName: photographer.name,
        service: selectedService,
        date: date.toISOString(),
        details,
        status: 'pending',
      });
      Alert.alert('Booking Request Sent!', 'The photographer will review your request.');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to create booking:', error);
      Alert.alert('Error', 'Could not create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    setDate(currentDate);
  };

  if (pageLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book {photographer?.name}</Text>

      {photographer?.services && photographer.services.length > 0 && (
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedService}
            onValueChange={(itemValue) => setSelectedService(itemValue)}
            style={styles.picker}
            prompt="Select a service (optional)"
          >
            <Picker.Item label="No specific service" value={null} />
            {photographer.services.map((service, index) => (
              <Picker.Item key={index} label={`${service.name} - ${service.price}`} value={service} />
            ))}
          </Picker>
        </View>
      )}

      <View>
        {Platform.OS === 'android' && (
          <Button onPress={() => setShowDatePicker(true)} title={`Selected Date: ${date.toLocaleDateString()}`} />
        )}
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            display="default"
            onChange={onDateChange}
            style={styles.datePicker}
          />
        )}
      </View>

      <Input
        label="Booking Details"
        placeholder="Describe what you're looking for..."
        value={details}
        onChangeText={setDetails}
        multiline
        style={styles.input}
      />

      <Button
        title="Request Booking"
        onPress={handleBooking}
        loading={loading}
        disabled={!photographer || !user}
        style={styles.bookButton}
      />
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
    flexGrow: 1,
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
  },
  title: {
    ...theme.typography.h1,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
  },
  pickerContainer: {
    backgroundColor: theme.colors.lightGrey,
    borderRadius: 12,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  picker: {
    height: 50,
  },
  datePicker: {
    marginVertical: theme.spacing.md,
  },
  input: {
    minHeight: 120,
    textAlignVertical: 'top',
    marginTop: theme.spacing.md,
  },
  bookButton: {
    marginTop: theme.spacing.lg,
  },
});

export default CreateBookingScreen;

