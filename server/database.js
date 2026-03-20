const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.join(__dirname, 'vuanedit.db');
const db = new sqlite3.Database(dbPath);

// Promised-based methods
const dbRun = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve(this);
    });
});

const dbGet = (sql, params = []) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
    });
});

const dbAll = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
    });
});

async function initDB() {
    // Users table (Combined auth.users and profiles)
    await dbRun(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        plan_id TEXT DEFAULT 'free',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Products table
    await dbRun(`CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        format TEXT NOT NULL,
        size TEXT,
        access TEXT DEFAULT 'paid',
        thumb TEXT,
        file_url TEXT,
        featured BOOLEAN DEFAULT 0,
        is_lifetime BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // Payment History table
    await dbRun(`CREATE TABLE IF NOT EXISTS payment_history (
        id TEXT PRIMARY KEY,
        user_id TEXT REFERENCES users(id),
        order_code INTEGER UNIQUE NOT NULL,
        amount INTEGER NOT NULL,
        plan_id TEXT NOT NULL,
        status TEXT DEFAULT 'pending',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // GeoData Layers table (Used by GeoExtractor)
    await dbRun(`CREATE TABLE IF NOT EXISTS geodata_layers (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        file_path TEXT NOT NULL,
        zoom_min INTEGER DEFAULT 12,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

    // --- SEED DATA ---
    
    // Seed Admin User (password: vuan123)
    // In production, we should hash this, but I'll do it in the signup logic/init
    const adminEmail = 'vuan.edit@gmail.com';
    const existingAdmin = await dbGet('SELECT * FROM users WHERE email = ?', [adminEmail]);
    if (!existingAdmin) {
        const bcrypt = require('bcryptjs');
        const hash = await bcrypt.hash('vuan123', 10);
        await dbRun('INSERT INTO users (id, email, password_hash, plan_id) VALUES (?, ?, ?, ?)', 
            ['admin-uuid', adminEmail, hash, 'lifetime']);
        console.log('Admin user seeded');
    }

    // Seed Products from docs/seed_products.sql (simulated)
    const productCount = await dbGet('SELECT COUNT(*) as count FROM products');
    if (productCount.count === 0) {
        const products = [
            ['Ranh giới 63 tỉnh thành VN', 'Bản đồ vector ranh giới hành chính 63 tỉnh thành phố Việt Nam chuẩn mới nhất.', 'geojson', '4.2 MB', 'free', 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=800', '/storage/products/provincial_boundaries.zip', 1, 0],
            ['Ranh giới quận huyện toàn quốc', 'Toàn bộ ranh giới hành chính cấp quận/huyện của 63 tỉnh thành.', 'geojson', '12.5 MB', 'paid', 'https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&q=80&w=800', '/storage/products/district_boundaries.zip', 0, 0],
            ['Hệ thống sông ngòi quốc gia', 'Dữ liệu các dòng sông chính, kênh rạch lớn tại Việt Nam phục vụ animation thời tiết/địa lý.', 'geojson', '8.1 MB', 'free', 'https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&q=80&w=800', '/storage/products/rivers_vietnam.zip', 1, 0],
            ['Mạng lưới đường cao tốc VN', 'Chi tiết các tuyến đường cao tốc Bắc Nam và các tuyến nhánh (đã hoàn thành).', 'geojson', '2.4 MB', 'paid', 'https://images.unsplash.com/photo-1518534015033-2144368140ee?auto=format&fit=crop&q=80&w=800', '/storage/products/highways_vietnam.zip', 0, 0],
            ['AE Map Animator Script', 'Script After Effects hỗ trợ tạo viền chạy, vẽ line tự động dựa trên mask hoặc path từ KML.', 'plugin', '50 KB', 'paid', 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800', '/storage/products/ae_animator.zip', 1, 1],
            ['Premiere Map Overlay Pack', 'Gói essential graphics (MOGRT) tạo popup vị trí bản đồ cực nhanh trên Premiere Pro.', 'plugin', '120 MB', 'paid', 'https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&q=80&w=800', '/storage/products/premiere_overlay.zip', 1, 1]
        ];
        for (const p of products) {
            await dbRun(`INSERT INTO products (id, title, description, format, size, access, thumb, file_url, featured, is_lifetime) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                         [require('crypto').randomUUID(), ...p]);
        }
        console.log('Sample products seeded');
    }

    // Seed GeoData layers for GeoExtractor
    const layerCount = await dbGet('SELECT COUNT(*) as count FROM geodata_layers');
    if (layerCount.count === 0) {
        const layers = [
            ['Tỉnh thành VN', 'vietnam_provinces.geojson', 5],
            ['Quận huyện VN', 'vietnam_districts.geojson', 9],
            ['Phường xã VN', 'vietnam_wards.geojson', 12]
        ];
        for (const l of layers) {
             await dbRun(`INSERT INTO geodata_layers (id, name, file_path, zoom_min) VALUES (?, ?, ?, ?)`,
                [require('crypto').randomUUID(), ...l]);
        }
        console.log('GeoData layers seeded');
    }
}

module.exports = {
    db,
    dbRun,
    dbGet,
    dbAll,
    initDB
};
