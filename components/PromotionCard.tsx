import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface PromotionCardProps {
  title: string;
  image: string;
  to: string;
}

const PromotionCard: React.FC<PromotionCardProps> = ({ title, image, to }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate(to as never); // Cast to `never` to satisfy TypeScript
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <ImageBackground source={{ uri: image }} style={styles.image} imageStyle={styles.imageStyle}>
        <View style={styles.overlay}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 128, // 32 * 4
  },
  imageStyle: {
    borderRadius: 8,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'flex-end',
    padding: 12,
  },
  title: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PromotionCard;