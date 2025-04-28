import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ icon, label, onPress, danger = false }) => {
  return (
    <TouchableOpacity
      style={[styles.menuItem, danger && styles.dangerMenuItem]}
      onPress={onPress}
      accessibilityLabel={label}
    >
      <View style={styles.menuIcon}>{icon}</View>
      <Text style={[styles.menuLabel, danger && styles.dangerMenuLabel]}>{label}</Text>
      <ChevronRight size={18} color="#9ca3af" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  dangerMenuItem: {
    backgroundColor: '#fef2f2',
  },
  dangerMenuLabel: {
    color: '#dc2626',
  },
});

export default MenuItem;