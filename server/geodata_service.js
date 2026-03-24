const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');
const AdmZip = require('adm-zip');
const axios = require('axios');
const osmtogeojson = require('osmtogeojson');
const RBush = require('rbush').default || require('rbush');

const storageGeodata = path.join(__dirname, 'storage', 'geodata');
const storageProducts = path.join(__dirname, 'storage', 'products');

const featureMemoryCache = new Map();
const spatialIndexes = new Map(); // RBush instances for large layers
const osmCache = new Map(); // Cache for OSM dynamic results
const layerMetadata = [];
const physicalPathToId = new Map();

const levelFolders = { 
    2: 'countries', 3: 'countries', 
    4: 'countries', // 1:50m scale
    5: 'provinces', 
    6: 'infrastructure', 
    7: 'countries', // 1:10m scale
    8: 'provinces', 
    9: 'infrastructure',
    12: 'infrastructure', 14: 'infrastructure' 
};

// Config for "Smart" layers that switch scales based on zoom
const SMART_LAYERS_CONFIG = {
    'countries': {
        name: 'Quốc gia / Countries',
        group: 'Ranh giới / Administrative',
        scales: [
            { zoom_max: 5, path_suffix: 'ne_110m_admin_0_countries.geojson' },
            { zoom_max: 8, path_suffix: 'ne_50m_admin_0_countries.geojson' },
            { zoom_max: 20, path_suffix: 'ne_10m_admin_0_countries.geojson' }
        ]
    },
    'provinces': {
        name: 'Tỉnh thành / States & Provinces',
        group: 'Ranh giới / Administrative',
        scales: [
            { zoom_max: 6, path_suffix: 'ne_50m_admin_1_states_provinces.geojson' },
            { zoom_max: 20, path_suffix: 'ne_10m_admin_1_states_provinces.geojson' },
            { zoom_max: 20, path_suffix: 'osm/vn_provinces_local.geojson', isOsm: true, osmType: 'provinces' }
        ]
    },
    'wards': {
        name: 'Phường xã / Wards',
        group: 'Ranh giới / Administrative',
        scales: [
            { zoom_max: 10, path_suffix: null },
            { zoom_max: 20, path_suffix: 'osm/vn_wards_local.geojson', isOsm: true, osmType: 'wards' }
        ]
    },
    'rivers': {
        name: 'Đường thủy / Waterways',
        group: 'Tự nhiên / Nature',
        scales: [
            { zoom_max: 7, path_suffix: 'ne_50m_rivers_lake_centerlines.geojson' },
            { zoom_max: 12, path_suffix: 'ne_10m_rivers_lake_centerlines.geojson' },
            { zoom_max: 20, path_suffix: 'osm/osm_waterways_vietnam.geojson', isOsm: true, osmType: 'waterways' }
        ]
    },
    'roads': {
        name: 'Đường bộ / Roads',
        group: 'Hạ tầng / Infrastructure',
        scales: [
            { zoom_max: 13, path_suffix: 'ne_10m_roads.geojson' },
            { zoom_max: 15, path_suffix: 'osm/osm_roads_vietnam_major.geojson', isOsm: true, osmType: 'roads' },
            { zoom_max: 20, path_suffix: 'osm/osm_roads_vietnam_full.geojson', isOsm: true, osmType: 'roads' }
        ]
    },
    'railways': {
        name: 'Đường sắt / Railways',
        group: 'Hạ tầng / Infrastructure',
        scales: [
            { zoom_max: 12, path_suffix: 'ne_10m_railroads.geojson' },
            { zoom_max: 20, path_suffix: 'osm/osm_railways_vietnam.geojson', isOsm: true, osmType: 'railways' }
        ]
    }
};

