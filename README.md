📱 Customer Screens (src/screens/customer)

| Screen                         | Purpose                                                                    | Suggested Features                                                                      |
| ------------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| `HomeScreen.js`                | Landing screen with curated photographers, categories, and featured works. | 🔹 Carousel of top-rated photographers<br>🔹 Trending places<br>🔹 Recommended services |
| `SearchScreen.js`              | Let users search photographers by service, location, or tags               | 🔹 Text + filter search (location, event type)<br>🔹 Tags like "Wedding", "Event"       |
| `PhotographerProfileScreen.js` | Show portfolio, bio, ratings, and services of a photographer               | 🔹 Book Now button<br>🔹 Service list with price<br>🔹 Reviews                          |
| `CreateBookingScreen.js`       | Customer selects time, service, and sends booking request                  | 🔹 Date/time picker<br>🔹 Service dropdown<br>🔹 Notes field                            |
| `BookingScreen.js`             | Detail of a specific booking                                               | 🔹 Status (pending/accepted/completed)<br>🔹 Chat link<br>🔹 Cancel option              |
| `BookingsScreen.js`            | List of all customer bookings                                              | 🔹 Tabs for upcoming / past bookings<br>🔹 Filter by status                             |
| `DeliverablesScreen.js`        | View photos/videos from completed bookings                                 | 🔹 Download/share buttons<br>🔹 Album viewer with grid layout                           |
| `NotificationsScreen.js`       | Booking updates, new deliverables, messages                                | 🔹 Real-time updates from Firebase<br>🔹 Tap to view booking/deliverables               |


📸 Photographer Screens (src/screens/photographer)
| Screen                        | Purpose                                             | Suggested Features                                                       |
| ----------------------------- | --------------------------------------------------- | ------------------------------------------------------------------------ |
| `HomeScreen.js`               | Overview: today's jobs, stats, quick links          | 🔹 Today’s shoots summary<br>🔹 Pending bookings<br>🔹 Earnings snapshot |
| `BookingsScreen.js`           | List of upcoming and past bookings                  | 🔹 Accept/reject buttons<br>🔹 Filters by status                         |
| `DeliverablesUploadScreen.js` | Upload photo/video albums for completed bookings    | 🔹 Upload to Firebase Storage<br>🔹 Album name, notes, etc.              |
| `PortfolioScreen.js`          | Manage public showcase work                         | 🔹 Add/remove samples<br>🔹 Group by category ("Wedding", "Events")      |
| `ServicesScreen.js`           | Add/edit services offered                           | 🔹 Price, duration, category<br>🔹 Upload sample image per service       |
| `ProfileEditScreen.js`        | Edit bio, profile pic, location, contact, work area | 🔹 Multi-select locations<br>🔹 Specialty tags                           |
| `NotificationsScreen.js`      | Alerts for bookings, customer messages              | 🔹 Mark as read<br>🔹 Navigate to action screens                         |
