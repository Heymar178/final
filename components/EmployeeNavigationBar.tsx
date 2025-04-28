import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { History, Scan, LogOut } from "lucide-react-native";
import { useRouter } from "expo-router";

const EmployeeNavigationBar: React.FC = () => {
  const router = useRouter(); // Use router for navigation

  return (
    <View style={styles.container}>
      {/* Navigate to EmployeeHistory */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/EmployeeHistory")}
      >
        <History size={24} color="#374151" />
        <Text style={styles.navText}>History</Text>
      </TouchableOpacity>

      {/* Navigate to ScanBarcode */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/ScanBarcode")} // Ensure this matches the route name
      >
        <Scan size={24} color="#374151" />
        <Text style={styles.navText}>Scan</Text>
      </TouchableOpacity>

      {/* Navigate to Login */}
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => router.push("/Login")}
      >
        <LogOut size={24} color="#374151" />
        <Text style={styles.navText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#e5e5e5",
  },
  navItem: {
    alignItems: "center",
  },
  navText: {
    fontSize: 12,
    color: "#374151",
    marginTop: 4,
  },
});

export default EmployeeNavigationBar;
