-- 1. Thêm cột is_lifetime vào bảng products nếu chưa tồn tại
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_lifetime boolean DEFAULT false;

-- 2. Cập nhật một số sản phẩm mẫu thành Lifetime (Tùy chọn)
UPDATE products SET is_lifetime = true WHERE format = 'plugin';
