import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router'; // Use Expo Router for navigation

interface CategoryCardProps {
  name: string;
  icon: React.ReactNode;
  categoryId: string; // Pass the category ID dynamically
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon, categoryId }) => {
  const router = useRouter(); // Use router for navigation

  const handlePress = () => {
    router.push(`/category/${categoryId}`); // Navigate to the dynamic category route
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.iconContainer}>{icon}</View>
      <Text style={styles.text}>{name}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80, // Increased width
    height: 80, // Increased height
    borderRadius: 40, // Adjusted for circular shape
    backgroundColor: '#E0F7FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8, // Increased margin for better spacing
  },
  text: {
    fontSize: 14, // Slightly increased font size
    fontWeight: '500',
  },
});

export default CategoryCard;