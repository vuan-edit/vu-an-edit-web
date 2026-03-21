import { supabase, getLocalFileUrl } from '../shared/supabase.js'
import * as L from 'leaflet'
import tokml from 'tokml'
import osmtogeojson from 'osmtogeojson'
import * as turf from '@turf/turf'
import JSZip from 'jszip'

let map;
let currentLayerGroup;
let selectedGeoJSONData = null; // This will now store the FeatureCollection of the currently selected GROUP
let currentProfile = null;
let clickTimeout = null;
let isMoving = false;

// --- AUTHENTICATION ---
async function checkAuth() {
  const { data: { user }, error } = await supabase.auth.getUser()
  if (!user || error) {
    alert("Vui lòng đăng nhập từ Cửa hàng.")
    window.location.href = "/store"
    return false;
  }
  const { data: profile } = await supabase.from('profiles').select('plan_id').eq('id', user.id).maybeSingle()
  
  currentProfile = profile || {};
  currentProfile.email = user.email;
  
  if (currentProfile.plan_id !== 'lifetime' && user.email !== 'vuan.edit@gmail.com') {
    alert("GeoExtractor chỉ dành cho tài khoản gói LIFETIME.")
    window.location.href = "/store"
    return false;
  }
  
  document.getElementById('auth-overlay').style.display = 'none'
  return true;
}

// --- MAP INITIALIZATION ---
function initMap() {
  map = L.map('map-container', {
    boxZoom: false // DISABLING THE BLUE ZOOM BOX FEATURE
  }).setView([21.0285, 105.8542], 12);

  // Base Maps with Filters
  const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    maxZoom: 19, 
    attribution: '© OpenStreetMap',
    className: 'map-tile-light'
  });
  
  const cartoDark = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', { 
    maxZoom: 19, 
    attribution: '© CARTO',
    className: 'map-tile-dark'
  });
  
  const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri',
    className: 'map-tile-satellite'
  });
  
  const baseMaps = {
    "dark": cartoDark,
    "light": osmStandard,
    "satellite": satellite
  };

  // Đặt bản đồ tối làm mặc định như yêu cầu
  let currentBasemap = cartoDark;
  currentBasemap.addTo(map);

  // Custom Layer Control Logic
  document.querySelectorAll('.layer-card').forEach(card => {
    card.onclick = () => {
        // Remove active class from all
        document.querySelectorAll('.layer-card').forEach(c => c.classList.remove('active'));
        // Add active class to clicked
        card.classList.add('active');
        
        // Switch map
        const layerKey = card.dataset.layer;
        if (baseMaps[layerKey]) {
            map.removeLayer(currentBasemap);
            currentBasemap = baseMaps[layerKey];
            currentBasemap.addTo(map);
        }
    };
  });
  
  // Custom Zoom Indicator with Data Hints
  const ZoomViewer = L.Control.extend({
    onAdd: function() {
      const container = L.DomUtil.create('div', 'zoom-indicator');
      container.style.padding = '8px 12px';
      container.style.background = 'rgba(0,0,0,0.9)';
      container.style.color = '#b4fd00';
      container.style.border = '1.5px solid #b4fd00';
      container.style.borderRadius = '6px';
      container.style.fontFamily = 'monospace';
      container.style.fontSize = '12px';
      container.style.fontWeight = 'bold';
      container.style.boxShadow = '0 0 10px rgba(180, 253, 0, 0.3)';
      container.style.transition = 'all 0.3s';
      
      const updateHint = () => {
        const zoom = map.getZoom();
        let hint = "";
        let color = "#b4fd00";
        
        if (zoom >= 16) {
            hint = "TÒA NHÀ & ĐƯỜNG XÁ";
            color = "#ff4757"; // Red highlight
        } else if (zoom >= 14) {
            hint = "PHƯỜNG / XÃ";
            color = "#ffa502";
        } else if (zoom >= 12) {
            hint = "QUẬN / HUYỆN";
            color = "#70a1ff";
        } else if (zoom >= 9) {
            hint = "TỈNH / THÀNH PHỐ";
            color = "#2ed573";
        } else {
            hint = "QUỐC GIA & THẾ GIỚI";
            color = "#9b59b6";
        }
        
        container.style.borderColor = color;
        container.style.color = color;
        container.innerHTML = `ZOOM: ${zoom}<br><small style="font-size: 10px;">LẤY: ${hint}</small>`;
      };
      
      map.on('zoomend', updateHint);
      updateHint();
      return container;
    }
  });
  new ZoomViewer({ position: 'topleft' }).addTo(map);
  
  currentLayerGroup = L.layerGroup().addTo(map);
  
  // Advanced Click Protection Logic
  map.on('movestart', () => { isMoving = true; });
  map.on('moveend', () => { setTimeout(() => { isMoving = false; }, 100); });
  
  map.on('click', (e) => {
      // Clear any pending clicks
      if (clickTimeout) clearTimeout(clickTimeout);
      
      // Delay to ensure it's a deliberate single click and not a drag/double click
      clickTimeout = setTimeout(() => {
          if (!isMoving) {
              onMapClick(e);
          }
          clickTimeout = null;
      }, 400); // 400ms delay for natural human single click recognition
  });
  
  setupSearch();
  setupUIEvents();
}

