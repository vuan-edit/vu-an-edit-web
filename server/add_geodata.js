const { dbRun, initDB } = require('./database');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

/**
 * Cach dung: node add_geodata.js "Ten Layer" "file_name.geojson" 12
 */

const args = process.argv.slice(2);
if (args.length < 3) {
    console.log('Cach dung: node add_geodata.js "<ten layer>" "<file_name_trong_storage_geodata>" <zoom_min>');
    process.exit(1);
}

const [name, file_name, zoom_min] = args;
const file_path = file_name; // GeoExtractor logic dung ten file lam path trong storage 'geodata'

// Kiem tra file ton tai
const fullPath = path.join(__dirname, 'storage', 'geodata', file_name);
if (!fs.existsSync(fullPath)) {
    console.warn(`[CANH BAO] Khong tim thay file tai: ${fullPath}. Hãy đảm bảo bạn đã copy file vào folder storage/geodata/`);
}

async function start() {
    await initDB();
    const id = uuidv4();
    try {
        await dbRun(`INSERT INTO geodata_layers (id, name, file_path, zoom_min) VALUES (?, ?, ?, ?)`,
                     [id, name, file_path, parseInt(zoom_min)]);
        console.log(`✅ Da them Layer ban do: ${name}`);
        console.log(`ID: ${id}`);
    } catch (err) {
        console.error('❌ Loi khi them geodata:', err.message);
    }
}

start();
