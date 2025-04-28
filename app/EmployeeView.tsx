import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Package, Barcode } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "@/supabaseClient";
import EmployeeNavigationBar from "@/components/EmployeeNavigationBar";
import {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Dialog } from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { router } from "expo-router";


interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  status: "In Progress" | "Ready for Pickup" | "Completed";
  orderNumber: string;
  total: number;
  customerName: string;
  items: OrderItem[];
}

const EmployeeView: React.FC = () => {
  const navigation = useNavigation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999);

        const { data: ordersData, error: ordersError } = await supabase
          .from("orders")
          .select(
            `
            id,
            status,
            total_price,
            order_number,
            created_at,
            user_id,
            users (name)
          `
          )
          .gte("created_at", startOfDay.toISOString())
          .lte("created_at", endOfDay.toISOString());

        if (ordersError) {
          console.error("Error fetching orders:", ordersError.message);
          return;
        }

        const { data: orderItemsData, error: orderItemsError } = await supabase
          .from("order_items")
          .select("id, order_id, quantity, price, product_id, products (name)");

        if (orderItemsError) {
          console.error("Error fetching order items:", orderItemsError.message);
          return;
        }

        const formattedOrders = ordersData.map((order: any) => ({
          id: order.id,
          status: order.status,
          orderNumber: order.order_number,
          total: order.total_price,
          customerName: order.users?.name || "Customer",
          items: orderItemsData
            .filter((item: any) => item.order_id === order.id)
            .map((item: any) => ({
              id: item.id,
              name: item.products.name,
              quantity: item.quantity,
              price: item.price,
            })),
        }));

        setOrders(formattedOrders);
      } catch (error) {
        console.error("Unexpected error:", error);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Progress":
        return "#2563eb";
      case "Ready for Pickup":
        return "#d97706";
      case "Completed":
        return "#16a34a";
      default:
        return "#6b7280";
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedOrder) return;
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", selectedOrder.id);

    if (error) {
      console.error("Error updating status:", error.message);
    } else {
      setOrders((prev) =>
        prev.map((order) =>
          order.id === selectedOrder.id
            ? { ...order, status: newStatus }
            : order
        )
      );
      setIsStatusDialogOpen(false);
      setIsOrderDetailsOpen(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Scan Barcode */}
        <View style={styles.scanHeader}>
          <View style={styles.imageBox}>
            <Barcode size={48} color="white" />
          </View>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => navigation.navigate("ScanBarcode")}
          >
            <Text style={styles.scanButtonText}>Scan Barcode</Text>
          </TouchableOpacity>
        </View>

        {/* Orders */}
        <View style={styles.main}>
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => {
                setSelectedOrder(order);
                setIsOrderDetailsOpen(true);
              }}
            >
              <View style={styles.orderTop}>
                <View>
                  <Text style={styles.orderId}>{order.orderNumber}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(order.status) },
                    ]}
                  >
                    <Text style={styles.statusBadgeText}>{order.status}</Text>
                  </View>
                </View>
                <Text style={styles.customerName}>{order.customerName}</Text>
              </View>

              <View style={styles.orderDetails}>
                <Package size={16} style={styles.icon} />
                <Text style={styles.itemsText}>
                  {order.items.length} items
                </Text>{" "}
                {/* Moved to the left */}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Drawer */}
      <Drawer
        visible={isOrderDetailsOpen}
        onClose={() => setIsOrderDetailsOpen(false)}
      >
        <View style={styles.drawerContent}>
          <DrawerHeader>
            <DrawerTitle>{selectedOrder?.orderNumber}</DrawerTitle>
          </DrawerHeader>
          {selectedOrder && (
            <View>
              <Text style={styles.customerName}>
                {selectedOrder.customerName}
              </Text>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Qty</TableHead>
                    <TableHead>Price</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedOrder.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>
                  {formatCurrency(selectedOrder.total)}
                </Text>
              </View>

              <DrawerFooter>
                <Button
                  onPress={() => {
                    setIsOrderDetailsOpen(false);
                    setIsStatusDialogOpen(true);
                  }}
                  style={[styles.updateButton, { backgroundColor: "#16a34a" }]}
                >
                  <Text style={styles.updateButtonText}>Update Status</Text>
                </Button>
              </DrawerFooter>
            </View>
          )}
        </View>
      </Drawer>

      {/* Dialog */}
      <Dialog
        visible={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)} // Ensures the dialog closes
        title="Update Order Status"
        content={
          <View style={{ marginTop: 16, gap: 12 }}>
            <Button
              onPress={() => handleStatusChange("In Progress")}
              style={{
                backgroundColor: "#2563eb",
                paddingVertical: 16,
                width: "100%",
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                In Progress
              </Text>
            </Button>
            <Button
              onPress={() => handleStatusChange("Ready for Pickup")}
              style={{
                backgroundColor: "#d97706",
                paddingVertical: 16,
                width: "100%",
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Ready for Pickup
              </Text>
            </Button>
            <Button
              onPress={() => handleStatusChange("Completed")}
              style={{
                backgroundColor: "#16a34a",
                paddingVertical: 16,
                width: "100%",
                borderRadius: 12,
              }}
            >
              <Text style={{ color: "white", fontWeight: "600" }}>
                Completed
              </Text>
            </Button>
          </View>
        }
        actions={
          <Button
            onPress={() => setIsStatusDialogOpen(false)}
            style={{
              borderColor: "#fff",
              borderWidth: 1,
              width: "100%",
              paddingVertical: 16,
              borderRadius: 12,
              backgroundColor: "transparent",
            }}
          >
            <Text style={{ color: "#rgba(0, 0, 0, 0.8)", fontWeight: "600" }}>
              Cancel
            </Text>
          </Button>
        }
      />

      <EmployeeNavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9f9f9" },
  scrollContainer: { flexGrow: 1, paddingBottom: 80 },
  main: { paddingHorizontal: 16 },
  scanHeader: { alignItems: "center", paddingVertical: 16 },
  imageBox: {
    backgroundColor: "#06b6d4",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  scanButton: {
    backgroundColor: "#6b7280",
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanButtonText: { color: "white", fontWeight: "600" },
  orderCard: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  itemsText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151", // Dark gray for consistency
    marginLeft: 8, // Add spacing between the icon and the text
  },
  orderTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12, // Add spacing below the order top section
  },
  orderId: { fontSize: 16, fontWeight: "bold" },
  statusBadge: {
    marginTop: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  
  statusBadgeText: { color: "white", fontSize: 12, fontWeight: "600" },
  customerName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginVertical: 12, // Add spacing above and below the customer name
  },
  orderDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "#16a34a",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  updateButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  drawerContent: { padding: 16 },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16, // Add spacing above the total container
  },
  totalLabel: { fontSize: 16, fontWeight: "bold" },
  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
  },
});

export default EmployeeView;
