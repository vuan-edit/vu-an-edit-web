import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    console.log('SePay Webhook received:', payload)

    /**
     * SePay Payload example:
     * {
     *   "id": 123456,
     *   "gateway": "BIDV",
     *   "transactionDate": "2024-03-14 11:00:00",
     *   "accountNumber": "123456789",
     *   "content": "VCK 987654", <--- This contains our Order Code
     *   "transferType": "in",
     *   "transferAmount": 500000,
     *   "accumulated": 1500000,
     *   "code": null,
     *   "referenceCode": "...",
     *   "description": "..."
     * }
     */

    const content = payload.content || ""
    // Extract Order Code from content (assuming memo format like "VCK 123456")
    const match = content.match(/VCK\s*(\d+)/i)
    
    if (!match) {
      return new Response(JSON.stringify({ error: 'No order code found in content' }), { status: 200 })
    }

    const orderCode = match[1]

    // 1. Find the pending payment
    const { data: payment, error: fetchError } = await supabaseClient
      .from('payment_history')
      .select('*')
      .eq('order_code', orderCode)
      .eq('status', 'pending')
      .single()

    if (fetchError || !payment) {
      console.error('Payment not found or already processed:', orderCode)
      return new Response(JSON.stringify({ error: 'Payment not found' }), { status: 200 })
    }

    // 2. Verify amount (optional but recommended)
    if (payload.transferAmount < payment.amount) {
      console.warn('Insufficient amount received:', payload.transferAmount, 'expected:', payment.amount)
      // You might want to log this but not update the plan yet
    }

    // 3. Update payment status
    await supabaseClient
      .from('payment_history')
      .update({ status: 'PAID', updated_at: new Response().headers.get('date') }) // Simple way to get current time
      .eq('order_code', orderCode)

    // 4. Upgrade user plan and set expiry
    const now = new Date()
    let expiryDate: Date | null = null
    
    if (payment.plan_id === 'monthly') {
      expiryDate = new Date(now.setMonth(now.getMonth() + 1))
      expiryDate.setHours(0, 0, 0, 0)
    } else if (payment.plan_id === 'yearly') {
      expiryDate = new Date(now.setFullYear(now.getFullYear() + 1))
      expiryDate.setHours(0, 0, 0, 0)
    }

    const { error: profileError } = await supabaseClient
      .from('profiles')
      .update({ 
        plan_id: payment.plan_id,
        plan_expiry: expiryDate ? expiryDate.toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.user_id)

    if (profileError) throw profileError

    console.log(`Successfully upgraded user ${payment.user_id} to ${payment.plan_id}`)

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Webhook error:', error.message)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
