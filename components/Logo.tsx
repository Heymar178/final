import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Logo: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image
          source={require('@/assets/images/icon.png')} // Replace with your actual logo path
          style={styles.icon}
        />
      </View>
      <Text style={styles.title}>GroceryGo</Text>
      <Text style={styles.subtitle}>Fresh groceries at your doorstep</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#16a34a', // Changed from blue to green
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    width: 32,
    height: 32,
    tintColor: '#fff', // Optional: Adjust the color of the icon
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default Logo;