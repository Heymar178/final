import React, { useEffect, useState } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import {
  UserRound,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  ChevronRight,
  FileText,
} from "lucide-react-native";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import NavigationBar from "@/components/NavigationBar";
import { toast } from "sonner";
import { supabase } from "@/supabaseClient";
import MenuItem from "@/components/MenuItem";

type RootStackParamList = {
  Login: undefined;
  EditProfile: undefined;
  Orders: undefined;
  PaymentSettings: undefined;
  NotificationSettings: undefined;
  HelpCenter: undefined;
  OrderDetails: { orderId: string };
  "(tabs)/Orders": undefined;
};

interface OrderType {
  order_number: string;
  total_price: number;
  status: string;
  created_at: string;
}

const Account: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null
  );
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get the currently logged-in user
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("Error fetching user:", userError);
          toast.error("Failed to fetch user information.");
          return;
        }

        // Fetch user details from the `users` table
        const { data: userDetails, error: userDetailsError } = await supabase
          .from("users")
          .select("name, email")
          .eq("id", user.id)
          .single();

        if (userDetailsError || !userDetails) {
          console.error("Error fetching user details:", userDetailsError);
          toast.error("Failed to fetch user details.");
          return;
        }

        setUser(userDetails);

        // Fetch order history from the `orders` table
        const { data: orderHistory, error: orderError } = await supabase
          .from("orders")
          .select("id, order_number, total_price, status, created_at") // Include 'id'
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (orderError) {
          console.error("Error fetching orders:", orderError);
          toast.error("Failed to fetch order history.");
          return;
        }

        setOrders(orderHistory || []);
      } catch (error) {
        console.error("Unexpected error:", error);
        toast.error("An unexpected error occurred.");
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      toast.error("Failed to sign out.");
    } else {
      toast.success("Successfully signed out!");
      navigation.navigate("Login");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const handleOrderClick = (orderId: string) => {
    navigation.navigate("OrderDetails", { orderId }); // Pass the correct UUID
  };

  return (
    <View style={styles.container}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Avatar style={styles.avatar}>
          <AvatarImage
            source={{
              uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80",
            }}
          />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>{user?.name || "Loading..."}</Text>
          <Text style={styles.profileEmail}>{user?.email || "Loading..."}</Text>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Recent Orders Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
          <View style={styles.card}>
            {orders.length > 0 ? (
              <>
                {/* Show the two most recent orders */}
                {orders.slice(0, 2).map((order) => (
                  <Pressable
                    key={order.id} // Use 'id' as the key
                    style={styles.orderItem}
                    onPress={() => handleOrderClick(order.id)} // Pass the correct UUID
                    accessibilityLabel={`Order #${order.order_number}`}
                  >
                    <View>
                      <Text style={styles.orderId}>{order.order_number}</Text>
                      <Text style={styles.orderDate}>
                        {new Date(order.created_at).toLocaleDateString()}
                      </Text>
                      <Text
                        style={[
                          styles.orderStatus,
                          order.status === "completed" &&
                            styles.completedStatus,
                          order.status === "pending" && styles.pendingStatus,
                          order.status === "cancelled" &&
                            styles.cancelledStatus,
                        ]}
                      >
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Text>
                    </View>
                    <Text style={styles.orderTotal}>
                      {formatCurrency(order.total_price)}
                    </Text>
                  </Pressable>
                ))}

                {/* Show "View All Orders" button if there are more than 2 orders */}
                {orders.length > 2 && (
                  <Pressable
                    onPress={() => navigation.navigate("(tabs)/Orders")}
                    onPressIn={() => setIsHovered(true)}
                    onPressOut={() => setIsHovered(false)}
                  >
                    <Text
                      style={[
                        styles.viewAllButton,
                        isHovered && styles.viewAllButtonHovered,
                      ]}
                    >
                      View All Orders
                    </Text>
                  </Pressable>
                )}
              </>
            ) : (
              <Text style={styles.noOrdersText}>No orders found.</Text>
            )}
          </View>
        </View>

        {/* Menu Section */}
        <View style={styles.section}>
          <View style={styles.card}>
            <MenuItem
              icon={<UserRound size={20} color="#000" />} // Black icon
              label="Edit Profile"
              onPress={() => navigation.navigate("EditProfile")}
            />
            <Separator />
            <MenuItem
              icon={<FileText size={20} color="#000" />} // Black icon
              label="My Orders"
              onPress={() => navigation.navigate("(tabs)/Orders")}
            />
            <Separator />
            <MenuItem
              icon={<CreditCard size={20} color="#000" />} // Black icon
              label="Payment Methods"
              onPress={() => navigation.navigate("PaymentSettings")}
            />
            <Separator />
            <MenuItem
              icon={<Bell size={20} color="#000" />} // Black icon
              label="Notifications"
              onPress={() => navigation.navigate("NotificationSettings")}
            />
            <Separator />
            <MenuItem
              icon={<HelpCircle size={20} color="#000" />} // Black icon
              label="Help Center"
              onPress={() => navigation.navigate("HelpCenter")}
            />
            <Separator />
            <MenuItem
              icon={<LogOut size={20} color="#dc2626" />} // Red icon
              label="Sign Out"
              onPress={handleSignOut}
              danger
            />
          </View>
        </View>
      </ScrollView>

      {/* Bottom Navigation Bar */}
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
  profileSection: {
    backgroundColor: "#fff",
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  avatar: {
    height: 64,
    width: 64,
    borderWidth: 1,
    borderColor: "#000",
  },
  profileInfo: {
    marginLeft: 16,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileEmail: {
    color: "#687076",
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontWeight: "bold",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
  },
  orderItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    marginTop: 4,
  },
  completedStatus: {
    color: "#047857",
  },
  pendingStatus: {
    color: "#d97706",
  },
  cancelledStatus: {
    color: "#dc2626",
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "bold",
  },
  noOrdersText: {
    textAlign: "center",
    padding: 16,
    color: "#6b7280",
  },
  viewAllButton: {
    marginTop: 16,
    alignSelf: "center",
    color: "#16a34a", // Green text
    width: "50%",
    textAlign: "center",
  },
  viewAllButtonHovered: {
    textDecorationLine: "underline", // Green underline on hover
    textDecorationColor: "#16a34a",
  },
});

export default Account;