async function fetchOsmDataLive(bbox, type, zoom) {
    const [west, south, east, north] = bbox;
    const cacheKey = `${type}_${Math.round(west*10)/10}_${Math.round(south*10)/10}_${Math.round(east*10)/10}_${Math.round(north*10)/10}_${zoom < 15 ? 'major' : 'full'}`;
    
    if (osmCache.has(cacheKey)) return osmCache.get(cacheKey);

    console.log(`[OSM Live] Fetching ${type} for ${bbox} (Zoom: ${zoom})...`);
    let query = '';
    if (type === 'roads') {
        const filter = zoom < 15 ? 'motorway|trunk|primary|secondary' : 'motorway|trunk|primary|secondary|tertiary|unclassified|residential';
        query = `way["highway"~"${filter}"](${south},${west},${north},${east});`;
    } else if (type === 'railways') {
        query = `way["railway"](${south},${west},${north},${east});`;
    } else if (type === 'waterways') {
        query = `way["waterway"](${south},${west},${north},${east});`;
    } else if (type === 'provinces') {
        query = `relation["admin_level"="4"](${south},${west},${north},${east});`;
    }

    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    const body = `[out:json][timeout:60];(${query});out geom;`;

    try {
        const response = await axios.post(overpassUrl, body);
        const geojson = osmtogeojson(response.data);
        osmCache.set(cacheKey, geojson);
        return geojson;
    } catch (error) {
        console.error(`[OSM Live] Fetch failed: ${error.message}`);
        return { type: "FeatureCollection", features: [] };
    }
}

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
    const { data: geodataLayers, error: geoErr } = await supabase.from('geodata_layers').select('*');
    const { data: productLayers, error: prodErr } = await supabase.from('products').select('*')
        .or('format.eq.geojson,file_url.ilike.%.zip');

    if (geoErr || prodErr) {
        console.error('[GeodataService] Supabase Fetch Error:', geoErr || prodErr);
    }

    featureMemoryCache.clear();
    layerMetadata.length = 0;
    physicalPathToId.clear();

    if (geodataLayers) {
        for (const layer of geodataLayers) {
            try {
                let actualPath = layer.file_path;
                if (!actualPath.includes('/')) {
                    const folder = levelFolders[layer.zoom_min] || 'infrastructure';
                    actualPath = `${folder}/${actualPath}`;
                }
                const fullPath = path.join(storageGeodata, actualPath);
                if (fs.existsSync(fullPath)) {
                    console.log(`[GeodataService] Loading: ${fullPath}`);
                    const geojson = loadGeojsonFromFile(fullPath);
                    featureMemoryCache.set(layer.id, geojson);
                    physicalPathToId.set(layer.file_path, layer.id);
                    
                    const groupName = levelFolders[layer.zoom_min] 
                         ? levelFolders[layer.zoom_min].charAt(0).toUpperCase() + levelFolders[layer.zoom_min].slice(1) 
                         : 'Other';
                         
                    layerMetadata.push({ 
                        id: layer.id, 
                        name: layer.name, 
                        type: 'geodata', 
                        srcType: 'vector', 
                        selectable: true, 
                        visible: true, 
                        group: groupName,
                        filePath: layer.file_path 
                    });
                }
            } catch (e) {
                console.error(`Error loading layer ${layer.name}: ${e.message}`);
            }
        }
    }

    if (productLayers) {
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
                }
            } catch (e) {
                console.error(`Error loading product layer ${product.title}: ${e.message}`);
            }
        }
    }
    // NEW: Auto-load OSM files from disk for reliability
    const osmDir = path.join(storageGeodata, 'osm');
    if (fs.existsSync(osmDir)) {
        const osmFiles = fs.readdirSync(osmDir).filter(f => f.endsWith('.geojson'));
        for (const fileName of osmFiles) {
            const relPath = `osm/${fileName}`;
            if (!physicalPathToId.has(relPath)) {
                const fullPath = path.join(osmDir, fileName);
                console.log(`[GeodataService] Auto-loading OSM: ${fullPath}`);
                const geojson = loadGeojsonFromFile(fullPath);
                const layerId = `osm_auto_${fileName.replace('.geojson', '')}`;
                featureMemoryCache.set(layerId, geojson);
                physicalPathToId.set(relPath, layerId);
            }
        }
    }

    console.log(`[GeodataService] Loaded ${featureMemoryCache.size} layers into memory.`);
    
    for (const [id, geojson] of featureMemoryCache.entries()) {
        if (geojson.features.length > 1000) {
            console.log(`[GeodataService] Building RBush index for ${id} (${geojson.features.length} features)...`);
            const index = new RBush();
            const items = geojson.features.map((f, i) => {
                const b = turf.bbox(f);
                return { minX: b[0], minY: b[1], maxX: b[2], maxY: b[3], featureIndex: i };
            });
            index.load(items);
            spatialIndexes.set(id, index);
        }
    }
}

function getLayerTree() {
    const tree = [];
    const grouped = {};
    
    // 1. Add Smart Layers first
    Object.entries(SMART_LAYERS_CONFIG).forEach(([id, config]) => {
        if (!grouped[config.group]) grouped[config.group] = [];
        grouped[config.group].push({
            id: id,
            name: config.name,
            type: 'geodata',
            srcType: 'vector',
            selectable: true,
            visible: true,
            group: config.group,
            isSmart: true
        });
    });

    // 2. Add other layers (non-Natural Earth)
    layerMetadata.forEach(layer => {
        if (layer.filePath && layer.filePath.includes('ne_')) return; 
        if (!grouped[layer.group]) grouped[layer.group] = [];
        grouped[layer.group].push(layer);
    });
    
    for (const [groupName, layers] of Object.entries(grouped)) {
        tree.push({ groupName: groupName, layers: layers });
    }
    return tree;
}

