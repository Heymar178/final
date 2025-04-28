import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft, Heart, Minus, Plus } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/NavigationBar";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient"; // Import Supabase client
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProductDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params as { productId: string };

  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) {
        console.error("Error fetching product:", error);
        toast.error("Failed to load product details.");
      } else {
        setProduct(data);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [productId]);

  const handleQuantityChange = (action: "increase" | "decrease") => {
    if (action === "increase") {
      setQuantity((prev) => prev + 1);
    } else if (action === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = async () => {
    if (product) {
      try {
        // Retrieve the current cart from AsyncStorage
        const cart = JSON.parse((await AsyncStorage.getItem("cart")) || "[]");

        // Check if the product already exists in the cart
        const existingProductIndex = cart.findIndex(
          (item: any) => item.id === product.id
        );

        if (existingProductIndex !== -1) {
          // If the product exists, update its quantity
          cart[existingProductIndex].quantity += quantity;
        } else {
          // Otherwise, add the product to the cart
          cart.push({ ...product, quantity });
        }

        // Save the updated cart back to AsyncStorage
        await AsyncStorage.setItem("cart", JSON.stringify(cart));

        toast.success(`${quantity} ${product.name} added to cart!`);
      } catch (error) {
        console.error("Error adding to cart:", error);
        toast.error("Failed to add product to cart.");
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#047857" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found.</Text>
        <Button onPress={() => navigation.goBack()}>Go Back</Button>
      </View>
    );
  }

  const totalPrice = (product.price * quantity).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="icon"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <ArrowLeft size={24} color="#000" /> {/* Black icon */}
        </Button>
        <Text style={styles.headerTitle}>Product Details</Text>
        <Button
          variant="ghost"
          size="icon"
          onPress={() => setIsFavorite(!isFavorite)}
        >
          <Heart size={24} color={isFavorite ? "#ff0000" : "#000"} />
        </Button>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.content}>
          <View style={styles.imageContainer}>
            <Image source={{ uri: product.image_url }} style={styles.image} />
          </View>

          <View style={styles.productInfo}>
            <View>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productCategory}>
                Category:{" "}
                {Array.isArray(product.category)
                  ? product.category.join(", ")
                  : product.category}
              </Text>
            </View>
            {product.available && (
              <Text style={styles.inStockBadge}>In Stock</Text>
            )}
          </View>

          <Text style={styles.productPrice}>${product.price}</Text>

          <View style={styles.description}>
            <Text style={styles.descriptionTitle}>Description</Text>
            <Text style={styles.descriptionText}>{product.description}</Text>
          </View>

          <View style={styles.actions}>
            <View style={styles.quantitySelector}>
              <Button
                variant="ghost"
                size="icon"
                onPress={() => quantity > 1 && handleQuantityChange("decrease")}
                style={[
                  styles.quantityButton,
                  quantity <= 1 && { opacity: 0.5 },
                ]}
              >
                <Minus size={18} color="#000" /> {/* Black Minus icon */}
              </Button>
              <Text style={styles.quantityText}>{quantity}</Text>
              <Button
                variant="ghost"
                size="icon"
                style={styles.quantityButton}
                onPress={() => handleQuantityChange("increase")}
              >
                <Plus size={18} color="#000" /> {/* Black Plus icon */}
              </Button>
            </View>
            <Button style={styles.addToCartButton} onPress={handleAddToCart}>
              <Text style={styles.addToCartButtonText}>
                Add to Cart • ${totalPrice}
              </Text>
            </Button>
          </View>
        </View>
      </ScrollView>

      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80, // Prevent overlap with the navigation bar
  },
  content: {
    padding: 16,
  },
  imageContainer: {
    marginBottom: 16,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "contain",
  },
  productInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  productCategory: {
    fontSize: 14,
    color: "#6b7280",
  },
  inStockBadge: {
    backgroundColor: "#D1FAE5",
    color: "#047857",
    fontSize: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  productPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#16a34a", // Green color
    marginBottom: 16,
  },
  description: {
    marginBottom: 16,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    color: "#374151",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
    paddingTop: 16,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  quantityButton: {
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    width: 32,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  addToCartButton: {
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  addToCartButtonText: {
    color: "#fff", // White text
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    fontSize: 16,
    color: "#ff0000",
    marginBottom: 16,
  },
});

export default ProductDetails;
