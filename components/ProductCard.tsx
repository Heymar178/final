import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Product {
  image_url: string;
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  unit: string;
  discount?: number;
}

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

const screenWidth = Dimensions.get('window').width;
const cardMargin = 8;
const numColumns = 3;
const cardWidth =
  (screenWidth - cardMargin * (numColumns * 2 + 1)) / numColumns;

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const [isHovered, setIsHovered] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(product.price);

  const formattedOriginalPrice = product.originalPrice
    ? new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(product.originalPrice)
    : null;

  const handleAddToCart = async () => {
    try {
      const storedCart = await AsyncStorage.getItem('cart');
      const cart: any[] = storedCart ? JSON.parse(storedCart) : [];

      const existingIndex = cart.findIndex((item) => item.id === product.id);

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push({ ...product, quantity: 1 });
      }

      await AsyncStorage.setItem('cart', JSON.stringify(cart));
      console.log('Added to cart:', product.name);
    } catch (error) {
      console.error('Failed to add to cart:', error);
    }

    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.image_url }}
          style={styles.image}
          onError={() =>
            console.error(`Failed to load image: ${product.image_url}`)
          }
        />
        {product.discount && (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>-{product.discount}%</Text>
          </View>
        )}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.unit}>{product.unit}</Text>
        <View style={styles.footerFixed}>
          <View style={styles.priceContainer}>
            <Text style={styles.price}>{formattedPrice}</Text>
            {formattedOriginalPrice && (
              <Text style={styles.originalPrice}>
                {formattedOriginalPrice}
              </Text>
            )}
          </View>
          <Pressable
            onPress={handleAddToCart}
            onPressIn={() => setIsHovered(true)}
            onPressOut={() => setIsHovered(false)}
            style={[
              styles.addButton,
              isHovered && styles.addButtonHovered,
            ]}
          >
            <Text
              style={[
                styles.addButtonText,
                isHovered && styles.addButtonTextHovered,
              ]}
            >
              Add
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    backgroundColor: '#fff',
    overflow: 'hidden',
    flexDirection: 'column',
    marginBottom: 16,
    height: 240,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    resizeMode: 'cover',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#ff4d4f',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  discountText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  name: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 2,
    height: 36,
    overflow: 'hidden',
  },
  unit: {
    fontSize: 12,
    color: '#687076',
    marginBottom: 2,
  },
  footerFixed: {
    marginTop: 'auto',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 6,
    marginTop: -10,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a', // ✅ Green price
  },
  originalPrice: {
    fontSize: 12,
    color: '#9ba1a6',
    textDecorationLine: 'line-through',
    marginLeft: 8,
  },
  addButton: {
    width: '100%',
    borderColor: '#16a34a',
    borderWidth: 1,
    borderRadius: 6,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  addButtonHovered: {
    backgroundColor: '#16a34a',
  },
  addButtonText: {
    color: '#16a34a',
    fontWeight: 'bold',
  },
  addButtonTextHovered: {
    color: 'white',
  },
});

export default ProductCard;
