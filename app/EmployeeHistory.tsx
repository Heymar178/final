import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react-native';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import EmployeeNavigationBar from '@/components/EmployeeNavigationBar';
import { supabase } from '@/supabaseClient';

interface OrderHistory {
  orderNumber: string;
  date: string;
  status: string;
  employee: string | null; // Employee name or null if not found
}

const EmployeeHistory: React.FC = () => {
  const navigation = useNavigation();
  const [orderHistory, setOrderHistory] = useState<OrderHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderHistory = async () => {
      try {
        // Fetch orders and join with users table to get employee names
        const { data, error } = await supabase
          .from('orders') // Replace 'orders' with your actual table name
          .select(`
            order_number,
            created_at,
            status,
            user_id, 
            users (name)  -- Assuming 'users' table has a 'name' column
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching order history:', error.message);
          return;
        }

        // Map the data to match the OrderHistory interface
        const formattedData = data.map((order: any) => ({
          orderNumber: order.order_number,
          date: `${new Date(order.created_at).toLocaleDateString()} ${new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`, // Format time without seconds
          status: order.status,
          employee: order.users?.name || 'Unknown', // Use 'Unknown' if no employee name is found
        }));

        setOrderHistory(formattedData);
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress':
        return '#2563eb'; // Blue
      case 'Ready for Pickup':
        return '#d97706'; // Amber
      case 'Completed':
        return '#16a34a'; // Green
      default:
        return '#6b7280'; // Gray
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading order history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button
          variant="ghost"
          size="icon"
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#000" />
        </Button>
        <Text style={styles.headerTitle}>Order History</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order #</TableHead>
              <TableHead>Date & Time</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Updated By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderHistory.map((order) => (
              <TableRow key={order.orderNumber}>
                <TableCell style={styles.tableCellBold}>{order.orderNumber}</TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell style={{ color: getStatusColor(order.status) }}>{order.status}</TableCell>
                <TableCell>{order.employee}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollView>

      <EmployeeNavigationBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    backgroundColor: '#fff',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  backButton: {
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 80, // Prevent overlap with the navigation bar
  },
  tableCellBold: {
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  tableHeader: {
    borderBottomWidth: 0, // Remove the bottom border
  },
});

export default EmployeeHistory;