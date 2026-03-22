import { supabase } from '../shared/supabase.js'
import * as L from 'leaflet'
window.L = L;

let map;
let currentBasemap;
let featureGroup; 
let activeLayers = new Set();
let selectedFeatures = {}; // { layerId: [featureId1, featureId2] }
let layerMetadata = {}; 
let fetchTimeout = null;

const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.hostname.match(/^192\.168\./) || window.location.hostname.match(/^10\./) || window.location.hostname.match(/^172\./);
const protocol = (window.location.protocol === 'file:') ? 'http:' : window.location.protocol;
const LOCAL_API_URL = isLocal ? `${protocol}//${window.location.hostname}:3000` : (window.location.hostname === '' ? 'http://localhost:3000' : 'https://api.vuanedit.online');
const API_BASE = `${LOCAL_API_URL}/api/geodata`;
const ADMIN_EMAILS = ['vuan.edit@gmail.com', 'vuanedit@gmail.com', 'vu.an.edit@gmail.com'];

window.adminDeleteLayer = async (id, filePath) => {
    console.log("[Admin] adminDeleteLayer clicked:", id, filePath);
    if (!confirm('Bạn có chắc chắn muốn xóa file Offline này?')) return;

    try {
        console.log("[Admin] Deleting from Supabase...");
        const { error: sbError } = await supabase.from('geodata_layers').delete().eq('id', id);
        if (sbError) throw new Error(`Supabase: ${sbError.message}`);

        console.log("[Admin] Deleting local file...");
        const res = await fetch(`${LOCAL_API_URL}/api/file`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ path: `geodata/${filePath}` })
        });
        
        if (!res.ok) {
            const errData = await res.json();
            throw new Error(`Server: ${errData.error || res.statusText}`);
        }

        console.log("[Admin] Delete success, reloading list...");
        if (typeof loadAdminGeodata === 'function') loadAdminGeodata();
        else window.location.reload();
    } catch (err) {
        console.error("[Admin] Delete Error:", err);
        alert('Xóa thất bại: ' + err.message);
    }
}

// --- AUTHENTICATION ---
async function checkAuth() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) {
    alert("Vui lòng đăng nhập từ Cửa hàng.")
    window.location.href = "/store"
    return false;
  }
  const { data: profile } = await supabase.from('profiles').select('plan_id').eq('id', user.id).maybeSingle()
  
  if (profile?.plan_id !== 'lifetime' && !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    alert("GeoExtractor chỉ dành cho tài khoản gói LIFETIME.")
    window.location.href = "/store"
    return false;
  }
  
  document.getElementById('auth-overlay').style.display = 'none'
  return true;
}

// --- MAP INITIALIZATION ---
function initMap() {
  map = L.map('map-container', { boxZoom: false }).setView([16.0, 106.0], 5);

  const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    maxZoom: 19, attribution: '© OpenStreetMap', className: 'map-tile-light'
  });
  const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
    maxZoom: 19, attribution: '© CARTO', className: 'map-tile-dark'
  });
  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19, attribution: 'Tiles &copy; Esri', className: 'map-tile-satellite'
  });
  const baseMaps = { "dark": cartoDark, "light": osmStandard, "satellite": satellite };

  currentBasemap = cartoDark;
  currentBasemap.addTo(map);

  document.querySelectorAll('.layer-card').forEach(card => {
    card.onclick = () => {
        document.querySelectorAll('.layer-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        const layerKey = card.dataset.layer;
        if (baseMaps[layerKey]) {
            map.removeLayer(currentBasemap);
            currentBasemap = baseMaps[layerKey];
            currentBasemap.addTo(map);
        }
    };
  });

  featureGroup = L.featureGroup().addTo(map);
  
  map.on('moveend', () => {
      // Debounce the spatial filter fetch
      if(fetchTimeout) clearTimeout(fetchTimeout);
      fetchTimeout = setTimeout(fetchFeaturesInView, 500);
  });
  
  setupLayerTree();
  setupDownloadBtn();
}

