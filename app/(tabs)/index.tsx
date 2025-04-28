import React, { useState, useEffect } from "react";
import { ArrowRight, MapPin } from "lucide-react-native";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  FlatList,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import NavigationBar from "@/components/NavigationBar";
import ProductCard, { Product } from "@/components/ProductCard";
import CategoryCard from "@/components/CategoryCard";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const [deliveryAddress, setDeliveryAddress] = useState<string>(
    "Set your delivery location"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [seasonPicks, setSeasonPicks] = useState<Product[]>([]);
  const [specialOffers, setSpecialOffers] = useState<Product[]>([]);
  const [bestsellers, setBestsellers] = useState<Product[]>([]);

  useEffect(() => {
    const loadSelectedLocation = async () => {
      try {
        const selectedLocation = await AsyncStorage.getItem("selectedLocation");
        if (selectedLocation) {
          const locationObj = JSON.parse(selectedLocation);
          setDeliveryAddress(locationObj.name || "Set your delivery location"); // Display the name of the store
        }
      } catch (error) {
        console.error("Error loading selected location:", error);
      }
    };

    loadSelectedLocation();
  }, []);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
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
        setCategories(uniqueCategories);

        const { data: productData, error: productError } = await supabase
          .from("products")
          .select("*");

        if (productError) {
          console.error("Error fetching products:", productError);
          toast.error("Failed to load products.");
          return;
        }

        setProducts(productData || []);

        const bestsellerProducts = productData.filter((product) =>
          product.category?.includes("Bestsellers")
        );
        const seasonPickProducts = productData.filter((product) =>
          product.category?.includes("Season Picks")
        );
        const specialOfferProducts = productData.filter((product) =>
          product.category?.includes("Special Offers")
        );
        setSeasonPicks(seasonPickProducts);
        setSpecialOffers(specialOfferProducts);
        setBestsellers(bestsellerProducts);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    };

    fetchCategoriesAndProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    toast.success(`${product.name} added to cart`);
  };

  const handleProductClick = (id: string) => {
    router.push(`/ProductDetails?productId=${id}`);
  };

  const handleViewAll = (category: string) => {
    router.push(`/category/${encodeURIComponent(category)}`);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      key={item.id}
      style={styles.productCardWrapper}
      accessibilityLabel={`View details for ${item.name}`}
      onPress={() => handleProductClick(item.id)}
    >
      <ProductCard
        product={{
          ...item,
          image_url: item.image_url || "https://via.placeholder.com/150",
        }}
        onAddToCart={() => handleAddToCart(item)}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>GroceryGo</Text>
          <TouchableOpacity
            style={styles.deliveryAddress}
            onPress={() => router.push("/SelectLocation")}
            accessibilityLabel="Change delivery address"
          >
            <MapPin size={16} color="#16a34a" style={styles.locationIcon} />
            <Text style={styles.deliveryText}>
              Deliver to: <Text style={styles.linkText}>{deliveryAddress}</Text>
            </Text>
            <ArrowRight size={16} />
          </TouchableOpacity>
        </View>
        <TextInput
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          style={styles.searchBar}
          placeholderTextColor="#000" // Set placeholder text color to black
          accessibilityLabel="Search products"
        />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.main}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Shop by Category</Text>
            <View style={styles.categoryGrid}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {categories.map((category, index) => (
                  <View key={index} style={{ marginRight: 16 }}>
                    <CategoryCard
                      name={category}
                      iconColor="#16a34a" // Set the category icon color to green
                      to={`/category/${category}`}
                    />
                  </View>
                ))}
              </ScrollView>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Season Picks</Text>
              <TouchableOpacity onPress={() => handleViewAll("Season Picks")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={seasonPicks}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              horizontal
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Special Offers</Text>
              <TouchableOpacity onPress={() => handleViewAll("Special Offers")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={specialOffers}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              horizontal
              contentContainerStyle={styles.horizontalList}
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bestsellers</Text>
              <TouchableOpacity onPress={() => handleViewAll("Bestsellers")}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={bestsellers}
              renderItem={renderProduct}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.horizontalList}
            />
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
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    zIndex: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#16a34a",
  },
  deliveryAddress: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationIcon: {
    marginRight: 4,
  },
  deliveryText: {
    fontSize: 14,
    color: "#687076",
    marginRight: 4,
  },
  linkText: {
    color: "#16a34a",
    fontWeight: "bold",
  },
  searchBar: {
    marginTop: 12,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e5e5e5",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  main: {
    padding: 16,
  },
  section: {
    marginTop: 0, // Added space above the section
    marginBottom: 10, // Space below the section
  },
  sectionHeader: {
    flexDirection: "row", // Ensures elements are in a row
    justifyContent: "space-between", // Places "View All" and title on opposite ends
    alignItems: "center", // Vertically aligns the elements
    marginBottom: 0, // Adjust spacing below the header
    marginTop: 5, // Adjust spacing above the header
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 20, // Increased space below the "Shop by Category" text
  },
  viewAllText: {
    fontSize: 14,
    color: "#16a34a",
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  productList: {
    gap: 12, // Reduced gap between product cards
    paddingHorizontal: 12,
    marginTop: 0, // Added or reduced space above the product list
    marginBottom: 0, // Reduced space below the product list
  },
  productCardWrapper: {
    width: Math.floor((Dimensions.get("window").width - 12 * 4) / 3),
    marginBottom: 0, // Reduced space below the product card
    marginTop: 0, // Added or reduced space above the product card
    marginRight: 12,
  },
  horizontalList: {
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
