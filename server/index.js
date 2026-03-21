const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { dbAll, dbRun, initDB } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ensure storage directories exist
const storageDir = path.join(__dirname, 'storage');
const productsDir = path.join(storageDir, 'products');
const geodataDir = path.join(storageDir, 'geodata');

[storageDir, productsDir, geodataDir].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Multer Storage Configuration
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const type = req.body.type || 'products'; // defaults to products
        cb(null, path.join(__dirname, 'storage', type));
    },
    filename: function (req, file, cb) {
        // Use original name or timestamp to avoid collisions
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});
const upload = multer({ storage: storage });

// Serve static files from storage/
app.use('/storage', express.static(storageDir));

// API for local Geodata Layers
app.get('/api/geodata/layers', async (req, res) => {
    try {
        const layers = await dbAll('SELECT * FROM geodata_layers');
        res.json({ data: layers });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// NEW: Upload Endpoint for Admin
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Return the filename so the frontend can save it to Supabase
    res.json({ 
        filename: req.file.filename,
        path: `/storage/${req.body.type || 'products'}/${req.file.filename}`
    });
});

// Ping
app.get('/ping', (req, res) => res.send('pong'));

// Start server
initDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Local Hybrid File Server running on http://localhost:${PORT}`);
    });
});