// --- API ACTIONS ---
async function setupLayerTree() {
    try {
        const res = await fetch(`${API_BASE}/tree`);
        const json = await res.json();
        const treeData = json.data;
        
        const container = document.getElementById('layer-tree-container');
        container.innerHTML = '';
        
        treeData.forEach(group => {
            const groupEl = document.createElement('div');
            groupEl.className = 'layer-group';
            groupEl.style.marginBottom = '10px';
            groupEl.innerHTML = `<h4 style="color:#b4fd00; margin:0 0 5px 0; font-size:12px; font-weight: 700;">${group.groupName.toUpperCase()}</h4>`;
            
            group.layers.forEach(layer => {
                layerMetadata[layer.id] = layer;
                
                const itemEl = document.createElement('div');
                itemEl.className = 'layer-item';
                itemEl.style.padding = '8px 10px';
                itemEl.style.marginBottom = '4px';
                itemEl.style.display = 'flex';
                itemEl.style.alignItems = 'center';
                itemEl.style.gap = '10px';
                itemEl.style.cursor = 'pointer';
                
                const chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.checked = false;
                chk.className = 'admin-input';
                chk.style.width = '16px';
                chk.style.height = '16px';
                chk.style.margin = '0';
                
                chk.onchange = (e) => {
                    if (e.target.checked) activeLayers.add(layer.id);
                    else {
                        activeLayers.delete(layer.id);
                        delete selectedFeatures[layer.id]; // clear selection if layer deactivated
                    }
                    if (e.target.checked) itemEl.classList.add('active');
                    else itemEl.classList.remove('active');
                    
                    updateSelectionSummary();
                    fetchFeaturesInView();
                };
                
                // Allow clicking the text to toggle checkbox
                itemEl.onclick = (e) => {
                    if(e.target !== chk) {
                        chk.checked = !chk.checked;
                        chk.dispatchEvent(new Event('change'));
                    }
                };
                
                const label = document.createElement('span');
                label.innerText = layer.name;
                label.style.fontSize = '12px';
                label.style.flex = '1';
                
                const selAllBtn = document.createElement('button');
                selAllBtn.innerText = 'Chọn tất cả';
                selAllBtn.style.fontSize = '10px';
                selAllBtn.style.padding = '2px 5px';
                selAllBtn.style.background = '#333';
                selAllBtn.style.color = '#fff';
                selAllBtn.style.border = 'none';
                selAllBtn.style.borderRadius = '3px';
                selAllBtn.style.cursor = 'pointer';
                
                selAllBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (!chk.checked) {
                        chk.checked = true;
                        chk.dispatchEvent(new Event('change'));
                    }
                    // Special flag to indicate "Download ALL from this layer"
                    selectedFeatures[layer.id] = ['__ALL__'];
                    updateSelectionSummary();
                    fetchFeaturesInView();
                }

                itemEl.appendChild(chk);
                itemEl.appendChild(label);
                itemEl.appendChild(selAllBtn);
                groupEl.appendChild(itemEl);
            });
            container.appendChild(groupEl);
        });
        
    } catch (err) {
        console.error("Lỗi lấy danh sách layer:", err);
        document.getElementById('layer-tree-container').innerHTML = `<p style="color:red; font-size:12px;">Lỗi kết nối máy chủ: ${err.message}</p>`;
    }
}

async function fetchFeaturesInView() {
    if (activeLayers.size === 0) {
        featureGroup.clearLayers();
        return;
    }
    
    // Safety limit on zoom so we don't request too much data on national scale
    const zoom = map.getZoom();
    if(zoom < 6 && activeLayers.size > 2) {
        // Prevent loading too many detailed layers at high zoom
        // But let them load if it's just country borders
    }
    
    const bounds = map.getBounds();
    const bboxStr = `${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}`;
    
    try {
        const res = await fetch(`${API_BASE}/features`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bbox: bboxStr,
                activeLayers: Array.from(activeLayers)
            })
        });
        const json = await res.json();
        renderFeatures(json.data);
    } catch (err) {
        console.error("Lỗi tải features:", err);
    }
}

