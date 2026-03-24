import { supabase, LOCAL_API_URL } from '../shared/supabase.js'
import * as L from 'leaflet'
window.L = L;

let map;
let currentBasemap;
let featureGroup; 
let activeLayers = new Set();
let layerSelectionOrder = []; // Track order of activation
let selectedFeatures = {}; // { layerId: [featureId1, featureId2] }
let layerMetadata = {}; 
let fetchTimeout = null;
let mapLegend = null; // Reference to the legend control

const layerColors = ['#b4fd00', '#ff4b4b', '#00aaff', '#ffa500', '#9d50bb'];

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
        const { data: { session } } = await supabase.auth.getSession();
        const authHeaders = {};
        if (session?.access_token) authHeaders['Authorization'] = `Bearer ${session.access_token}`;
        const res = await fetch(`${LOCAL_API_URL}/api/file`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', ...authHeaders },
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
  
  // Initialize Legend Control
  initLegend();

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
                itemEl.style.padding = '10px 12px';
                itemEl.style.marginBottom = '6px';
                itemEl.style.display = 'flex';
                itemEl.style.alignItems = 'center';
                itemEl.style.gap = '12px';
                itemEl.style.cursor = 'pointer';
                itemEl.style.borderRadius = '8px';
                itemEl.style.transition = 'background 0.2s';
                
                const chk = document.createElement('input');
                chk.type = 'checkbox';
                chk.checked = false;
                chk.className = 'admin-input';
                chk.style.width = '18px';
                chk.style.height = '18px';
                chk.style.margin = '0';
                chk.style.cursor = 'pointer';
                
                chk.onchange = (e) => {
                    if (e.target.checked) {
                        activeLayers.add(layer.id);
                        if (!layerSelectionOrder.includes(layer.id)) layerSelectionOrder.push(layer.id);
                    } else {
                        activeLayers.delete(layer.id);
                        layerSelectionOrder = layerSelectionOrder.filter(id => id !== layer.id);
                        delete selectedFeatures[layer.id];
                    }
                    
                    if (chk.checked) {
                        itemEl.classList.add('active');
                        const colorIdx = layerSelectionOrder.indexOf(layer.id);
                        itemEl.style.borderLeft = `4px solid ${layerColors[colorIdx % layerColors.length]}`;
                    } else {
                        itemEl.classList.remove('active');
                        itemEl.style.borderLeft = 'none';
                    }
                    
                    updateSelectionSummary();
                    updateLegend();
                    fetchFeaturesInView();
                };
                
                itemEl.onclick = (e) => {
                    if(e.target !== chk && e.target.tagName !== 'BUTTON') {
                        chk.checked = !chk.checked;
                        chk.dispatchEvent(new Event('change'));
                    }
                };
                
                const label = document.createElement('span');
                label.innerText = layer.name;
                label.style.fontSize = '12.5px';
                label.style.fontWeight = '500';
                label.style.flex = '1';
                label.style.color = '#eee';
                
                if (layer.isSmart) {
                    const badge = document.createElement('span');
                    badge.className = 'pro-badge';
                    badge.style.background = '#b4fd00';
                    badge.style.color = '#000';
                    badge.style.fontSize = '8px';
                    badge.style.padding = '1px 5px';
                    badge.style.marginLeft = '6px';
                    badge.style.borderRadius = '3px';
                    badge.style.verticalAlign = 'middle';
                    badge.textContent = 'SMART';
                    label.appendChild(badge);
                }
                
                const selAllBtn = document.createElement('button');
                selAllBtn.innerText = 'Tất cả';
                selAllBtn.style.fontSize = '10px';
                selAllBtn.style.padding = '3px 8px';
                selAllBtn.style.background = '#2a2a2a';
                selAllBtn.style.color = '#bbb';
                selAllBtn.style.border = '1px solid #444';
                selAllBtn.style.borderRadius = '4px';
                selAllBtn.style.cursor = 'pointer';
                selAllBtn.style.transition = 'all 0.2s';
                
                selAllBtn.onmouseover = () => { selAllBtn.style.background = '#444'; selAllBtn.style.color = '#fff'; };
                selAllBtn.onmouseout = () => { selAllBtn.style.background = '#2a2a2a'; selAllBtn.style.color = '#bbb'; };

                selAllBtn.onclick = (e) => {
                    e.stopPropagation();
                    if (!chk.checked) {
                        chk.checked = true;
                        chk.dispatchEvent(new Event('change'));
                    }
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
                activeLayers: Array.from(activeLayers),
                zoom: zoom
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
            
            const colorIdx = layerSelectionOrder.indexOf(feature.layerId);
            const layerColor = layerColors[colorIdx % layerColors.length] || '#b4fd00';

            return {
                color: layerColor,
                weight: isSelected ? 4 : 2,
                opacity: isSelected ? 1.0 : 0.8,
                fillOpacity: isSelected ? 0.4 : 0.2,
                fillColor: layerColor
            };
        },
        onEachFeature: (feature, layer) => {
            const name = feature.properties['name:vi'] 
                        || feature.properties['name:en'] 
                        || feature.properties.ten_xa
                        || feature.properties.ten_tinh
                        || feature.properties.name 
                        || feature.properties.NAME 
                        || feature.properties.source_layer 
                        || `Đối tượng ${feature.id || 'N/A'}`;
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
                    
                    const colorIdx = layerSelectionOrder.indexOf(feature.layerId);
                    const layerColor = layerColors[colorIdx % layerColors.length] || '#b4fd00';

                    if (!isSelected) {
                        e.target.setStyle({ color: layerColor, weight: 2, opacity: 0.8, fillOpacity: 0.2 });
                    } else {
                        e.target.setStyle({ color: layerColor, weight: 4, opacity: 1.0, fillOpacity: 0.4 });
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

function initLegend() {
    mapLegend = L.control({ position: 'bottomright' });
    mapLegend.onAdd = function() {
        const div = L.DomUtil.create('div', 'info legend');
        div.id = 'map-legend-box';
        div.style.background = 'rgba(0,0,0,0.85)';
        div.style.padding = '10px 15px';
        div.style.borderRadius = '8px';
        div.style.border = '1px solid #444';
        div.style.color = '#fff';
        div.style.fontFamily = "'Averta', sans-serif";
        div.style.fontSize = '12px';
        div.style.display = 'none'; // Hidden by default
        div.style.backdropFilter = 'blur(4px)';
        div.style.boxShadow = '0 4px 15px rgba(0,0,0,0.5)';
        return div;
    };
    mapLegend.addTo(map);
}

function updateLegend() {
    const div = document.getElementById('map-legend-box');
    if (!div) return;

    if (layerSelectionOrder.length === 0) {
        div.style.display = 'none';
        return;
    }

    div.style.display = 'block';
    div.innerHTML = `<div style="font-weight:700; color:#b4fd00; margin-bottom:8px; border-bottom:1px solid #333; padding-bottom:5px; font-size:10px; opacity:0.7;">ACTIVE LAYERS</div>`;
    
    layerSelectionOrder.forEach((layerId, idx) => {
        const layer = layerMetadata[layerId];
        const color = layerColors[idx % layerColors.length];
        const item = document.createElement('div');
        item.style.display = 'flex';
        item.style.alignItems = 'center';
        item.style.gap = '8px';
        item.style.marginBottom = '4px';
        item.innerHTML = `
            <div style="width:12px; height:2px; background:${color}; border-radius:1px; box-shadow: 0 0 5px ${color}88;"></div>
            <span style="font-size:11px; white-space:nowrap;">${layer?.name || 'Unknown'}</span>
        `;
        div.appendChild(item);
    });
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

            const colorIdx = layerSelectionOrder.indexOf(layerId);
            const layerColor = layerColors[colorIdx % layerColors.length] || '#b4fd00';
            
            const div = document.createElement('div');
            div.style.fontSize = '11px';
            div.style.padding = '8px';
            div.style.background = '#222';
            div.style.borderRadius = '4px';
            div.style.borderLeft = `3px solid ${layerColor}`;
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
        
        const { data: { session } } = await supabase.auth.getSession();
        const authHeaders = {};
        if (session?.access_token) authHeaders['Authorization'] = `Bearer ${session.access_token}`;
        const uploadRes = await fetch(`${LOCAL_API_URL}/api/upload`, { method: 'POST', body: formData, headers: authHeaders });
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
