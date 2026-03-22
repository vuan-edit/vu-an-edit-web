const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { dbAll, dbRun, initDB } = require('./database');
const geodataService = require('./geodata_service');
const tokml = require('tokml');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

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
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/geodata/features', (req, res) => {
    try {
        const { bbox, activeLayers } = req.body;
        const features = geodataService.getFeaturesInBbox(bbox, activeLayers);
        res.json({ data: features });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/geodata/download', (req, res) => {
    try {
        const { selectedLayers, selectedFeatures, format } = req.body;
        const fc = geodataService.downloadFeatures(selectedLayers, selectedFeatures);
        
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
        res.setHeader('Content-type', contentType);
        res.send(outData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Old API for local Geodata Layers (Keep for compatibility if needed)
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

// NEW: Delete Local File Endpoint
app.delete('/api/file', (req, res) => {
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
