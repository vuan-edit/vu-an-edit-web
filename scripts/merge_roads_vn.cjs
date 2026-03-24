const axios = require('axios');
const fs = require('fs');
const path = require('path');
const osmtogeojson = require('osmtogeojson');

const STORAGE_ROOT = path.join(__dirname, '..', 'server', 'storage', 'geodata', 'osm');

async function fetchRegion(bbox, name) {
    const [west, south, east, north] = bbox;
    const roadTypes = ["motorway", "trunk", "primary", "secondary", "tertiary", "unclassified", "residential", "service"];
    const query = `way["highway"~"${roadTypes.join('|')}"](${south},${west},${north},${east});`;
    const body = `[out:json][timeout:60];(${query});out geom;`;
    const overpassUrl = 'https://overpass-api.de/api/interpreter';

    console.log(`[Fetch ${name}] Requesting ${bbox}...`);
    try {
        const response = await axios.post(overpassUrl, body);
        const geojson = osmtogeojson(response.data);
        console.log(`[Fetch ${name}] Success: ${geojson.features.length} features.`);
        return geojson.features;
    } catch (e) {
        console.error(`[Fetch ${name}] Failed: ${e.message}`);
        return [];
    }
}

async function run() {
    // 1. Load Major Roads (Existing 75MB)
    const majorPath = path.join(STORAGE_ROOT, 'osm_roads_vietnam_major.geojson');
    let allFeatures = [];
    if (fs.existsSync(majorPath)) {
        console.log(`[Merge] Loading Major Roads...`);
        const major = JSON.parse(fs.readFileSync(majorPath, 'utf8'));
        allFeatures = major.features;
    }

    // 2. Load Local Roads for Specific Area (Long Bien - current user view)
    const longBien = await fetchRegion([105.87, 21.02, 105.95, 21.06], "Long Bien Local");

    // 3. Deduplicate and Merge
    const seenIds = new Set(allFeatures.map(f => f.id));
    longBien.forEach(f => {
        if (!seenIds.has(f.id)) {
            seenIds.add(f.id);
            allFeatures.push(f);
        }
    });

    // 4. Save to "Full" file
    const finalGeojson = { type: 'FeatureCollection', features: allFeatures };
    const fullPath = path.join(STORAGE_ROOT, 'osm_roads_vietnam_full.geojson');
    fs.writeFileSync(fullPath, JSON.stringify(finalGeojson));
    console.log(`[Merge] Saved ${allFeatures.length} features to ${fullPath}`);
    console.log(`[Merge] File size: ${Math.round(fs.statSync(fullPath).size / 1024 / 1024)} MB`);
}

run();
