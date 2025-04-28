import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import NavigationBar from "@/components/NavigationBar";
import { supabase } from "@/supabaseClient";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderDetailsType {
  orderNumber: string;
  status: string;
  deliveryDate: string;
  deliveryTime: string;
  items: OrderItem[];
  subtotal: number;
  serviceFee: number;
  tax: number;
  total: number;
  cardLast4: string;
  barcode: string | null; // Allow barcode to be null
}

const OrderDetails: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { orderId } = route.params as { orderId: string };

  const [orderData, setOrderData] = useState<OrderDetailsType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);

      try {
        // Fetch order details from the `orders` table
        const { data: order, error: orderError } = await supabase
          .from("orders")
          .select(
            `
            order_number,
            status,
            created_at,
            total_price,
            service_fee,
            tax,
            barcode,
            order_items (
              id,
              quantity,
              price,
              products ( name )
            ),
            payments (
              card_last4
            )
          `
          )
          .eq("id", orderId)
          .single();

        if (orderError || !order) {
          console.error("Error fetching order details:", orderError);
          return;
        }

        // Transform the data to match the component's structure
        const transformedOrder: OrderDetailsType = {
          orderNumber: order.order_number,
          status: order.status,
          deliveryDate: new Date(order.created_at).toLocaleDateString(),
          deliveryTime: new Date(order.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          items: order.order_items.map((item: any) => ({
            id: item.id,
            name: item.products.name,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: order.total_price - order.service_fee - order.tax,
          serviceFee: order.service_fee,
          tax: order.tax,
          total: order.total_price,
          cardLast4: order.payments?.card_last4 || "N/A", // Add null check for `payments`
          barcode: order.barcode || null, // Allow barcode to be null
        };

        setOrderData(transformedOrder);
      } catch (error) {
        console.error("Unexpected error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleReorder = async () => {
    if (!orderData) return;

    try {
      // Get the current cart from AsyncStorage
      const cart = (await AsyncStorage.getItem("cart")) || "[]";
      const cartItems = JSON.parse(cart);

      // Add the order items to the cart
      const updatedCart = [
        ...cartItems,
        ...orderData.items.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      ];

      // Save the updated cart back to AsyncStorage
      await AsyncStorage.setItem("cart", JSON.stringify(updatedCart));

      // Show success message
      toast.success("Items added to cart successfully!");
    } catch (error) {
      console.error("Error adding items to cart:", error);
      toast.error("Failed to add items to cart.");
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#" style={styles.loading} />;
  }

  if (!orderData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Failed to load order details. Please try again later.
        </Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>Order Details</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.card}>
          <View style={styles.orderInfo}>
            <View>
              <Text style={styles.orderId}>{orderData.orderNumber}</Text>
              <Text style={styles.orderDate}>
                Delivered on {orderData.deliveryDate} at{" "}
                {orderData.deliveryTime}
              </Text>
            </View>
            <Text style={styles.orderStatus}>{orderData.status}</Text>
          </View>

          {/* Barcode Section */}
          {orderData.barcode ? (
            <View style={styles.barcodeContainer}>
              <View style={styles.barcode}>
                {orderData.barcode.split("").map((char, index) => (
                  <View
                    key={index}
                    style={[
                      styles.bar,
                      index % 2 === 0 ? styles.barWide : null,
                    ]} // Alternate wide bars
                  />
                ))}
              </View>
              <Text style={styles.barcodeText}>{orderData.barcode}</Text>
            </View>
          ) : (
            <Text style={styles.barcodeText}>No barcode available</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {orderData.items.map((item) => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
            </View>
          ))}
          <Separator style={styles.separator} />
          <View style={styles.summary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${orderData.subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>
                ${orderData.serviceFee.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>
                ${orderData.tax.toFixed(2)}
              </Text>
            </View>
            <Separator style={styles.separator} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${orderData.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <Text style={styles.cardNumber}>•••• {orderData.cardLast4}</Text>
        </View>

        <Button style={styles.reorderButton} onPress={handleReorder}>
          <Text style={styles.reorderButtonText}>Reorder Items</Text>
        </Button>
      </ScrollView>

      <NavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#d32f2f",
  },
  header: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
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
    paddingBottom: 80,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  orderInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderId: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
  },
  orderDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#047857",
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  barcodeContainer: {
    alignItems: "center",
    marginTop: 16,
  },
  barcode: {
    flexDirection: "row",
    height: 48, // Increased height to make the barcode larger
    alignItems: "center",
  },
  bar: {
    width: 3, // Increased width of the bars
    height: "100%",
    backgroundColor: "#374151",
    marginHorizontal: 1,
  },
  barWide: {
    width: 6, // Increased width of the wide bars
  },
  barcodeText: {
    fontSize: 12, // Keep the text size the same
    color: "#6b7280",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
  },
  orderItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
  },
  itemQuantity: {
    fontSize: 12,
    color: "#6b7280",
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 12,
  },
  summary: {
    marginTop: 12,
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
    fontWeight: "500",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
  },
  cardNumber: {
    fontSize: 14,
    color: "#374151",
  },
  reorderButton: {
    backgroundColor: "#16a34a", // Green background
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  reorderButtonText: {
    color: "#fff", // White text
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default OrderDetails;
