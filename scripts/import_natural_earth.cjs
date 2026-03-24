const axios = require('axios');
const fs = require('fs');
const path = require('path');
const jszip = require('jszip');
const shapefile = require('shapefile');
const { createClient } = require('@supabase/supabase-js');

// Config
const SUPABASE_URL = 'https://gmjxcgblzfjqhaavgjgh.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0Tn6z1ce6OJeRl5-4exKYA_vrWE6szc'; // Using the anon key from geodata_service.js
const STORAGE_ROOT = path.join(__dirname, '..', 'server', 'storage', 'geodata');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const LAYERS_TO_IMPORT = [
    {
        name: 'Countries (1:110m)',
        scale: '110m',
        category: 'cultural',
        theme: 'ne_110m_admin_0_countries',
        targetFolder: 'countries',
        zoomMin: 2
    },
    {
        name: 'Countries (1:50m)',
        scale: '50m',
        category: 'cultural',
        theme: 'ne_50m_admin_0_countries',
        targetFolder: 'countries',
        zoomMin: 4
    },
    {
        name: 'Provinces/States (1:50m)',
        scale: '50m',
        category: 'cultural',
        theme: 'ne_50m_admin_1_states_provinces',
        targetFolder: 'provinces',
        zoomMin: 5
    },
    {
        name: 'Rivers (1:50m)',
        scale: '50m',
        category: 'physical',
        theme: 'ne_50m_rivers_lake_centerlines',
        targetFolder: 'infrastructure',
        zoomMin: 6
    },
    {
        name: 'Countries (1:10m)',
        scale: '10m',
        category: 'cultural',
        theme: 'ne_10m_admin_0_countries',
        targetFolder: 'countries',
        zoomMin: 7
    },
    {
        name: 'Provinces/States (1:10m)',
        scale: '10m',
        category: 'cultural',
        theme: 'ne_10m_admin_1_states_provinces',
        targetFolder: 'provinces',
        zoomMin: 8
    },
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
    console.log(`[Import] Downloading ${layer.name} from ${url}...`);

    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const zip = await jszip.loadAsync(response.data);
        
        // Find .shp and .dbf files
        const shpFile = Object.keys(zip.files).find(f => f.endsWith('.shp'));
        const dbfFile = Object.keys(zip.files).find(f => f.endsWith('.dbf'));

        if (!shpFile || !dbfFile) {
            throw new Error(`Missing .shp or .dbf in zip for ${layer.theme}`);
        }

        const shpBuffer = await zip.files[shpFile].async('nodebuffer');
        const dbfBuffer = await zip.files[dbfFile].async('nodebuffer');

        console.log(`[Import] Converting ${layer.theme} to GeoJSON...`);
        const geojson = await shapefile.read(shpBuffer, dbfBuffer);

        const targetDir = path.join(STORAGE_ROOT, layer.targetFolder);
        if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

        const filename = `${layer.theme}.geojson`;
        const filePath = path.join(targetDir, filename);
        fs.writeFileSync(filePath, JSON.stringify(geojson));
        console.log(`[Import] Saved to ${filePath}`);

        // Register in Supabase
        console.log(`[Import] Registering ${layer.name} in Supabase...`);
        const relativePath = `${layer.targetFolder}/${filename}`;
        
        const { data, error } = await supabase.from('geodata_layers').insert([{
            name: layer.name,
            category: 'offline_extracted',
            zoom_min: layer.zoomMin,
            file_path: relativePath
        }]);

        if (error) {
            console.warn(`[Import] Supabase Insertion Error: ${error.message}`);
            console.warn(`[Import] Note: This might be due to RLS policies. You may need to insert this manually or use a Service Role Key.`);
        } else {
            console.log(`[Import] Successfully registered ${layer.name}`);
        }

    } catch (error) {
        console.error(`[Import] Failed to process ${layer.name}:`, error.message);
    }
}

async function run() {
    console.log('--- Natural Earth Data Import Started ---');
    for (const layer of LAYERS_TO_IMPORT) {
        await downloadAndConvert(layer);
    }
    console.log('--- Import Process Completed ---');
}

run();
