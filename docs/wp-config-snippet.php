/**
 * WordPress wp-config.php — THÊM ĐOẠN NÀY
 * 
 * Paste vào wp-config.php trên Hostinger
 * TRƯỚC dòng: "/* That's all, stop editing! */"
 * 
 * Cách thực hiện:
 * 1. Hostinger hPanel → File Manager
 * 2. Mở public_html/wp-config.php
 * 3. Tìm dòng: /* That's all, stop editing! */
 * 4. Paste đoạn code PHP bên dưới TRƯỚC dòng đó
 * 5. Save
 */

// ============ COPY ĐOẠN PHP NÀY ============

// === VU AN EDIT: Subfolder config ===
// Cho WordPress biết URL thật của nó
define('WP_HOME', 'https://vuanedit.online/blog');
define('WP_SITEURL', 'https://vuanedit.online/blog');

// Fix HTTPS behind Cloudflare Worker proxy
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

// Trust Cloudflare's IP forwarding
if (isset($_SERVER['HTTP_CF_CONNECTING_IP'])) {
    $_SERVER['REMOTE_ADDR'] = $_SERVER['HTTP_CF_CONNECTING_IP'];
}

// ============ HẾT ============
