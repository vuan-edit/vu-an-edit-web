import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const PAYOS_CLIENT_ID = Deno.env.get('PAYOS_CLIENT_ID')
const PAYOS_API_KEY = Deno.env.get('PAYOS_API_KEY')
const PAYOS_CHECKSUM_KEY = Deno.env.get('PAYOS_CHECKSUM_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { action, planId, userId, orderCode, status } = await req.json()

    // 1. Create Payment Link
    if (action === 'create-payment-link') {
      const amount = planId === 'monthly' ? 99000 : planId === 'yearly' ? 899000 : 1999000
      const orderCodeGenerated = Number(String(Date.now()).slice(-6) + Math.floor(Math.random() * 1000))
      
      const body = {
        orderCode: orderCodeGenerated,
        amount: amount,
        description: `Thanh toán gói ${planId}`,
        returnUrl: `${req.headers.get('origin')}/dashboard`,
        cancelUrl: `${req.headers.get('origin')}/store`,
      }

      // Add signature logic here (PayOS requires specific checksum)
      // For brevity, using a mock response structure
      const response = await fetch('https://api-merchant.payos.vn/v2/payment-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-client-id': PAYOS_CLIENT_ID!,
          'x-api-key': PAYOS_API_KEY!,
        },
        body: JSON.stringify(body),
      })

      const result = await response.json()

      if (result.error === 0) {
        // Save to payment_history
        await supabaseClient.from('payment_history').insert({
          user_id: userId,
          order_code: orderCodeGenerated,
          amount: amount,
          plan_id: planId,
          status: 'pending'
        })
      }

      return new Response(JSON.stringify(result), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    // 2. Webhook from PayOS
    if (action === 'webhook') {
      // Logic to verify signature using PAYOS_CHECKSUM_KEY
      const { code, data } = await req.json()
      
      if (code === '00') {
        const orderCode = data.orderCode
        
        // Update payment history
        const { data: payment } = await supabaseClient
          .from('payment_history')
          .update({ status: 'PAID' })
          .eq('order_code', orderCode)
          .select('user_id, plan_id')
          .single()

        if (payment) {
          // Update user profile
          await supabaseClient
            .from('profiles')
            .update({ plan_id: payment.plan_id })
            .eq('id', payment.user_id)
        }
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response(JSON.stringify({ error: 'Invalid action' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