function setupUIEvents() {
    // QnA Modal
    const modal = document.getElementById('qna-modal');
    document.getElementById('btn-open-qna').onclick = () => modal.style.display = 'flex';
    document.getElementById('btn-close-qna').onclick = () => modal.style.display = 'none';
    window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };

    // Download Buttons
    document.getElementById('btn-download-geojson').onclick = () => downloadSelected('geojson');
    document.getElementById('btn-download-kml').onclick = () => downloadSelected('kml');
    document.getElementById('btn-download-zip').onclick = downloadZip;
    document.getElementById('btn-merge-zones').onclick = downloadMerged;
}

function setupSearch() {
  const searchBtn = document.getElementById('btn-search-location');
  const searchInput = document.getElementById('location-search-input');
  
  const performSearch = async () => {
    const q = searchInput.value.trim();
    if (!q) return;
    
    searchBtn.innerText = "Đang tìm...";
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5&accept-language=vi&polygon_geojson=1`);
      const data = await res.json();
      const resultsContainer = document.getElementById('search-results');
      resultsContainer.innerHTML = '';
      
      if (data.length === 0) {
        resultsContainer.innerHTML = '<span style="color:#ff4757">Không tìm thấy địa điểm.</span>';
      } else {
        data.forEach(item => {
          const div = document.createElement('div');
          div.className = 'layer-item';
          div.style.padding = '8px';
          div.innerText = item.display_name;
          div.onclick = () => {
             map.flyTo([item.lat, item.lon], 12);
             if (item.geojson) {
               const feature = {
                 type: "Feature",
                 properties: {
                   name: item.name || item.display_name,
                   "name:vi": item.name || item.display_name
                 },
                 geometry: item.geojson
               };
               const fc = { type: "FeatureCollection", features: [feature] };
               resultsContainer.innerHTML = '';
               searchInput.value = '';
               renderLayerToMap(fc, "Kết quả search: " + (item.name || "Địa điểm"), null);
             } else {
               alert("Địa điểm này không có đường bao địa lý.");
             }
          };
          resultsContainer.appendChild(div);
        });
      }
    } catch (e) {
      alert("Lỗi tìm kiếm");
    } finally {
      searchBtn.innerText = "Tìm kiếm";
    }
  };
  
  searchBtn.onclick = performSearch;
  searchInput.onkeypress = (e) => { if (e.key === "Enter") performSearch(); };
}

// --- OFFLINE DATA EXTRACTOR (Pure Supabase Storage) ---
const offlineLayerCache = {};

async function onMapClick(e) {
  const lat = e.latlng.lat;
  const lng = e.latlng.lng;
  const zoom = map.getZoom();
  
  const listEl = document.getElementById('extracted-list');
  listEl.innerHTML = '<p style="color:#fff; font-size:0.8rem; text-align:center;">Đang mở kho dữ liệu Offline...</p>';
  document.getElementById('download-section').style.display = 'none';

  let supabaseResults = [];
  try {
      // Find layers where their assigned zoom is less than or equal to current zoom
      const { data: layers } = await supabase
          .from('geodata_layers')
          .select('*')
          .lte('zoom_min', zoom);
          
      if (layers && layers.length > 0) {
          const pt = turf.point([lng, lat]);
          
          for (const layer of layers) {
              let geojson = offlineLayerCache[layer.file_path];
              
              if (!geojson) {
                  const signedUrl = getLocalFileUrl(layer.file_path, 'geodata');
                  const res = await fetch(signedUrl);
                  geojson = await res.json();
                  
                  // Auto-convert standard Overpass OSM JSON format into GeoJSON locally
                  if (!geojson.features && geojson.elements) {
                      try {
                          geojson = osmtogeojson(geojson);
                      } catch (e) {
                          console.warn("OSM JSON parser failed:", e);
                      }
                  }
                  
                  offlineLayerCache[layer.file_path] = geojson;
              }
              
              // Find matching feature in the offline file
              if (geojson && geojson.features) {
                  geojson.features.forEach(f => {
                      try {
                          // Handle MultiPolygon and Polygon
                          if (f.geometry && ['Polygon', 'MultiPolygon'].includes(f.geometry.type)) {
                              if (turf.booleanPointInPolygon(pt, f)) {
                                  // Clone property to avoid polluting cache
                                  const featureClone = JSON.parse(JSON.stringify(f));
                                  featureClone.properties.is_offline_db = true;
                                  featureClone.properties.source_layer = layer.name;
                                  
                                  // Auto-detect admin level from layer's zoom if not present
                                  if (!featureClone.properties.admin_level) {
                                      featureClone.properties.admin_level = layer.zoom_min.toString();
                                  }
                                  
                                  supabaseResults.push(featureClone);
                              }
                          }
                      } catch (e) {} // Ignore turf errors on bad geometries
                  });
              }
          }
      }
  } catch (err) {
      console.warn("Trích xuất file Offline thất bại:", err);
  }

  if (supabaseResults.length === 0) {
      listEl.innerHTML = '<p style="color:red; font-size:0.8rem; text-align:center;">Không tìm thấy dữ liệu vùng này trong Kho Offline. Thử click lại hoặc Zoom khác.</p>';
      return;
  }

  renderGeoJSONResults({ type: "FeatureCollection", features: supabaseResults });
}

function renderGeoJSONResults(geojson) {
  if (!geojson.features || geojson.features.length === 0) {
    document.getElementById('extracted-list').innerHTML = '<p style="color:#777; font-size:0.8rem; text-align:center;">Trống.</p>'
    return;
  }
  
  const grouped = {
    premium: { features: [], label: "DỮ LIỆU OFFLINE" },
    countries: { features: [], label: "QUỐC GIA / THẾ GIỚI" },
    provinces: { features: [], label: "TỈNH / THÀNH PHỐ" },
    districts: { features: [], label: "QUẬN / HUYỆN" },
    wards: { features: [], label: "PHƯỜNG / XÃ" },
    buildings: { features: [], label: "NHÀ / TÒA NHÀ" },
    roads: { features: [], label: "ĐƯỜNG GIAO THÔNG" }
  };
  
  let hasFound = false;
  geojson.features.forEach(f => {
    const p = f.properties;
    if (p.is_offline_db || p.is_premium) grouped.premium.features.push(f);
    else {
        const level = parseInt(p.admin_level);
        if (level === 2 || p.place === 'country') grouped.countries.features.push(f);
        else if (level === 4 || p.place === 'state' || p.boundary === 'administrative' && level <= 5) grouped.provinces.features.push(f);
        else if ([6,7].includes(level)) grouped.districts.features.push(f);
        else if ([8,9,10,11].includes(level)) grouped.wards.features.push(f);
        else if (p.building) grouped.buildings.features.push(f);
        else if (p.highway) grouped.roads.features.push(f);
    }
  });
  
  const listEl = document.getElementById('extracted-list');
  listEl.innerHTML = '';
  let count = 0;
  let firstDisplayedItem = null;

  Object.keys(grouped).forEach(key => {
    const group = grouped[key];
    if (group.features.length > 0) {
      count++;
      hasFound = true;
      group.features = group.features.slice(0, 20);
      
      const item = document.createElement('div');
      item.className = 'layer-item';
      item.innerHTML = `<h4>${group.label}</h4><p>${group.features.length} đối tượng</p>`;
      item.onclick = () => renderLayerToMap({ type: "FeatureCollection", features: group.features }, group.label, item);
      listEl.appendChild(item);
      
      if (!firstDisplayedItem) firstDisplayedItem = { fc: { type: "FeatureCollection", features: group.features }, label: group.label, el: item };
    }
  });

  if (firstDisplayedItem) {
      renderLayerToMap(firstDisplayedItem.fc, firstDisplayedItem.label, firstDisplayedItem.el);
  }
  
  if (!hasFound) listEl.innerHTML = '<p style="color:#777; font-size:0.8rem; text-align:center;">Trống. Hãy Zoom sâu hơn hoặc click vùng khác.</p>';
}

function renderLayerToMap(fc, label, itemEl) {
  document.querySelectorAll('.layer-item').forEach(el => el.classList.remove('active'));
  if (itemEl) itemEl.classList.add('active');
  
  document.getElementById('download-section').style.display = 'block';
  document.getElementById('selected-layer-name').innerText = label;
  
  selectedGeoJSONData = fc;
  
  // Populate Checkboxes
  const container = document.getElementById('object-checklist-container');
  container.innerHTML = '';
  
  fc.features.forEach((f, i) => {
    const name = f.properties['name:vi'] || f.properties['NAME_VI'] || f.properties.name || f.properties.NAME || `Đối tượng ${i+1}`;
    const div = document.createElement('div');
    div.className = 'object-item';
    div.innerHTML = `<input type="checkbox" class="obj-chk" data-idx="${i}" checked> <span>${name}</span>`;
    container.appendChild(div);
    
    // Preview on checkbox change
    div.querySelector('input').onchange = updateMapPreview;
  });

  // Show/Hide specific buttons
  const isMulti = fc.features.length > 1;
  document.getElementById('btn-merge-zones').style.display = isMulti ? 'block' : 'none';
  document.getElementById('btn-download-zip').style.display = isMulti ? 'block' : 'none';

  updateMapPreview();
}

function updateMapPreview() {
    const checkedIdxs = Array.from(document.querySelectorAll('.obj-chk:checked')).map(el => parseInt(el.dataset.idx));
    const features = checkedIdxs.map(idx => selectedGeoJSONData.features[idx]);
    const previewFC = { type: "FeatureCollection", features: selectedGeoJSONData.features };
    
    currentLayerGroup.clearLayers();
    
    const LGeo = L.geoJSON(previewFC, {
        style: (feature) => {
            const idx = selectedGeoJSONData.features.indexOf(feature);
            const isSelected = checkedIdxs.includes(idx);
            return {
                color: isSelected ? '#b4fd00' : '#444', // Less green, more subtle border for non-selected
                weight: isSelected ? 2.5 : 0.8,
                fillOpacity: isSelected ? 0.25 : 0.03, // Very low opacity for non-selected
                fillColor: isSelected ? '#b4fd00' : '#000'
            };
        },
        onEachFeature: (feature, layer) => {
            const idx = selectedGeoJSONData.features.indexOf(feature);
            const name = feature.properties['name:vi'] || feature.properties.name || `Đối tượng ${idx+1}`;
            
            layer.on({
                mouseover: (e) => {
                    const l = e.target;
                    l.setStyle({ fillOpacity: 0.4, weight: 3 });
                    l.bringToFront();
                    
                    // Floating Tooltip - Black/White Premium + Averta Font
                    const tooltip = L.tooltip({
                        sticky: true,
                        direction: 'top',
                        className: 'geo-tooltip',
                        permanent: false,
                        offset: [0, -10]
                    }).setContent(`<div style="background:rgba(0,0,0,1); color:#fff; padding:8px 16px; border-radius:4px; font-weight:500; font-size:13px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 20px rgba(0,0,0,0.8); font-family: 'Averta', sans-serif; letter-spacing: 0.2px;">${name}</div>`);
                    l.bindTooltip(tooltip).openTooltip();
                },
                mouseout: (e) => {
                    LGeo.resetStyle(e.target);
                    // Keep selected ones emphasized
                    const isSelected = Array.from(document.querySelectorAll('.obj-chk:checked'))
                        .some(el => parseInt(el.dataset.idx) === idx);
                    if (isSelected) e.target.setStyle({ weight: 3, fillOpacity: 0.3 });
                },
                click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
                    const isExclusive = isMac ? e.originalEvent.metaKey : e.originalEvent.ctrlKey;
                    
                    if (isExclusive) {
                        // EXCLUSIVE SELECT: Deselect all, select ONLY this
                        document.querySelectorAll('.obj-chk').forEach(chk => {
                            chk.checked = (parseInt(chk.dataset.idx) === idx);
                        });
                        updateMapPreview();
                    } else if (e.originalEvent.shiftKey) {
                        // TOGGLE SELECT
                        const chk = document.querySelector(`.obj-chk[data-idx="${idx}"]`);
                        if (chk) {
                            chk.checked = !chk.checked;
                            updateMapPreview();
                        }
                    }
                }
            });
        }
    }).addTo(currentLayerGroup);
    
    if (LGeo.getBounds().isValid()) {
        const checkedCount = checkedIdxs.length;
        if (window._lastLabel !== document.getElementById('selected-layer-name').innerText) {
            // Disable the default blue zoom box by not using things that might trigger it
            map.fitBounds(LGeo.getBounds(), { padding: [20, 20] });
            window._lastLabel = document.getElementById('selected-layer-name').innerText;
        }
    }
}

// --- LOGIC XỬ LÝ DỮ LIỆU ---

function getProcessedFeatures() {
    const checkedIdxs = Array.from(document.querySelectorAll('.obj-chk:checked')).map(el => parseInt(el.dataset.idx));
    return checkedIdxs.map(idx => JSON.parse(JSON.stringify(selectedGeoJSONData.features[idx])));
}

async function downloadSelected(format) {
    const features = getProcessedFeatures();
    if (features.length === 0) return alert("Hành chọn ít nhất 1 đối tượng.");
    
    const fc = { type: "FeatureCollection", features };
    const name = document.getElementById('selected-layer-name').innerText;
    
    if (format === 'geojson') {
        const blob = new Blob([JSON.stringify(fc)], { type: "application/geo+json" });
        triggerDownload(blob, `${name}.geojson`);
    } else {
        try {
            const kml = tokml(fc);
            const blob = new Blob([kml], { type: "application/vnd.google-earth.kml+xml" });
            triggerDownload(blob, `${name}.kml`);
        } catch(e) { alert("Lỗi KML."); }
    }
}

async function downloadZip() {
    const features = getProcessedFeatures();
    if (features.length < 2) return alert("Thêm ít nhất 2 đối tượng để tạo ZIP.");
    
    const zip = new JSZip();
    features.forEach((f, i) => {
        const name = (f.properties['name:vi'] || f.properties.name || `Object_${i+1}`).replace(/[/\\?%*:|"<>]/g, '-');
        zip.file(`${name}.geojson`, JSON.stringify(f));
    });
    
    const blob = await zip.generateAsync({ type: "blob" });
    triggerDownload(blob, "GeoExtractor_Collection.zip");
}

async function downloadMerged() {
    const features = getProcessedFeatures();
    if (features.length < 2) return alert("Cần ít nhất 2 đối tượng để gộp.");
    
    try {
        let unionPoly = null;
        features.forEach(f => {
            if (!unionPoly) unionPoly = f;
            else {
                // Turf union only works on Polygons/MultiPolygons
                if (f.geometry.type.includes('Polygon')) {
                    unionPoly = turf.union(turf.featureCollection([unionPoly, f]));
                }
            }
        });

        if (unionPoly) {
            unionPoly.properties = { name: "Merged Zone", description: "Created via GeoExtractor" };
            const blob = new Blob([JSON.stringify(unionPoly)], { type: "application/geo+json" });
            triggerDownload(blob, "Merged_Zone.geojson");
        }
    } catch(e) {
        alert("Không thể gộp các đối tượng này (Có thể do định dạng không phải Polygon).");
    }
}

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Chrome fix: Longer delay and cleanup
  setTimeout(() => {
    URL.revokeObjectURL(url);
    a.remove();
  }, 3000);
}

// INIT
window.onload = async () => {
  try {
      if (await checkAuth()) {
          initMap();
          initSearch();
      }
  } catch (err) {
      console.error("Lỗi khởi tạo bản đồ:", err);
  }
  
  try {
      initAdmin(); // New Admin Logic
  } catch (err) {
      console.error("Lỗi khởi tạo Admin UI:", err);
  }
}

// --- ADMIN LOGIC ---
const ADMIN_EMAILS = ['vuan.edit@gmail.com', 'vuanedit@gmail.com', 'vu.an.edit@gmail.com'];

async function initAdmin() {
    const { data: { user } } = await supabase.auth.getUser();
    if (user && user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
        const btn = document.getElementById('admin-toggle-btn');
        if (btn) {
            btn.style.display = 'block';
        }
    }
}
