import { useState, useEffect } from 'react';
import { getBookingsForUser, getBookingsForPhotographer } from '../services/bookingService';
import { useAuth } from './useAuth';
import { useUserRole } from './useUserRole';

export const useBookings = () => {
  const { user } = useAuth();
  const { role } = useUserRole();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && role) {
      setLoading(true);
      const fetchBookings = async () => {
        try {
          let bookingsData;
          if (role === 'customer') {
            bookingsData = await getBookingsForUser(user.uid);
          } else if (role === 'photographer') {
            bookingsData = await getBookingsForPhotographer(user.uid);
          }
          setBookings(bookingsData.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        } catch (err) {
          setError(err);
        } finally {
          setLoading(false);
        }
      };
      fetchBookings();
    }
  }, [user, role]);

  return { bookings, loading, error };
};
