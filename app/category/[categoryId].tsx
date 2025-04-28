import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Search, Heart, X } from "lucide-react-native";
import {
  View,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/NavigationBar";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";

// Define the Product type
interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string[];
}

const Category: React.FC = () => {
  const router = useRouter();
  const { categoryId = "all" } = useLocalSearchParams(); // Get categoryId from route params

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch categories and products
  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        if (!categoryId || typeof categoryId !== "string") {
          console.error("Invalid categoryId:", categoryId);
          toast.error("Invalid category selected.");
          return;
        }

        const { data: categoryData, error: categoryError } = await supabase
          .from("products")
          .select("category")
          .not("category", "is", null);

        if (categoryError) {
          console.error("Error fetching categories:", categoryError);
          toast.error("Failed to load categories.");
          return;
        }

        const uniqueCategories = Array.from(
          new Set(categoryData.flatMap((item) => item.category))
        );
        setCategories(["all", ...uniqueCategories]);

        let query = supabase.from("products").select("*");
        if (categoryId !== "all") {
          query = query.contains("category", JSON.stringify([categoryId]));
        }

        const { data: productData, error: productError } = await query;

        if (productError) {
          console.error("Error fetching products:", productError);
          toast.error("Failed to load products.");
          return;
        }

        setProducts(productData || []);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    };

    fetchCategoriesAndProducts();
  }, [categoryId]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart`);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchQuery("");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.productCard}
      onPress={() => router.push(`/ProductDetails?productId=${item.id}`)} // Navigate to Product Details
    >
      <View style={styles.productImageContainer}>
        <Image source={{ uri: item.image_url }} style={styles.productImage} />
        <Button
          variant="ghost"
          size="icon"
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Heart size={20} color={favorites[item.id] ? "red" : "gray"} />
        </Button>
      </View>
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
        <Button
          size="sm"
          variant="outline"
          style={styles.addToCartButton}
          onPress={() => handleAddToCart(item)}
        >
          <Text style={styles.addToCartButtonText}>+</Text>
        </Button>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isSearchVisible ? (
          <View style={styles.searchContainer}>
            <TextInput
              placeholder="Search in this category..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={styles.searchInput}
              placeholderTextColor="rgba(0, 0, 0, 0.5)" // Set placeholder text to semi-transparent black
              autoFocus
            />
            <Button
              variant="ghost"
              size="icon"
              onPress={toggleSearch}
              style={styles.closeButton}
            >
              <X size={20} color="#000" /> {/* Black X icon */}
            </Button>
          </View>
        ) : (
          <View style={styles.headerContent}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <ArrowLeft size={24} color="#000" /> {/* Black icon */}
            </TouchableOpacity>
            <Text style={styles.headerTitle}>
              {categoryId === "all" ? "All Items" : categoryId}
            </Text>
            <Button variant="ghost" size="icon" onPress={toggleSearch}>
              <Search size={24} color="#000" /> {/* Black Search icon */}
            </Button>
          </View>
        )}
      </View>

      <View style={styles.categoryTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false} // Hide the scroll indicator
          contentContainerStyle={styles.categoryTabs}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => router.push(`/category/${cat}`)}
              style={[
                styles.categoryTab,
                categoryId === cat && styles.activeCategoryTab,
              ]}
            >
              <Text
                style={[
                  styles.categoryTabText,
                  categoryId === cat && styles.activeCategoryTabText, // Apply green color to the selected category
                ]}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={styles.productsGrid}
        numColumns={2}
      />

      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    padding: 8,
    backgroundColor: "#f9f9f9",
  },
  closeButton: {
    marginLeft: 8,
  },
  categoryTabsContainer: {
    marginTop: 8, // Add space above the category list
    marginBottom: 8, // Add space below the category list
  },
  categoryTabs: {
    flexDirection: "row",
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 9999,
    backgroundColor: "#f3f4f6",
    marginRight: 8,
  },
  activeCategoryTab: {
    backgroundColor: "#16a34a",
  },
  categoryTabText: {
    fontSize: 14,
    color: "#4b5563",
  },
  activeCategoryTabText: {
    color: "#ffffff",
  },
  productsGrid: {
    padding: 16,
  },
  productCard: {
    width: "48%",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  productImageContainer: {
    position: "relative",
  },
  productImage: {
    width: "100%",
    height: 160,
    resizeMode: "cover",
  },
  favoriteButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 50,
    padding: 4,
  },
  productDetails: {
    padding: 8,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    color: "#16a34a",
    fontWeight: "bold",
  },
  addToCartButton: {
    marginTop: 8,
    borderRadius: 9999,
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0fdf4",
    borderColor: "#d1fae5",
    borderWidth: 1,
  },
  addToCartButtonText: {
    fontSize: 16,
    color: "#16a34a",
    fontWeight: "bold",
  },
});

export default Category;