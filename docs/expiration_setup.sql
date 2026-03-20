-- 1. Thêm cột plan_expiry vào bảng profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS plan_expiry TIMESTAMP WITH TIME ZONE;

-- 2. Tạo function để tự động chuyển tài khoản hết hạn về gói 'free'
CREATE OR REPLACE FUNCTION public.handle_expired_subscriptions()
RETURNS void AS $$
BEGIN
  UPDATE public.profiles
  SET plan_id = 'free',
      plan_expiry = NULL
  WHERE plan_expiry < NOW() 
    AND plan_id IN ('monthly', 'yearly');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Hướng dẫn thiết lập Cron Job (Chạy mỗi đêm lúc 00:00)
-- Lưu ý: Bạn cần chạy lệnh này trong SQL Editor của Supabase 
-- Nếu dự án của bạn đã kích hoạt extension pg_cron:
-- SELECT cron.schedule('0 0 * * *', 'SELECT public.handle_expired_subscriptions()');

-- Nếu chưa có pg_cron, bạn có thể tạo một Edge Function đơn giản để gọi function này 
-- và dùng GitHub Actions hoặc một dịch vụ cron bên ngoài để gọi định kỳ.
