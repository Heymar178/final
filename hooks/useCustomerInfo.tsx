import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { toast } from 'sonner';

interface UserType {
  name: string;
  email: string;
}

interface OrderType {
  id: string;
  total_price: number;
  status: string;
  created_at: string;
}

const useCustomerInfo = () => {
  const [user, setUser] = useState<UserType | null>(null);
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerInfo = async () => {
      setLoading(true);

      try {
        // Step 1: Get current session user
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData.user) {
          console.error('Error fetching auth user:', userError);
          toast.error('Failed to fetch logged in user.');
          setLoading(false);
          return;
        }

        const userId = userData.user.id;

        // Step 2: Fetch additional details from public.users
        const { data: userDetails, error: userDetailsError } = await supabase
          .from('users')
          .select('name, email')
          .eq('id', userId)
          .maybeSingle(); // <- Changed to maybeSingle() to avoid error if no match

        if (userDetailsError) {
          console.error('Error fetching user details:', userDetailsError);
          toast.error('Failed to fetch user profile.');
        }

        if (userDetails) {
          setUser(userDetails);
        } else {
          console.warn('No matching user found in public.users.');
          setUser(null);
        }

        // Step 3: Fetch order history
        const { data: orderHistory, error: orderError } = await supabase
          .from('orders')
          .select('id, total_price, status, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (orderError) {
          console.error('Error fetching orders:', orderError);
          toast.error('Failed to fetch order history.');
        }

        setOrders(orderHistory || []);
      } catch (error) {
        console.error('Unexpected error fetching customer info:', error);
        toast.error('An unexpected error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerInfo();
  }, []);

  return { user, orders, loading };
};

export default useCustomerInfo;