function renderFeatures(featuresArray) {
    featureGroup.clearLayers();
    const fc = { type: "FeatureCollection", features: featuresArray };
    
    // Create mapping of selected to fast-check
    L.geoJSON(fc, {
        style: (feature) => {
            const isAllMode = selectedFeatures[feature.layerId] && selectedFeatures[feature.layerId].includes('__ALL__');
            const isSelected = isAllMode || (selectedFeatures[feature.layerId] && selectedFeatures[feature.layerId].includes(feature.id));
            
            return {
                color: isSelected ? '#b4fd00' : '#888',
                weight: isSelected ? 3 : 1,
                fillOpacity: isSelected ? 0.4 : 0.05,
                fillColor: isSelected ? '#b4fd00' : '#444'
            };
        },
        onEachFeature: (feature, layer) => {
            const name = feature.properties['name:vi'] || feature.properties.name || feature.properties.source_layer || `Đối tượng ${feature.id}`;
            layer.bindTooltip(`<div style="font-family:'Averta',sans-serif; font-size:12px;">${name}</div>`, { sticky: true });
            
            layer.on({
                mouseover: (e) => {
                    if (!selectedFeatures[feature.layerId] || !selectedFeatures[feature.layerId].includes(feature.id)) {
                        e.target.setStyle({ fillOpacity: 0.2, weight: 2, color: '#fff' });
                        e.target.bringToFront();
                    }
                },
                mouseout: (e) => {
                    const isAllMode = selectedFeatures[feature.layerId] && selectedFeatures[feature.layerId].includes('__ALL__');
                    const isSelected = isAllMode || (selectedFeatures[feature.layerId] && selectedFeatures[feature.layerId].includes(feature.id));
                    if (!isSelected) {
                        e.target.setStyle({ color: '#888', weight: 1, fillOpacity: 0.05, fillColor: '#444' });
                    } else {
                        e.target.setStyle({ color: '#b4fd00', weight: 3, fillOpacity: 0.4, fillColor: '#b4fd00' });
                    }
                },
                click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    toggleFeatureSelection(feature.layerId, feature.id);
                    fetchFeaturesInView(); // Rerender to apply styles
                }
            });
        }
    }).addTo(featureGroup);
}

function toggleFeatureSelection(layerId, featureId) {
    if (!selectedFeatures[layerId]) selectedFeatures[layerId] = [];
    
    const isAllMode = selectedFeatures[layerId].includes('__ALL__');
    if (isAllMode) {
        // Switch out of all mode if user clicks a specific feature
        selectedFeatures[layerId] = [featureId];
    } else {
        const idx = selectedFeatures[layerId].indexOf(featureId);
        if (idx > -1) selectedFeatures[layerId].splice(idx, 1);
        else selectedFeatures[layerId].push(featureId);
    }
    
    updateSelectionSummary();
}

function updateSelectionSummary() {
    const listEl = document.getElementById('selected-features-list');
    listEl.innerHTML = '';
    
    let totalCount = 0;
    
    for (const [layerId, featIds] of Object.entries(selectedFeatures)) {
        if (featIds.length > 0) {
            const layerName = layerMetadata[layerId]?.name || 'Unknown Layer';
            const isAll = featIds.includes('__ALL__');
            
            totalCount += isAll ? 1 : featIds.length;
            
            const div = document.createElement('div');
            div.style.fontSize = '11px';
            div.style.padding = '8px';
            div.style.background = '#222';
            div.style.borderRadius = '4px';
            div.style.borderLeft = '3px solid #b4fd00';
            div.innerText = isAll ? `${layerName} (Chọn tất cả)` : `${layerName} (${featIds.length} đối tượng)`;
            
            const removeBtn = document.createElement('span');
            removeBtn.innerText = '✕';
            removeBtn.style.float = 'right';
            removeBtn.style.cursor = 'pointer';
            removeBtn.style.color = '#ff4757';
            removeBtn.onclick = () => {
                delete selectedFeatures[layerId];
                updateSelectionSummary();
                fetchFeaturesInView();
            };
            div.appendChild(removeBtn);
            
            listEl.appendChild(div);
        }
    }
    
    if (totalCount === 0) {
        listEl.innerHTML = '<p style="color:#777; font-size:0.8rem; text-align:center; padding-top: 10px;">Chưa chọn đối tượng nào.<br><small>Click vào đối tượng trên Map để bắt đầu.</small></p>';
        document.getElementById('selection-summary').style.display = 'none';
        document.getElementById('btn-download-selected').disabled = true;
    } else {
        document.getElementById('sel-count').innerText = totalCount;
        document.getElementById('selection-summary').style.display = 'block';
        document.getElementById('btn-download-selected').disabled = false;
    }
}

