/**
 * Example implementation for showing SePay QR Code in React
 */

// 1. Function to generate a random Order Code and show QR
const initiateSePayPayment = async (planId, amount, userId) => {
  // Generate a random 6-digit order code
  const orderCode = Math.floor(100000 + Math.random() * 900000);
  const memo = `VCK ${orderCode}`; // Standard format for your Edge Function to parse
  
  // Save the pending transaction to Supabase first
  const { error } = await supabase
    .from('payment_history')
    .insert({
      user_id: userId,
      order_code: orderCode,
      amount: amount,
      plan_id: planId,
      status: 'pending'
    });

  if (error) {
    console.error('Lỗi khi tạo đơn hàng:', error);
    return;
  }

  // SePay QR API URL (Replace with your BIDV details)
  const bankId = 'BIDV';
  const accountNo = 'YOUR_BIDV_ACCOUNT_NUMBER'; 
  const accountName = 'YOUR_NAME';
  
  const qrUrl = `https://qr.sepay.vn/img?bank=${bankId}&acc=${accountNo}&template=compact&amount=${amount}&des=${encodeURIComponent(memo)}`;

  // Here you would typically show a Modal with the QR image
  // return qrUrl;
  console.log('QR Code URL:', qrUrl);
  return { qrUrl, memo, orderCode };
};

// 2. Component to listen for success (Realtime)
const PaymentStatusListener = ({ userId, onPaymentSuccess }) => {
  useEffect(() => {
    const channel = supabase
      .channel('profile-update')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'profiles', filter: `id=eq.${userId}` },
        (payload) => {
          console.log('Payment Success detected!', payload.new);
          onPaymentSuccess(payload.new);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return null;
};
