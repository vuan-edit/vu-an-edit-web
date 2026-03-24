const fs = require('fs');
const path = require('path');
const turf = require('@turf/turf');

const OSM_DIR = path.join(__dirname, '..', 'server', 'storage', 'geodata', 'osm');

function optimizeFile(filename, tolerance) {
    const filePath = path.join(OSM_DIR, filename);
    if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${filePath}`);
        return;
    }

    console.log(`Optimizing ${filename} with tolerance ${tolerance}...`);
    const raw = fs.readFileSync(filePath, 'utf8');
    let geojson = JSON.parse(raw);
    console.log(`Original size: ${Math.round(raw.length / 1024 / 1024)} MB, Features: ${geojson.features.length}`);

    const optimized = turf.simplify(geojson, { tolerance: tolerance, highQuality: false });
    const output = JSON.stringify(optimized);
    
    const outPath = path.join(OSM_DIR, filename.replace('.geojson', '_simple.geojson'));
    fs.writeFileSync(outPath, output);
    console.log(`Optimized size: ${Math.round(output.length / 1024 / 1024)} MB`);
    console.log(`Saved to ${outPath}`);
}

// Optimize existing roads and railways
optimizeFile('osm_roads_vietnam.geojson', 0.0002);
optimizeFile('osm_railways_vietnam.geojson', 0.0001);
