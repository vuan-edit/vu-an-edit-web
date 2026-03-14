// Example implementation for the Pricing/Buy button in React
import { supabase } from '../supabaseClient';

const handleBuyPlan = async (planId, userId) => {
  try {
    const { data, error } = await supabase.functions.invoke('payos-integration', {
      body: { 
        action: 'create-payment-link',
        planId: planId,
        userId: userId
      },
    });

    if (error) throw error;

    if (data && data.data && data.data.checkoutUrl) {
      // Redirect user to PayOS checkout page
      window.location.href = data.data.checkoutUrl;
    } else {
      alert('Có lỗi xảy ra khi tạo liên kết thanh toán.');
    }
  } catch (err) {
    console.error('Error creating payment link:', err);
    alert('Không thể kết nối với máy chủ thanh toán.');
  }
};

// Real-time listener to detect when plan is updated
const subscribeToProfileChanges = (userId, onUpdate) => {
  return supabase
    .channel('profile-updates')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'profiles',
        filter: `id=eq.${userId}`,
      },
      (payload) => {
        onUpdate(payload.new);
      }
    )
    .subscribe();
};
