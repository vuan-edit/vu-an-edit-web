const axios = require('axios');
const fs = require('fs');
const path = require('path');
const osmtogeojson = require('osmtogeojson');
const turf = require('@turf/turf');
const { createClient } = require('@supabase/supabase-js');

// Config
const SUPABASE_URL = 'https://gmjxcgblzfjqhaavgjgh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0Tn6z1ce6OJeRl5-4exKYA_vrWE6szc'; 
const STORAGE_ROOT = path.join(__dirname, '..', 'server', 'storage', 'geodata', 'osm');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

if (!fs.existsSync(STORAGE_ROOT)) fs.mkdirSync(STORAGE_ROOT, { recursive: true });

async function downloadOsmOffline(bbox, type, filename, name, tolerance = 0.0001) {
    const [west, south, east, north] = bbox;
    console.log(`[OSM Download] Fetching ${name} (${type}) for bbox ${bbox}...`);

    let query = '';
    if (type === 'roads') {
        query = `way["highway"~"motorway|trunk|primary|secondary|tertiary"](${south},${west},${north},${east});`;
    } else if (type === 'railways') {
        query = `way["railway"](${south},${west},${north},${east});`;
    } else if (type === 'waterways') {
        query = `way["waterway"](${south},${west},${north},${east});`;
    } else if (type === 'admin') {
        query = `relation["boundary"="administrative"]["admin_level"~"4|6"](${south},${west},${north},${east});`;
    }

    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const body = `[out:json][timeout:300];(${query});out geom;`;

    try {
        const response = await axios.post(overpassUrl, body);
        let geojson = osmtogeojson(response.data);
        console.log(`[OSM Download] Received ${geojson.features.length} features.`);

        if (tolerance > 0) {
            console.log(`[OSM Download] Simplifying with tolerance ${tolerance}...`);
            geojson = turf.simplify(geojson, { tolerance: tolerance, highQuality: false });
        }

        const filePath = path.join(STORAGE_ROOT, filename);
        fs.writeFileSync(filePath, JSON.stringify(geojson));
        console.log(`[OSM Download] Saved optimized file to ${filePath} (${Math.round(JSON.stringify(geojson).length / 1024 / 1024)} MB)`);

        // Register in Supabase (with UPSERT logic if possible, but here we just insert or skip)
        const relativePath = `osm/${filename}`;
        console.log(`[OSM Download] Registering in Database...`);
        
        await supabase.from('geodata_layers').upsert([{
            name: `${name} (OSM Offline)`,
            category: 'offline_extracted',
            zoom_min: 10,
            file_path: relativePath
        }], { onConflict: 'file_path' });

        console.log(`[OSM Download] Successfully completed ${name}`);
    } catch (error) {
        console.error(`[OSM Download] Failed ${name}:`, error.message);
    }
}

const sleep = ms => new Promise(res => setTimeout(res, ms));

async function run() {
    const vnBbox = [102.1, 8.3, 109.5, 23.4];
    const hanoiBbox = [105.7, 20.9, 106.0, 21.2];
    const saigonBbox = [106.5, 10.6, 106.9, 10.9];
    
    // 1. National Major Infrastructure (NE provides overview, OSM provides major roads)
    await downloadOsmOffline(vnBbox, 'roads', 'osm_roads_vietnam_major.geojson', 'Vietnam Major Roads', 0.0002);
    await sleep(20000);
    
    // 2. High Detail Regions (Hanoi & HCM)
    await downloadOsmOffline(hanoiBbox, 'roads', 'osm_roads_hanoi.geojson', 'Hanoi Roads', 0.00005);
    await sleep(20000);
    await downloadOsmOffline(saigonBbox, 'roads', 'osm_roads_saigon.geojson', 'Saigon Roads', 0.00005);
    await sleep(20000);
    
    // 3. Admin & Railways (Manageable at national scale)
    await downloadOsmOffline(vnBbox, 'railways', 'osm_railways_vietnam.geojson', 'Vietnam Railways', 0.0001);
    await sleep(20000);
    await downloadOsmOffline(vnBbox, 'admin', 'osm_admin_vietnam.geojson', 'Vietnam Admin Boundaries', 0.0001);
    
    console.log('--- OSM Offline Targeted Download & Optimization Finished ---');
}

run();