function setupDownloadBtn() {
    document.getElementById('btn-download-selected').onclick = async () => {
        let totalCount = 0;
        const selectedLayersParam = [];
        
        for (const [layerId, featIds] of Object.entries(selectedFeatures)) {
            if (featIds.length > 0) {
                totalCount++;
                const mode = featIds.includes('__ALL__') ? 'all' : 'custom';
                selectedLayersParam.push({ id: layerId, mode: mode });
            }
        }
        
        if (totalCount === 0) return alert("Vui lòng chọn dữ liệu cần tải");
        
        const format = document.getElementById('download-format').value;
        const btn = document.getElementById('btn-download-selected');
        btn.innerText = "Đang tải dữ liệu...";
        btn.disabled = true;
        
        try {
            const res = await fetch(`${API_BASE}/download`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    selectedLayers: selectedLayersParam,
                    selectedFeatures: selectedFeatures,
                    format: format
                })
            });
            
            if (!res.ok) throw new Error("Load failed");
            
            const blob = await res.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const ext = format === 'kml' ? 'kml' : 'geojson';
            a.download = `VuanEdit_Geodata_Export.${ext}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            
        } catch (err) {
            alert("Lỗi tải xuống: " + err.message);
        } finally {
            btn.innerText = "Tải dữ liệu đã chọn";
            btn.disabled = false;
        }
    };
}

// --- ADMIN LOGIC ---
async function initAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        const btn = document.getElementById('admin-toggle-btn');
        const modal = document.getElementById('admin-modal');
        if (btn) {
            btn.style.display = 'block';
            btn.removeAttribute('onclick'); 
            btn.onclick = () => {
                modal.style.display = 'flex';
                loadAdminGeodata();
            };
            
            document.getElementById('btn-close-admin').onclick = () => modal.style.display = 'none';
            document.getElementById('admin-geodata-form').onsubmit = async (e) => {
                e.preventDefault();
                await handleAdminGeodataUpload();
            };
        }
    }
}

async function loadAdminGeodata() {
    // Keep identical functionality for Admin UI using fetch and supabase
    const listEl = document.getElementById('admin-geodata-list');
    listEl.innerHTML = '<p style="color: #666; font-size: 0.85rem;">Đang tải dữ liệu...</p>';
    
    try {
        const { data: layers, error } = await supabase.from('geodata_layers').select('*').order('zoom_min', { ascending: true });
        if (error) throw error;
        
        if (!layers || layers.length === 0) {
            listEl.innerHTML = '<p style="color: #666; font-size: 0.85rem;">Trống.</p>';
            return;
        }
        
        listEl.innerHTML = layers.map(layer => `
            <div style="background: #222; padding: 10px; border-radius: 4px; display: flex; justify-content: space-between; align-items: center; border: 1px solid #333;">
                <div>
                    <div style="font-weight: 700; color: #b4fd00; font-size: 0.9rem;">${layer.name}</div>
                    <div style="font-size: 0.75rem; color: #aaa;">Zoom: ${layer.zoom_min} | Path: ${layer.file_path}</div>
                </div>
                <button class="geo-btn" 
                        onclick='window.adminDeleteLayer("${layer.id}", "${layer.file_path}")' 
                        style="background: #e74c3c; border-color: #e74c3c; color: #fff; padding: 4px 8px; font-size: 0.75rem; min-width: 80px;">
                    Xóa
                </button>
            </div>
        `).join('');
        
    } catch (err) {
        listEl.innerHTML = `<p style="color: #e74c3c; font-size: 0.85rem;">Lỗi: ${err.message}</p>`;
    }
}

async function handleAdminGeodataUpload() {
    const btn = document.getElementById('btn-submit-geodata');
    const name = document.getElementById('admin-geodata-name').value;
    const levelStr = document.getElementById('admin-geodata-level').value; // "provinces,4"
    const fileInput = document.getElementById('admin-geodata-file');
    
    if (fileInput.files.length === 0) return alert('Vui lòng chọn file');
    btn.innerText = 'Đang tải...';
    btn.disabled = true;
    
    try {
        const [folder, zoom] = levelStr.split(',');
        const file = fileInput.files[0];
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', `geodata/${folder}`); 
        
        const uploadRes = await fetch(`${LOCAL_API_URL}/api/upload`, { method: 'POST', body: formData });
        if (!uploadRes.ok) throw new Error('Upload server cục bộ thất bại');
        const uploadData = await uploadRes.json();
        const uploadedFilename = uploadData.filename; 
        
        const relativePath = `${folder}/${uploadedFilename}`;
        
        const { error } = await supabase.from('geodata_layers').insert([{
            name: name,
            category: 'offline_extracted',
            zoom_min: parseInt(zoom),
            file_path: relativePath
        }]);
        
        if (error) throw error;
        
        alert('Đã tã tải lên thành công. Khởi động lại Server để nhận layer mới.');
        document.getElementById('admin-geodata-form').reset();
        loadAdminGeodata();
        
    } catch (err) {
        alert('Lỗi tải lên: ' + err.message);
    } finally {
        btn.innerText = 'Tải Lên';
        btn.disabled = false;
    }
}

window.onload = async () => {
  try {
      if (await checkAuth()) {
          initMap();
          initAdmin();
      }
  } catch (err) {
      console.error("Lỗi khởi tạo bản đồ:", err);
  }
}
