const axios = require('axios');
const fs = require('fs');
const path = require('path');
const jszip = require('jszip');
const shapefile = require('shapefile');
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://gmjxcgblzfjqhaavgjgh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0Tn6z1ce6OJeRl5-4exKYA_vrWE6szc'; 
const STORAGE_ROOT = path.join(__dirname, '..', 'server', 'storage', 'geodata');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const REMAINING_LAYERS = [
    {
        name: 'Rivers (1:10m)',
        scale: '10m',
        category: 'physical',
        theme: 'ne_10m_rivers_lake_centerlines',
        targetFolder: 'infrastructure',
        zoomMin: 9
    },
    {
        name: 'Roads (1:50m)',
        scale: '50m',
        category: 'cultural',
        theme: 'ne_50m_roads',
        targetFolder: 'infrastructure',
        zoomMin: 10
    },
    {
        name: 'Railways (1:50m)',
        scale: '50m',
        category: 'cultural',
        theme: 'ne_50m_railroads',
        targetFolder: 'infrastructure',
        zoomMin: 11
    },
    {
        name: 'Roads (1:10m)',
        scale: '10m',
        category: 'cultural',
        theme: 'ne_10m_roads',
        targetFolder: 'infrastructure',
        zoomMin: 12
    },
    {
        name: 'Railways (1:10m)',
        scale: '10m',
        category: 'cultural',
        theme: 'ne_10m_railroads',
        targetFolder: 'infrastructure',
        zoomMin: 13
    }
];

async function downloadAndConvert(layer) {
    const url = `https://naturalearth.s3.amazonaws.com/${layer.scale}_${layer.category}/${layer.theme}.zip`;
    console.log(`[Import] Processing ${layer.name}...`);

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const zip = await jszip.loadAsync(response.data);
        const shpFile = Object.keys(zip.files).find(f => f.endsWith('.shp'));
        const dbfFile = Object.keys(zip.files).find(f => f.endsWith('.dbf'));

        const shpBuffer = await zip.files[shpFile].async('nodebuffer');
        const dbfBuffer = await zip.files[dbfFile].async('nodebuffer');

        const geojson = await shapefile.read(shpBuffer, dbfBuffer);
        const targetDir = path.join(STORAGE_ROOT, layer.targetFolder);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

        const filename = `${layer.theme}.geojson`;
        const filePath = path.join(targetDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(geojson));

        const relativePath = `${layer.targetFolder}/${filename}`;
        await supabase.from('geodata_layers').insert([{
            name: layer.name,
            category: 'offline_extracted',
            zoom_min: layer.zoomMin,
            file_path: relativePath
        }]);
        console.log(`[Import] Completed ${layer.name}`);
    } catch (error) {
        console.error(`[Import] Failed ${layer.name}:`, error.message);
    }
}

async function run() {
    for (const layer of REMAINING_LAYERS) {
        await downloadAndConvert(layer);
    }
    console.log('--- Finish Import Process Completed ---');
}

run();
