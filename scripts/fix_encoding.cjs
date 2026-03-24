const fs = require('fs');
const path = require('path');

const storageGeodata = path.join(__dirname, '../server/storage/geodata');
const targetDirs = ['countries', 'provinces', 'infrastructure'];

function fixEncoding(str) {
    if (typeof str !== 'string' || !str) return str;
    try {
        // Strip trailing null bytes
        let cleanStr = str.replace(/\0/g, '');
        // Check if string contains typical mangled UTF-8 characters
        if (/[ÃÂ]/.test(cleanStr) || cleanStr.includes('áº') || cleanStr.includes('Æ')) {
             return Buffer.from(cleanStr, 'latin1').toString('utf8');
        }
        return cleanStr;
    } catch(e) {
        return str;
    }
}

let totalFixed = 0;

for (const dir of targetDirs) {
    const dirPath = path.join(storageGeodata, dir);
    if (!fs.existsSync(dirPath)) continue;

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.geojson'));
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        console.log(`Processing ${file}...`);
        
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let fileModified = false;
        
        data.features.forEach(f => {
            if (f.properties) {
                for (const key in f.properties) {
                    if (typeof f.properties[key] === 'string') {
                        const original = f.properties[key];
                        const fixed = fixEncoding(original);
                        if (original !== fixed && original.length > 0) {
                            f.properties[key] = fixed;
                            fileModified = true;
                            totalFixed++;
                        }
                    }
                }
            }
        });
        
        if (fileModified) {
            fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
            console.log(`-> Fixed encoding in ${file}`);
        } else {
            console.log(`-> OK ${file}`);
        }
    }
}

console.log(`Done. Fixed ${totalFixed} string properties across geojson files.`);
