import { supabase } from '@/supabaseClient';
import { toast } from 'sonner';

export const handleAddToCart = async (product: any, quantity: number, userId: string, locationId: string) => {
  try {
    // Step 1: Check if an active order exists for the user
    const { data: existingOrder, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    let orderId;

    if (orderError || !existingOrder) {
      // If no active order exists, create a new one
      const { data: newOrder, error: newOrderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: userId,
            status: 'active',
            total_price: 0, // Initialize with 0, will update later
            location_id: locationId,
          },
        ])
        .select()
        .single();

      if (newOrderError) {
        console.error('Error creating new order:', newOrderError);
        toast.error('Failed to create a new order.');
        return false;
      }

      orderId = newOrder.id;
    } else {
      // Use the existing active order
      orderId = existingOrder.id;
    }

    // Step 2: Add the item to the order_items table
    const { data: orderItem, error: orderItemError } = await supabase
      .from('order_items')
      .insert([
        {
          order_id: orderId,
          product_id: product.id,
          quantity: quantity,
          price: product.price,
          location_id: locationId,
        },
      ]);

    if (orderItemError) {
      console.error('Error adding item to order_items:', orderItemError);
      toast.error('Failed to add item to cart.');
      return false;
    }

    // Step 3: Update the total price of the order
    const updatedTotalPrice = (existingOrder?.total_price || 0) + product.price * quantity;

    const { error: updateOrderError } = await supabase
      .from('orders')
      .update({ total_price: updatedTotalPrice })
      .eq('id', orderId);

    if (updateOrderError) {
      console.error('Error updating order total price:', updateOrderError);
      toast.error('Failed to update order total.');
      return false;
    }

    toast.success(`${quantity} ${product.name} added to cart!`);
    return true;
  } catch (error) {
    console.error('Unexpected error adding to cart:', error);
    toast.error('An unexpected error occurred.');
    return false;
  }
};