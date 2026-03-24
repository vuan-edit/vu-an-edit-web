require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const rateLimit = require('express-rate-limit');
const { dbAll, dbRun, initDB } = require('./database');
const geodataService = require('./geodata_service');
const tokml = require('tokml');

const app = express();
const PORT = process.env.PORT || 3000;

// --- SECURITY: CORS Whitelist ---
const allowedOrigins = [
    'https://vuanedit.online',
    'http://localhost:5173',
    'http://localhost:4173',
    'http://127.0.0.1:5173'
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(new Error('CORS policy: Origin not allowed'), false);
    }
}));

app.use(express.json());

// --- SECURITY: Rate Limiting ---
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 200 requests per windowMs
    message: { error: 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', apiLimiter);

// --- SECURITY: Simple Admin Auth Middleware ---
// Uses Supabase JWT verification via the anon key
const { createClient } = require('@supabase/supabase-js');
const supabaseAdmin = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

async function requireAuth(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !user) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Authentication failed' });
    }
}

// Log incoming requests
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Ensure storage directories exist
const storageDir = path.join(__dirname, 'storage');
const productsDir = path.join(storageDir, 'products');
const geodataDir = path.join(storageDir, 'geodata');

const geodataSubdirs = ['countries', 'provinces', 'districts', 'wards', 'infrastructure'].map(lvl => path.join(geodataDir, lvl));

[storageDir, productsDir, geodataDir, ...geodataSubdirs].forEach(dir => {
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

// --- NEW GEODATA API FOR OVERHAUL ---
app.get('/api/geodata/tree', (req, res) => {
    try {
        const tree = geodataService.getLayerTree();
        res.json({ data: tree });
    } catch (err) {
        console.error('[API] Error getting layer tree:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/geodata/features', async (req, res) => {
    try {
        const { bbox, activeLayers, zoom } = req.body;
        const features = await geodataService.getFeaturesInBbox(bbox, activeLayers, zoom);
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.json({ data: features });
    } catch (err) {
        console.error('[API] Error getting features:', err.message);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/geodata/download', async (req, res) => {
    try {
        const { selectedLayers, selectedFeatures, format } = req.body;
        const fc = await geodataService.downloadFeatures(selectedLayers, selectedFeatures);
        
        let outData, filename, contentType;
        if (format === 'kml') {
            try { outData = tokml(fc); } catch(e) { return res.status(500).json({ error: 'KML Conversion Error' }); }
            filename = 'GeoExtractor_Export.kml';
            contentType = 'application/vnd.google-earth.kml+xml';
        } else {
            outData = JSON.stringify(fc);
            filename = 'GeoExtractor_Export.geojson';
            contentType = 'application/geo+json';
        }
        
        res.setHeader('Content-disposition', `attachment; filename=${filename}`);
        res.setHeader('Content-type', `${contentType}; charset=utf-8`);
        res.send(outData);
    } catch (err) {
        console.error('[API] Error downloading features:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// Old API for local Geodata Layers (Keep for compatibility if needed)
app.get('/api/geodata/layers', async (req, res) => {
    try {
        const layers = await dbAll('SELECT * FROM geodata_layers');
        res.json({ data: layers });
    } catch (err) {
        console.error('[API] Error getting layers:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// SECURITY: Upload Endpoint — now requires auth
app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    
    // Return the filename so the frontend can save it to Supabase
    res.json({ 
        filename: req.file.filename,
        path: `/storage/${req.body.type || 'products'}/${req.file.filename}`
    });
});

// SECURITY: Delete Local File Endpoint — now requires auth
app.delete('/api/file', requireAuth, (req, res) => {
    const filePath = req.body.path; // e.g., 'geodata/provinces/file.geojson'
    if (!filePath) return res.status(400).json({ error: 'Missing file path' });

    // Prevent directory traversal
    const safePath = path.normalize(filePath).replace(/^(\.\.(\/|\\|$))+/, '');
    const absolutePath = path.join(__dirname, 'storage', safePath);
    
    // Ensure the path is strictly inside the 'storage' directory
    if (!absolutePath.startsWith(storageDir)) {
        return res.status(403).json({ error: 'Access denied' });
    }

    fs.unlink(absolutePath, (err) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: 'Failed to delete file' });
        }
        res.json({ success: true, message: 'File deleted' });
    });
});

// Ping
app.get('/ping', (req, res) => res.send('pong'));

// Start server
initDB().then(() => {
    return geodataService.initGeodataService();
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Local Hybrid File Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error("Failed to start server:", err);
});
