const { createClient } = require('@supabase/supabase-js');

// Config
const supabaseUrl = 'https://gmjxcgblzfjqhaavgjgh.supabase.co';
const supabaseAnonKey = 'sb_publishable_0Tn6z1ce6OJeRl5-4exKYA_vrWE6szc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const newUrl = process.argv[2];

if (!newUrl) {
    console.error("Vui lòng cung cấp URL tunnel. Ví dụ: node update_tunnel.js https://abcd.trycloudflare.com");
    process.exit(1);
}

async function updateTunnel() {
    console.log(`Đang cập nhật Tunnel URL lên Supabase: ${newUrl}...`);
    
    const { error } = await supabase
        .from('app_config')
        .upsert({ key: 'tunnel_url', value: newUrl, updated_at: new Date().toISOString() });

    if (error) {
        console.error("Lỗi cập nhật:", error.message);
        console.log("\nLƯU Ý: Hãy đảm bảo bạn đã tạo bảng 'app_config' và thiết lập RLS trong Supabase Dashboard.");
    } else {
        console.log("Thành công! Toàn bộ người dùng web sẽ tự động nhận diện server của bạn sau khi load lại trang.");
    }
}

updateTunnel();
