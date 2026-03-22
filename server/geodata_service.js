const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');
const AdmZip = require('adm-zip');

const storageGeodata = path.join(__dirname, 'storage', 'geodata');
const storageProducts = path.join(__dirname, 'storage', 'products');

const featureMemoryCache = new Map();
const layerMetadata = [];

const levelFolders = { 
    2: 'countries', 3: 'countries', 
    4: 'provinces', 5: 'provinces', 
    6: 'districts', 7: 'districts', 
    8: 'wards', 9: 'wards', 
    12: 'infrastructure', 14: 'infrastructure' 
};

function loadGeojsonFromFile(filePath) {
    const raw = fs.readFileSync(filePath, 'utf8');
    const parsed = JSON.parse(raw);
    return parsed.features ? parsed : { type: "FeatureCollection", features: [] };
}

function processZipForGeojson(zipPath) {
    const zip = new AdmZip(zipPath);
    const zipEntries = zip.getEntries();
    let features = [];
    zipEntries.forEach(zipEntry => {
        if (!zipEntry.isDirectory && zipEntry.entryName.endsWith('.geojson')) {
            const content = zip.readAsText(zipEntry);
            const parsed = JSON.parse(content);
            if (parsed.features) {
                features.push(...parsed.features);
            }
        }
    });
    return { type: "FeatureCollection", features };
}

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://gmjxcgblzfjqhaavgjgh.supabase.co';
const supabaseAnonKey = 'sb_publishable_0Tn6z1ce6OJeRl5-4exKYA_vrWE6szc';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function initGeodataService() {
    console.log('[GeodataService] Initializing data...');
    // Fetch from Supabase for metadata consistency with the UI
    const { data: geodataLayers, error: geoErr } = await supabase.from('geodata_layers').select('*');
    const { data: productLayers, error: prodErr } = await supabase.from('products').select('*')
        .or('format.eq.geojson,file_url.ilike.%.zip');

    if (geoErr || prodErr) {
        console.error('[GeodataService] Supabase Fetch Error:', geoErr || prodErr);
    }

    featureMemoryCache.clear();
    layerMetadata.length = 0;

    if (!geodataLayers) return;

    // Load Geodata Layers
    for (const layer of geodataLayers) {
        try {
           let actualPath = layer.file_path;
           if (!actualPath.includes('/')) {
                const folder = levelFolders[layer.zoom_min] || 'infrastructure';
                actualPath = `${folder}/${actualPath}`;
           }
           const fullPath = path.join(storageGeodata, actualPath);
            if (fs.existsSync(fullPath)) {
                const geojson = loadGeojsonFromFile(fullPath);
                featureMemoryCache.set(layer.id, geojson);
                
                const groupName = levelFolders[layer.zoom_min] 
                     ? levelFolders[layer.zoom_min].charAt(0).toUpperCase() + levelFolders[layer.zoom_min].slice(1) 
                     : 'Other';
                     
                layerMetadata.push({ id: layer.id, name: layer.name, type: 'geodata', srcType: 'vector', selectable: true, visible: true, group: groupName });
            } else {
                console.warn(`[GeodataService] Missing file locally: ${fullPath}`);
            }
        } catch (e) {
            console.error(`Error loading layer ${layer.name}:`, e.message);
        }
    }


    
    if (productLayers) {
        // Load Product Layers
        for (const product of productLayers) {
            try {
                if (!product.file_url) continue;
                const relativePath = product.file_url.replace('/storage/', '');
                const fullPath = path.join(__dirname, 'storage', relativePath);
                
                if (fs.existsSync(fullPath)) {
                    let geojson;
                    if (fullPath.endsWith('.zip')) {
                        geojson = processZipForGeojson(fullPath);
                    } else if (fullPath.endsWith('.geojson')) {
                        geojson = loadGeojsonFromFile(fullPath);
                    }
                    
                    if (geojson && geojson.features.length > 0) {
                        featureMemoryCache.set(product.id, geojson);
                        layerMetadata.push({ id: product.id, name: product.title, group: 'Products', srcType: 'vector', selectable: true, visible: true });
                    }
                } else {
                    console.warn(`[GeodataService] Missing file locally for product: ${fullPath}`);
                }
            } catch (e) {
                console.error(`Error loading product layer ${product.title}:`, e.message);
            }
        }
    }
    console.log(`[GeodataService] Loaded ${featureMemoryCache.size} layers into memory.`);
}

function getLayerTree() {
    const tree = [];
    const grouped = {};
    layerMetadata.forEach(layer => {
        if (!grouped[layer.group]) grouped[layer.group] = [];
        grouped[layer.group].push(layer);
    });
    
    for (const [groupName, layers] of Object.entries(grouped)) {
        tree.push({
            groupName: groupName,
            layers: layers
        });
    }
    return tree;
}

function getFeaturesInBbox(bboxStr, activeLayers) {
    if (!bboxStr || !activeLayers || activeLayers.length === 0) return [];
    
    const [west, south, east, north] = bboxStr.split(',').map(Number);
    const bboxPoly = turf.bboxPolygon([west, south, east, north]);

    const results = [];
    for (const layerId of activeLayers) {
        const geojson = featureMemoryCache.get(layerId);
        if (geojson && geojson.features) {
            geojson.features.forEach((f, idx) => {
                const uniqueId = f.id || `${layerId}_${idx}`;
                try {
                   // Turf intersection
                   if (turf.booleanIntersects(bboxPoly, f)) {
                       results.push({
                           id: uniqueId,
                           layerId: layerId,
                           type: "Feature",
                           geometry: f.geometry,
                           properties: f.properties || {}
                       });
                   }
                } catch(e) {}
            });
        }
    }
    return results;
}

function downloadFeatures(selectedLayers, selectedFeaturesIds) {
    const outFeatures = [];
    
    for (const layerReq of selectedLayers) {
        const layerId = layerReq.id;
        const mode = layerReq.mode; // 'all' or 'custom'
        const geojson = featureMemoryCache.get(layerId);
        
        if (!geojson) continue;
        
        if (mode === 'all') {
            outFeatures.push(...geojson.features);
        } else if (mode === 'custom') {
           const specificIds = selectedFeaturesIds[layerId] || [];
           geojson.features.forEach((f, idx) => {
               const uniqueId = f.id || `${layerId}_${idx}`;
               if (specificIds.includes(uniqueId)) {
                   outFeatures.push(f);
               }
           });
        }
    }
    
    return { type: "FeatureCollection", features: outFeatures };
}

module.exports = {
    initGeodataService,
    getLayerTree,
    getFeaturesInBbox,
    downloadFeatures
};