async function getFeaturesInBbox(bboxStr, activeLayers, zoomLevel = 5) {
    if (!bboxStr || !activeLayers || activeLayers.length === 0) return [];
    
    const [west, south, east, north] = bboxStr.split(',').map(Number);
    const bboxPoly = turf.bboxPolygon([west, south, east, north]);
    const results = [];
    const zoom = parseInt(zoomLevel);

    for (const layerId of activeLayers) {
        let featuresToProcess = [];
        let effectiveLayerId = layerId;
        let bestScale = null;

        // Handle Smart Layers
        if (SMART_LAYERS_CONFIG[layerId]) {
            const config = SMART_LAYERS_CONFIG[layerId];
            const matchingScales = config.scales.filter(s => zoom <= s.zoom_max);
            // If no match, use the last one
            const scalesToUse = matchingScales.length > 0 ? matchingScales : [config.scales[config.scales.length - 1]];
            
            for (const scale of scalesToUse) {
                const p = scale.path_suffix;
                if (!p) continue; // Skip placeholders like for 'wards' at low zoom

                const physicalId = physicalPathToId.get(p) || physicalPathToId.get(`infrastructure/${p}`) || 
                                   physicalPathToId.get(`countries/${p}`) || physicalPathToId.get(`provinces/${p}`);
                
                const geojson = featureMemoryCache.get(physicalId);
                const index = spatialIndexes.get(physicalId);

                if (index) {
                    const searchResults = index.search({ minX: west, minY: south, maxX: east, maxY: north });
                    let features = searchResults.map(r => geojson.features[r.featureIndex]);
                    
                    // DEDUPLICATE: If this is a global province file, skip Vietnam features to avoid overlap with local data
                    if (p.includes('admin_1_states_provinces') && !p.includes('local')) {
                        features = features.filter(f => f.properties.iso_a2 !== 'VN' && f.properties.adm0_a3 !== 'VNM');
                    }
                    featuresToProcess.push(...features);
                } else if (geojson) {
                    let features = geojson.features;
                    if (p.includes('admin_1_states_provinces') && !p.includes('local')) {
                        features = features.filter(f => f.properties.iso_a2 !== 'VN' && f.properties.adm0_a3 !== 'VNM');
                    }
                    featuresToProcess.push(...features);
                }

                // HYBRID FALLBACK: If offline data is missing or empty at high zoom for an OSM scale, try Live Fetch
                if (scale.isOsm && (featuresToProcess.length === 0 || !physicalId)) {
                    // Check if we are inside Vietnam for basic major road offline availability
                    const vnBbox = [102.14, 8.18, 109.46, 23.39];
                    const isInsideVN = west > vnBbox[0] && east < vnBbox[2] && south > vnBbox[1] && north < vnBbox[3];
                    
                    if (zoom >= 15 || !isInsideVN) {
                        const liveGeojson = await fetchOsmDataLive([west, south, east, north], config.osmType, zoom);
                        if (liveGeojson && liveGeojson.features.length > 0) {
                            featuresToProcess.push(...liveGeojson.features);
                        }
                    }
                }
            }
        } else {
            const geojson = featureMemoryCache.get(effectiveLayerId);
            featuresToProcess = geojson ? geojson.features : [];
        }

        featuresToProcess.forEach((f, idx) => {
            const uniqueId = f.id || `${effectiveLayerId}_${idx}`;
            try {
                let intersects = false;
                // Double check intersection (Turf is safer for non-indexed features)
                if (bestScale && spatialIndexes.has(effectiveLayerId)) {
                    intersects = true; 
                } else {
                    intersects = turf.booleanIntersects(bboxPoly, f);
                }

                if (intersects) {
                    let featureToSend = f;
                    
                    // Dynamic Simplification for performance (User's request)
                    if (zoom < 16) {
                        const tolerance = zoom < 14 ? 0.001 : 0.0001;
                        featureToSend = turf.simplify(f, { tolerance: tolerance, highQuality: false });
                    }

                    results.push({
                        id: uniqueId,
                        layerId: layerId,
                        type: "Feature",
                        geometry: featureToSend.geometry,
                        properties: f.properties || {}
                    });
                }
            } catch(e) {}
        });
    }
    return results;
}

async function downloadFeatures(selectedLayers, selectedFeaturesIds) {
    const outFeatures = [];
    
    for (const layerReq of selectedLayers) {
        const layerId = layerReq.id;
        const mode = layerReq.mode;
        
        let geojson;
        let effectiveLayerId = layerId;

        // Handle Smart Layers for download (Use highest detail)
        if (SMART_LAYERS_CONFIG[layerId]) {
            const config = SMART_LAYERS_CONFIG[layerId];
            const highDetail = config.scales[config.scales.length - 1]; // Use last scale (most detailed)
            
            const p = highDetail.path_suffix;
            const physicalId = physicalPathToId.get(p) || physicalPathToId.get(`infrastructure/${p}`) || 
                               physicalPathToId.get(`countries/${p}`) || physicalPathToId.get(`provinces/${p}`);
            
            if (physicalId) effectiveLayerId = physicalId;
        }

        geojson = featureMemoryCache.get(effectiveLayerId);
        if (!geojson) continue;
        
        if (mode === 'all') {
            outFeatures.push(...geojson.features);
        } else if (mode === 'custom') {
            const specificIds = selectedFeaturesIds[layerId] || [];
            geojson.features.forEach((f, idx) => {
                const uniqueId = f.id || `${effectiveLayerId}_${idx}`;
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
