const { dbRun, initDB } = require('./database');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

/**
 * Cach dung: node add_product.js "Ten san pham" "Mo ta" "geojson" "5MB" "free" "thumb_url" "file_name.zip" 1 0
 */

const args = process.argv.slice(2);
if (args.length < 7) {
    console.log('Cach dung: node add_product.js "<ten>" "<mo ta>" "<format>" "<size>" "<free/paid>" "<thumb_url>" "<file_name_trong_storage>" [featured:0/1] [is_lifetime:0/1]');
    process.exit(1);
}

const [title, description, format, size, access, thumb, file_name, featured = 0, is_lifetime = 0] = args;
const file_url = `/storage/products/${file_name}`;

// Kiem tra file ton tai
const fullPath = path.join(__dirname, 'storage', 'products', file_name);
if (!fs.existsSync(fullPath)) {
    console.warn(`[CANH BAO] Khong tim thay file tai: ${fullPath}. Hãy đảm bảo bạn đã copy file vào folder storage/products/`);
}

async function start() {
    await initDB();
    const id = uuidv4();
    try {
        await dbRun(`INSERT INTO products (id, title, description, format, size, access, thumb, file_url, featured, is_lifetime) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
                     [id, title, description, format, size, access, thumb, file_url, parseInt(featured), parseInt(is_lifetime)]);
        console.log(`✅ Da them san pham: ${title}`);
        console.log(`ID: ${id}`);
    } catch (err) {
        console.error('❌ Loi khi them san pham:', err.message);
    }
}

start();
