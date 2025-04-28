import { Link, Stack, useNavigation } from 'expo-router';
import { StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function NotFoundScreen() {
  const navigation = useNavigation();

  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ThemedView style={styles.container}>
          <ThemedText type="title">This screen doesn't exist.</ThemedText>

          {/* Go Back Button */}
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.goBackButton}>
            <Text style={styles.goBackButtonText}>Go Back</Text>
          </TouchableOpacity>

          {/* Link to Home */}
        </ThemedView>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Ensures the content can grow and scroll
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  goBackButton: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#16a34a', // Green background
    borderRadius: 8,
  },
  goBackButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});