import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Home, ShoppingCart, User } from 'lucide-react-native';

const NavigationBar: React.FC = () => {
  const navigation = useNavigation<{
    navigate: (screen: '(tabs)/index' | '(tabs)/Cart' | 'Account') => void;
  }>();
  const route = useRoute();

  const isActive = (routeName: string) => route.name === routeName;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.navItem, isActive('(tabs)/index') && styles.activeNavItem]}
        onPress={() => navigation.navigate('(tabs)/index')}
      >
        <Home size={24} color={isActive('(tabs)/index') ? '#16a34a' : '#687076'} />
        <Text style={[styles.navText, isActive('(tabs)/index') && styles.activeNavText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, isActive('(tabs)/Cart') && styles.activeNavItem]}
        onPress={() => navigation.navigate('(tabs)/Cart')}
      >
        <ShoppingCart size={24} color={isActive('(tabs)/Cart') ? '#16a34a' : '#687076'} />
        <Text style={[styles.navText, isActive('(tabs)/Cart') && styles.activeNavText]}>Cart</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.navItem, isActive('Account') && styles.activeNavItem]}
        onPress={() => navigation.navigate('Account')}
      >
        <User size={24} color={isActive('Account') ? '#16a34a' : '#687076'} />
        <Text style={[styles.navText, isActive('Account') && styles.activeNavText]}>Account</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    zIndex: 10,
  },
  navItem: {
    alignItems: 'center',
  },
  activeNavItem: {},
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#687076',
  },
  activeNavText: {
    color: '#16a34a', // Changed to green
  },
});

export default NavigationBar;