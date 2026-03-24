const axios = require('axios');
const fs = require('fs');
const path = require('path');
const osmtogeojson = require('osmtogeojson');
const turf = require('@turf/turf');

// Config
const STORAGE_ROOT = path.join(__dirname, '..', 'server', 'storage', 'geodata', 'osm');
if (!fs.existsSync(STORAGE_ROOT)) fs.mkdirSync(STORAGE_ROOT, { recursive: true });

async function downloadChunk(bbox, types, retries = 2) {
    const [west, south, east, north] = bbox;
    const filter = types.join('|');
    const query = `way["highway"~"${filter}"](${south},${west},${north},${east});`;
    const body = `[out:json][timeout:600];(${query});out geom;`;
    const overpassUrl = 'https://overpass-api.de/api/interpreter';

    for (let i = 0; i <= retries; i++) {
        try {
            const response = await axios.post(overpassUrl, body, { timeout: 300000 });
            return osmtogeojson(response.data);
        } catch (error) {
            console.error(`  [Attempt ${i+1}] Chunk failed: ${error.message}. Retrying...`);
            await new Promise(r => setTimeout(r, 10000));
        }
    }
    return { type: 'FeatureCollection', features: [] };
}

async function run() {
    const vnBbox = [102.14, 8.18, 109.46, 23.39];
    const gridX = 10;
    const gridY = 10;
    const stepX = (vnBbox[2] - vnBbox[0]) / gridX;
    const stepY = (vnBbox[3] - vnBbox[1]) / gridY;

    const roadTypes = ["motorway", "trunk", "primary", "secondary", "tertiary", "unclassified", "residential", "service"];
    let allFeatures = [];
    let seenIds = new Set();

    console.log(`[OSM Full Download] Starting 10x10 tiled download for Vietnam...`);

    for (let x = 0; x < gridX; x++) {
        for (let y = 0; y < gridY; y++) {
            const west = vnBbox[0] + x * stepX;
            const east = west + stepX;
            const south = vnBbox[1] + y * stepY;
            const north = south + stepY;
            const bbox = [west, south, east, north];

            console.log(`[Chunk ${x},${y}] Fetching bbox: ${bbox.map(n => n.toFixed(2)).join(',')}...`);
            const geojson = await downloadChunk(bbox, roadTypes);
            
            let addedCount = 0;
            geojson.features.forEach(f => {
                const fid = f.id || `${f.geometry.type}_${f.geometry.coordinates?.[0]}`;
                if (fid && !seenIds.has(fid)) {
                    seenIds.add(fid);
                    allFeatures.push(f);
                    addedCount++;
                }
            });

            console.log(`  [Done] Found ${geojson.features.length} features (${addedCount} new). Total so far: ${allFeatures.length}`);
            // Wait to respect Overpass rate limits
            await new Promise(r => setTimeout(r, 2000));
        }
    }

    const finalGeojson = {
        type: 'FeatureCollection',
        features: allFeatures
    };

    const filePath = path.join(STORAGE_ROOT, 'osm_roads_vietnam_full.geojson');
    console.log(`[OSM Full Download] Saving ${allFeatures.length} features to ${filePath}...`);
    fs.writeFileSync(filePath, JSON.stringify(finalGeojson));
    console.log(`[OSM Full Download] Finished! File size: ${Math.round(fs.statSync(filePath).size / 1024 / 1024)} MB`);
}

run();
