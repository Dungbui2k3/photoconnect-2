import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/photographer/HomeScreen';
import BookingsScreen from '../screens/photographer/BookingsScreen';
import ProfileEditScreen from '../screens/photographer/ProfileEditScreen';
import NotificationsScreen from '../screens/photographer/NotificationsScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';
import PortfolioScreen from '../screens/photographer/PortfolioScreen';
import ServicesScreen from '../screens/photographer/ServicesScreen';
import DeliverablesUploadScreen from '../screens/photographer/DeliverablesUploadScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BookingsStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="Bookings" component={BookingsScreen} />
    <Stack.Screen name="DeliverablesUpload" component={DeliverablesUploadScreen} />
  </Stack.Navigator>
);

const PhotographerNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Bookings') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Portfolio') {
            iconName = focused ? 'images' : 'images-outline';
          } else if (route.name === 'Services') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Bookings" component={BookingsStack} />
      <Tab.Screen name="Portfolio" component={PortfolioScreen} />
      <Tab.Screen name="Services" component={ServicesScreen} />
      <Tab.Screen name="Profile" component={ProfileEditScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default PhotographerNavigator;
