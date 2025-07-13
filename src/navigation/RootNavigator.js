import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import CustomerNavigator from './CustomerNavigator';
import PhotographerNavigator from './PhotographerNavigator';
import SplashScreen from '../screens/shared/SplashScreen';
import { USER_ROLES } from '../utils/constants';
import RoleSelectScreen from '../screens/auth/RoleSelectScreen';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { user, userProfile, loading } = useAuth();

  if (loading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {!user ? (
        <AuthNavigator />
      ) : !userProfile ? (
        <Stack.Navigator>
          <Stack.Screen
            name="RoleSelect"
            component={RoleSelectScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      ) : userProfile.role === USER_ROLES.CUSTOMER ? (
        <CustomerNavigator />
      ) : userProfile.role === USER_ROLES.PHOTOGRAPHER ? (
        <PhotographerNavigator />
      ) : (
        <AuthNavigator /> // Fallback
      )}
    </NavigationContainer>
  );
};

export default RootNavigator;
