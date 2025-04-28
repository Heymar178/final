import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Minus, Plus, Trash } from "lucide-react-native"; // Import Trash icon
import { Button } from "@/components/ui/button";

export interface CartItemType {
  id: string;
  name: string;
  price: number;
  image_url: string; // Updated to match the database field
  quantity: number;
  unit: string;
}

interface CartItemProps {
  item: CartItemType;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onDelete: (id: string) => void; // New prop for delete functionality
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onIncrement,
  onDecrement,
  onDelete,
}) => {
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(item.price);

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.image_url }} style={styles.image} />
      </View>
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.unit}>{item.unit}</Text>
        <Text style={styles.price}>{formattedPrice}</Text>
      </View>
      <View style={styles.actions}>
        <Button
          variant="outline"
          size="icon"
          style={styles.actionButton}
          onPress={() => onDecrement(item.id)}
        >
          <Minus size={16} color="#000" /> {/* Black Minus icon */}
        </Button>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <Button
          variant="outline"
          size="icon"
          style={styles.actionButton}
          onPress={() => onIncrement(item.id)}
        >
          <Plus size={16} color="#000" /> {/* Black Plus icon */}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          style={styles.deleteButton}
          onPress={() => onDelete(item.id)} // Call the delete function
        >
          <Trash size={16} color="#dc2626" /> {/* Red Trash Can icon */}
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  imageContainer: {
    height: 64,
    width: 64,
    borderRadius: 8,
    overflow: "hidden",
  },
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  unit: {
    fontSize: 12,
    color: "#687076",
    marginBottom: 8,
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 16,
  },
  actionButton: {
    height: 32,
    width: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteButton: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    marginHorizontal: 12,
    fontSize: 14,
    textAlign: "center",
  },
});

export default CartItem;