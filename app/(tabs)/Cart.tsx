import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/NavigationBar";
import CartItem, { CartItemType } from "@/components/CartItem";
import { toast } from "sonner";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "@/supabaseClient";
import uuid from "react-native-uuid"; // Import react-native-uuid
import { v4 as uuidv4 } from "uuid"; // Import the uuid library


const Cart: React.FC = () => {
  const navigation = useNavigation();
  const [cart, setCart] = useState<CartItemType[]>([]);
  const [subtotal, setSubtotal] = useState(0);
  const [pickupTime, setPickupTime] = useState<string>("2025-04-18T14:00:00");
  const tax = subtotal * 0.08;
  const serviceFee = 2.0;
  const total = subtotal + tax + serviceFee;

  useEffect(() => {
    const loadCart = async () => {
      try {
        const savedCart = await AsyncStorage.getItem("cart");
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }
      } catch (error) {
        console.error("Error loading cart:", error);
      }
    };

    loadCart();
  }, []);

  useEffect(() => {
    const newSubtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    setSubtotal(newSubtotal);
  }, [cart]);

  useEffect(() => {
    const loadPickupTime = async () => {
      const savedPickupTime = await AsyncStorage.getItem("selectedPickupTime");
      if (savedPickupTime) {
        setPickupTime(savedPickupTime);
      }
    };

    loadPickupTime();
  }, []);

  const formattedPickupTime = pickupTime
    ? (() => {
        const startTime = new Date(pickupTime);
        const endTime = new Date(startTime.getTime() + 30 * 60 * 1000); // Add 30 minutes
        return `${startTime
          .toLocaleString(undefined, {
            weekday: "long",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          })
          .replace(" at ", ", ")} - ${endTime.toLocaleTimeString(undefined, {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        })}`;
      })()
    : "No pickup time selected";

  const handleIncrement = async (id: string) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDecrement = async (id: string) => {
    const updatedCart = cart.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleDelete = async (id: string) => {
    const updatedCart = cart.filter((item) => item.id !== id); // Remove the item
    setCart(updatedCart);
    await AsyncStorage.setItem("cart", JSON.stringify(updatedCart)); // Update AsyncStorage
    toast.success("Item removed from cart");
  };

  const handleClearCart = async () => {
    setCart([]);
    await AsyncStorage.removeItem("cart");
    toast.success("Cart cleared");
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
  
    try {
      // Fetch the logged-in user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      const user = userData?.user;
  
      if (userError || !user) {
        console.error("Error fetching user:", userError);
        toast.error("You must be logged in to place an order.");
        return;
      }
  
      // Retrieve the selected location from AsyncStorage
      const selectedLocation = await AsyncStorage.getItem("selectedLocation");
      if (!selectedLocation) {
        toast.error("Please select a location before placing an order.");
        return;
      }
  
      const locationId = JSON.parse(selectedLocation).id;
  
      // Calculate order totals
      const subtotal = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      const tax = subtotal * 0.08;
      const serviceFee = 2.0;
      const total = subtotal + tax + serviceFee;
  
      // Generate a unique barcode using react-native-uuid
      const barcode = uuid.v4();
  
      // Insert the order into the 'orders' table
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            user_id: user.id,
            total_price: total,
            tax,
            service_fee: serviceFee,
            pickup_time: pickupTime,
            created_at: new Date().toISOString(),
            status: "Pending", // Use an allowed value with the correct case
            location_id: locationId, // Include the selected location
            barcode, // Store the generated barcode
          },
        ])
        .select("id");
  
      if (orderError || !orderData?.length) {
        console.error("Order error:", orderError);
        toast.error("Failed to create order.");
        return;
      }
  
      const orderId = orderData[0].id;
  
      // Insert the order items into the 'order_items' table
      const orderItems = cart.map((item) => ({
        order_id: orderId,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      }));
  
      const { error: orderItemsError } = await supabase
        .from("order_items")
        .insert(orderItems);
      if (orderItemsError) {
        console.error("Order item error:", orderItemsError);
        toast.error("Failed to insert order items.");
        return;
      }
  
      // Clear the cart after successful order placement
      await AsyncStorage.removeItem("cart");
      setCart([]);
      toast.success("Order placed successfully!");
  
      // Navigate to the Order Details page
      navigation.navigate("OrderDetails", { orderId }); // Pass the orderId
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Unexpected error. Try again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" /> {/* Black icon */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({cart.length})</Text>
        {cart.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onPress={handleClearCart}
            style={styles.clearButton}
          >
            Clear
          </Button>
        )}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {cart.length > 0 ? (
          <>
            <View style={styles.pickupInfo}>
              <TouchableOpacity
                onPress={() => navigation.navigate("PickUpTime")}
              >
                <Text style={styles.pickupText}>
                  Pickup: {formattedPickupTime}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.cartItems}>
              {cart.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onIncrement={handleIncrement}
                  onDecrement={handleDecrement}
                  onDelete={handleDelete} // Pass the delete function
                />
              ))}
            </View>

            <View style={styles.orderSummary}>
              <Text style={styles.orderSummaryTitle}>Order Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tax</Text>
                <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Service Fee</Text>
                <Text style={styles.summaryValue}>
                  ${serviceFee.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabelBold}>Total</Text>
                <Text style={styles.summaryValueBold}>${total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.footer}>
              <Button style={styles.checkoutButton} onPress={handleCheckout}>
                <Text style={styles.checkoutText}>Proceed to Checkout</Text>
              </Button>
            </View>
          </>
        ) : (
          <View style={styles.emptyCart}>
            <View style={styles.emptyCartIcon}>
              <ArrowLeft size={32} color="#9ca3af" />
            </View>
            <Text style={styles.emptyCartTitle}>Your cart is empty</Text>
            <Text style={styles.emptyCartSubtitle}>
              Looks like you haven't added any products to your cart yet.
            </Text>
            <Button onPress={() => navigation.navigate("(tabs)/index")}>
              Start Shopping
            </Button>
          </View>
        )}
      </ScrollView>

      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clearButton: {
    color: "red",
  },
  pickupInfo: {
    padding: 16,
    backgroundColor: "#f9f9f9",
  },
  pickupText: {
    fontSize: 16,
    color: "#16a34a", // Changed from blue (#007bff) to green
  },
  cartItems: {
    padding: 16,
  },
  orderSummary: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 14,
    color: "#374151",
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  summaryValueBold: {
    fontSize: 16,
    fontWeight: "bold",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  checkoutButton: {
    backgroundColor: "#16a34a", // Changed from blue (#007bff) to green
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  emptyCartIcon: {
    marginBottom: 16,
  },
  emptyCartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  checkoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyCartSubtitle: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 16,
    textAlign: "center",
  },
});

export default Cart;