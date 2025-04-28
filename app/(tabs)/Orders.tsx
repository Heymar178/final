import React, { useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Button } from "@/components/ui/button";
import NavigationBar from "@/components/NavigationBar";
import { ArrowLeft, ShoppingBag } from "lucide-react-native";
import useCustomerInfo from "@/hooks/useCustomerInfo"; // Import the shared hook

type RootStackParamList = {
  OrderDetails: { orderId: string };
  account: undefined;
};

const Orders: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [activeTab, setActiveTab] = useState("all");
  const { orders, loading } = useCustomerInfo(); // Use the shared hook to fetch orders

  // Filter orders based on the active tab
  const filterOrders = (tab: string) => {
    if (tab === "all") return orders; // Show all orders
    if (tab === "active") {
      // Show orders with Ready, Processing, AwaitingPickup, and Pending status
      return orders.filter((order) =>
        ["Ready", "Processing", "AwaitingPickup", "Pending"].includes(
          order.status
        )
      );
    }
    if (tab === "past") {
      // Show orders with Failed, Completed, Refunded, and Cancelled status
      return orders.filter((order) =>
        ["Failed", "Completed", "Refunded", "Cancelled"].includes(order.status)
      );
    }
    return orders;
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Completed":
        return styles.deliveredStatus;
      case "Ready":
      case "Processing":
      case "AwaitingPickup":
      case "Pending":
        return styles.inProgressStatus;
      case "Cancelled":
      case "Failed":
      case "Refunded":
        return styles.cancelledStatus;
      default:
        return styles.defaultStatus;
    }
  };

  const handleOrderClick = (orderId: string) => {
    navigation.navigate("OrderDetails", { orderId });
  };

  const renderOrders = (filteredOrders: any[]) => {
    if (filteredOrders.length === 0) {
      return <Text style={styles.noOrdersText}>No Orders Available</Text>;
    }

    return filteredOrders.map((order) => (
      <TouchableOpacity
        key={order.id}
        style={styles.orderCard}
        onPress={() => handleOrderClick(order.id)} // Pass the `id` (UUID) to the handler
        accessibilityLabel={`Order #${order.order_number}`}
      >
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderId}>Order #{order.order_number}</Text>{" "}
            {/* Display order_number */}
            <Text style={styles.orderDate}>
              {new Date(order.created_at).toLocaleDateString()}
            </Text>
          </View>
          <Text style={[styles.orderStatus, getStatusStyle(order.status)]}>
            {order.status}
          </Text>
        </View>
        <View style={styles.orderDetails}>
          <ShoppingBag size={20} color="#6b7280" style={styles.orderIcon} />
          <Text style={styles.orderItems}>{order.items} Items</Text>
          <Text style={styles.orderTotal}>${order.total_price.toFixed(2)}</Text>
        </View>
        <Button
          variant="outline"
          style={styles.viewDetailsButton}
          onPress={() => handleOrderClick(order.id)}
        >
          View Details
        </Button>
      </TouchableOpacity>
    ));
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#" style={styles.loading} />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="icon"
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          accessibilityProps={{
            accessibilityLabel: "Go back to the previous page",
          }}
        >
          <ArrowLeft size={24} color="#000" /> {/* Black icon */}
        </Button>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "all" && styles.activeTab]}
          onPress={() => setActiveTab("all")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "all" && styles.activeTabText,
            ]}
          >
            All Orders
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "active" && styles.activeTab]}
          onPress={() => setActiveTab("active")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "active" && styles.activeTabText,
            ]}
          >
            Active
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "past" && styles.activeTab]}
          onPress={() => setActiveTab("past")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "past" && styles.activeTabText,
            ]}
          >
            Past Orders
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {renderOrders(filterOrders(activeTab))}
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
  tabs: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#fff",
    borderBottomWidth: 2,
    borderBottomColor: "#16a34a", // Updated to #16a34a
  },
  tabText: {
    fontSize: 14,
    color: "#6b7280",
  },
  activeTabText: {
    color: "#16a34a", // Updated to #16a34a
    fontWeight: "bold",
  },
  content: {
    flexGrow: 1,
    padding: 16,
  },
  orderCard: {
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
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "500",
  },
  orderDate: {
    fontSize: 14,
    color: "#6b7280",
  },
  orderStatus: {
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deliveredStatus: {
    backgroundColor: "#D1FAE5",
    color: "#16a34a", // Updated to #16a34a
  },
  inProgressStatus: {
    backgroundColor: "#BFDBFE",
    color: "#2563EB",
  },
  cancelledStatus: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },
  defaultStatus: {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
  },
  orderDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  orderIcon: {
    marginRight: 8,
  },
  orderItems: {
    fontSize: 14,
    color: "#6b7280",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: "auto",
  },
  viewDetailsButton: {
    width: "100%",
    borderColor: "#16a34a", // Updated to #16a34a
    color: "#16a34a", // Updated to #16a34a
  },
  noOrdersText: {
    textAlign: "center",
    fontSize: 16,
    color: "#6b7280",
    marginTop: 20,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Orders;
