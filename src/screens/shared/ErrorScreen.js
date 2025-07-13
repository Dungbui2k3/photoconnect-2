import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const ErrorScreen = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>An error occurred.</Text>
      {onRetry && <Button title="Try Again" onPress={onRetry} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  errorText: {
    color: 'red',
    fontSize: 18,
    marginBottom: 16,
  },
});

export default ErrorScreen;
