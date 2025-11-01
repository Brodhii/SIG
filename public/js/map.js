<<<<<<< HEAD
// === map.js ===
=======
// === map.js - FULLY GENERIC dengan fix bugs ===
>>>>>>> ead4742 (ubah tampilan)

var map = L.map('gis-map').setView([1.183, 104.537], 15);

// === BASEMAP ===
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

<<<<<<< HEAD
// === STATE ===
let showMangrove = true;
let showHabitat = true;
let showTangkapan = true;
let selectedMangrove = new Set();
let selectedHabitat = new Set();

// === WARNA ===
const mangroveColors = {
  "Vegetasi Padat": "#0A400C",
  "Vegetasi Sedang": "#08CB00",
  "Vegetasi Jarang": "#FFD700"
};
const habitatColors = {
  "Karang Mati dengan Alga": "#FFF287",
  "Lamun": "#32CD32",
  "Pasir": "#D3D3D3",
  "Pasir dengan Karang Hidup": "#0046FF"
};
const tangkapanColor = "#E63946"; 

// === STYLE ===
function styleMangrove(f) {
  const kategori = f.properties?.Kategori || "";
  const match = selectedMangrove.size === 0 || selectedMangrove.has(kategori);
  const color = mangroveColors[kategori] || "#CCCCCC";
  return {
    color: "#333",
    weight: 0.4,
    fillColor: color,
    fillOpacity: showMangrove && match ? 0.7 : 0,
    opacity: showMangrove && match ? 1 : 0
  };
}
function styleHabitat(f) {
  const kelas = f.properties?.Kelas || "";
  const match = selectedHabitat.size === 0 || selectedHabitat.has(kelas);
  const color = habitatColors[kelas] || "#CCCCCC";
  return {
    color: "#333",
    weight: 0.4,
    fillColor: color,
    fillOpacity: showHabitat && match ? 0.7 : 0,
    opacity: showHabitat && match ? 1 : 0
  };
}
function styleTangkapan(f) {
  return {
    color: tangkapanColor,
    weight: 1,
    fillColor: tangkapanColor,
    fillOpacity: showTangkapan ? 0.8 : 0,
    radius: 5
  };
}

// === LAYER ===
const mangroveLayer = L.geoJSON(null, {
  style: styleMangrove,
  onEachFeature: (f, l) => l.bindPopup(`${f.properties.Kategori}`)
});
const habitatLayer = L.geoJSON(null, {
  style: styleHabitat,
  onEachFeature: (f, l) => l.bindPopup(`${f.properties.Kelas}`)
});
const tangkapanLayer = L.geoJSON(null, {
  pointToLayer: (f, latlng) => L.circleMarker(latlng, styleTangkapan(f)),
  onEachFeature: (f, l) => {
    const p = f.properties;
    const popup = `
      <b>Alat Tangkap:</b> ${p.Alat_Tangk || "-"}<br>
      <b>Jenis Tangkapan:</b> ${p.Jenis_Tang || "-"}<br>
      <b>Jumlah Tangkapan:</b> ${p.Jumlah_Tan || "-"} kg <br>
    `;
    l.bindPopup(popup);
=======
// === COLOR GENERATOR ===
function stringToColor(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
>>>>>>> ead4742 (ubah tampilan)
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return '#' + '00000'.substring(0, 6 - c.length) + c;
}

const colorPalettes = [
  '#E63946', '#F77F00', '#FCBF49', '#06D6A0', '#118AB2',
  '#073B4C', '#8B5CF6', '#EC4899', '#10B981', '#F59E0B',
  '#0A400C', '#08CB00', '#FFD700', '#32CD32', '#0046FF',
  '#FFF287', '#D3D3D3', '#87CEEB', '#F4A460', '#FFB6C1'
];

// === STATE untuk semua layer ===
const layersState = {};

// === SANITIZE ID untuk DOM element ===
function sanitizeId(str) {
  return str.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
}

// === DETECT GEOMETRY TYPE ===
function detectGeometryType(geojson) {
  if (!geojson.features || geojson.features.length === 0) return 'polygon';
  const firstType = geojson.features[0].geometry.type;
  // Point atau MultiPoint = point, sisanya polygon
  return (firstType === 'Point' || firstType === 'MultiPoint') ? 'point' : 'polygon';
}

// === DETECT PROPERTY KEY untuk filter ===
function detectPropertyKey(geojson) {
  if (!geojson.features || geojson.features.length === 0) return null;
  
  // Cek beberapa feature untuk memastikan
  for (let i = 0; i < Math.min(3, geojson.features.length); i++) {
    const props = geojson.features[i].properties;
    if (!props) continue;
    
    // Priority keys
    const priorityKeys = ['Kategori', 'Kelas', 'kategori', 'kelas', 'Name', 'nama', 'type', 'jenis', 'Type'];
    for (const key of priorityKeys) {
      if (props[key] !== undefined && props[key] !== null) {
        return key;
      }
    }
  }
  
  // Fallback: ambil property pertama yang bukan metadata
  const props = geojson.features[0].properties;
  if (props) {
    const keys = Object.keys(props).filter(k => {
      const lower = k.toLowerCase();
      return !lower.includes('id') && 
             !lower.includes('coord') &&
             !lower.includes('lat') &&
             !lower.includes('lon') &&
             !lower.includes('shape_') &&
             !lower.includes('objectid');
    });
    return keys[0] || null;
  }
  return null;
}

// === BUILD COLOR MAP ===
function buildColorMap(geojson, propertyKey) {
  const colorMap = {};
  if (!propertyKey) return colorMap;
  
  const uniqueValues = new Set();
  geojson.features.forEach(f => {
    const val = f.properties?.[propertyKey];
    if (val !== undefined && val !== null && val !== "") {
      uniqueValues.add(val);
    }
  });
  
  Array.from(uniqueValues).forEach((val, idx) => {
    colorMap[val] = colorPalettes[idx % colorPalettes.length];
  });
  
  return colorMap;
}

// === UNIVERSAL STYLE FUNCTION ===
function getStyle(layerKey, feature) {
  const state = layersState[layerKey];
  if (!state) return {};
  
  if (state.geometryType === 'point') {
    return {
      color: state.defaultColor || '#E63946',
      weight: 1,
      fillColor: state.defaultColor || '#E63946',
      fillOpacity: state.visible ? 0.8 : 0,
      radius: 5
    };
  }
  
  const propValue = feature.properties?.[state.propertyKey] || "";
  const match = state.selected.size === 0 || state.selected.has(propValue);
  const color = state.colorMap[propValue] || stringToColor(propValue);
  
  return {
    color: "#333",
    weight: 0.4,
    fillColor: color,
    fillOpacity: state.visible && match ? 0.7 : 0,
    opacity: state.visible && match ? 1 : 0
  };
}

// === UNIVERSAL POPUP BUILDER ===
function buildPopup(properties, propertyKey) {
  if (!properties) return "No data";
  
  if (propertyKey && properties[propertyKey]) {
    return `<b>${properties[propertyKey]}</b>`;
  }
  
  return Object.entries(properties)
    .filter(([k, v]) => {
      const lower = k.toLowerCase();
      return v && 
             !lower.includes('objectid') && 
             !lower.includes('shape_') &&
             !lower.includes('gridcode');
    })
    .map(([k, v]) => `<b>${k}:</b> ${v}`)
    .join('<br>');
}

// === UNIVERSAL LAYER CREATOR ===
function createLayer(layerKey) {
  const state = layersState[layerKey];
  
  const options = {
    style: (f) => getStyle(layerKey, f),
    onEachFeature: (f, l) => {
      l.bindPopup(buildPopup(f.properties, state.propertyKey));
    }
  };
  
  if (state.geometryType === 'point') {
    options.pointToLayer = (f, latlng) => 
      L.circleMarker(latlng, getStyle(layerKey, f));
  }
  
  return L.geoJSON(null, options);
}

// === LOAD & PROCESS GEOJSON ===
fetch(API_URL)
  .then(r => r.json())
  .then(async data => {
    if (!Array.isArray(data)) {
      console.error("Data bukan array:", data);
      return;
    }
    
    console.log("Loading layers:", data.length);
    
    for (let i = 0; i < data.length; i++) {
      const layerData = data[i];
      const layerName = layerData.nama_layer || `layer_${i}`;
      const layerKey = sanitizeId(layerName);
      const geo = layerData.geojson;
      
      if (!geo || !geo.features || geo.features.length === 0) {
        console.warn(`Layer ${layerName} kosong atau invalid`);
        continue;
      }
      
      console.log(`Processing: ${layerName} (${geo.features.length} features)`);
      
      const geometryType = detectGeometryType(geo);
      const propertyKey = detectPropertyKey(geo);
      const colorMap = buildColorMap(geo, propertyKey);
      const defaultColor = colorPalettes[i % colorPalettes.length];
      
      console.log(`  - Type: ${geometryType}, Property: ${propertyKey}, Colors:`, Object.keys(colorMap));
      
      layersState[layerKey] = {
        name: layerName,
        visible: true,
        selected: new Set(),
        geometryType,
        propertyKey,
        colorMap,
        defaultColor,
        layer: null
      };
      
      layersState[layerKey].layer = createLayer(layerKey);
      layersState[layerKey].layer.addData(geo);
      map.addLayer(layersState[layerKey].layer);
      
      await new Promise(requestAnimationFrame);
    }
    
    // Fit bounds
    const allLayers = Object.values(layersState).map(s => s.layer).filter(l => l);
    if (allLayers.length > 0) {
      const group = L.featureGroup(allLayers);
      if (group.getBounds().isValid()) {
        map.fitBounds(group.getBounds());
      }
    }
    
    buildPanel();
  })
  .catch(err => console.error("Gagal memuat GeoJSON:", err));

// === UNIVERSAL PANEL BUILDER ===
function buildPanel() {
  const ctrl = L.control({ position: "topright" });
  ctrl.onAdd = function () {
    const div = L.DomUtil.create("div", "");
    Object.assign(div.style, {
      background: "white",
      padding: "8px",
      borderRadius: "8px",
      width: "210px",
      fontFamily: "Arial, sans-serif",
      fontSize: "12px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
      maxHeight: "80vh",
      overflowY: "auto"
    });
    
    const sections = Object.entries(layersState).map(([layerKey, state]) => {
      const hasFilter = state.geometryType === 'polygon' && 
                        state.propertyKey && 
                        Object.keys(state.colorMap).length > 0;
      const titleColor = state.defaultColor || '#333';
      
      return `
        <div class="block">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <b style="color:${titleColor}">${state.name}</b>
            <div style="display:flex;align-items:center;gap:4px;">
              <label class="switch">
                <input type="checkbox" class="toggle-layer" data-layer="${layerKey}" checked>
                <span class="slider"></span>
              </label>
              ${hasFilter ? `<button class="dropdown-btn" data-layer="${layerKey}" style="border:none;background:none;font-size:14px;cursor:pointer;padding:0 4px;">▼</button>` : ''}
            </div>
          </div>
          ${hasFilter ? `<div class="filter-list" data-layer="${layerKey}" style="margin-top:4px;display:none;"></div>` : ''}
        </div>
      `;
    }).join('<hr style="margin:8px 0;border:none;border-top:1px solid #ddd;">');
    
    div.innerHTML = sections;
    
    const style = document.createElement("style");
    style.textContent = `
      .switch{position:relative;display:inline-block;width:30px;height:16px;}
      .switch input{opacity:0;width:0;height:0;}
      .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;
        background-color:#ccc;transition:.3s;border-radius:16px;}
      .slider:before{position:absolute;content:"";height:12px;width:12px;left:2px;bottom:2px;
        background:white;transition:.3s;border-radius:50%;}
      input:checked+.slider{background-color:#2196F3;}
      input:checked+.slider:before{transform:translateX(14px);}
      .block{margin:4px 0;}
    `;
    document.head.appendChild(style);
    
    L.DomEvent.disableClickPropagation(div);
    setTimeout(() => setupLogic(div), 0);
    return div;
  };
  ctrl.addTo(map);
}

// === UNIVERSAL PANEL LOGIC ===
function setupLogic(div) {
  // Toggle visibility untuk semua layer
  div.querySelectorAll('.toggle-layer').forEach(toggle => {
    toggle.addEventListener('change', function(e) {
      const layerKey = this.dataset.layer;
      const state = layersState[layerKey];
      if (!state) return;
      
      state.visible = this.checked;
      
      if (state.visible) {
        if (!map.hasLayer(state.layer)) {
          map.addLayer(state.layer);
        }
      } else {
        if (map.hasLayer(state.layer)) {
          map.removeLayer(state.layer);
        }
      }
      
      state.layer.setStyle(f => getStyle(layerKey, f));
    });
  });
  
  // Dropdown toggle
  div.querySelectorAll('.dropdown-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const layerKey = this.dataset.layer;
      const listDiv = div.querySelector(`.filter-list[data-layer="${layerKey}"]`);
      if (listDiv) {
        const isHidden = listDiv.style.display === 'none';
        listDiv.style.display = isHidden ? 'block' : 'none';
        this.textContent = isHidden ? '▲' : '▼';
      }
    });
  });
  
  // Build filter items
  Object.entries(layersState).forEach(([layerKey, state]) => {
    if (state.geometryType !== 'polygon' || !state.propertyKey) return;
    
    const listDiv = div.querySelector(`.filter-list[data-layer="${layerKey}"]`);
    if (!listDiv) return;
    
    Object.entries(state.colorMap).forEach(([name, color]) => {
      const row = document.createElement("div");
      row.style.margin = "2px 0";
      row.innerHTML = `
        <label style="display:flex;align-items:center;justify-content:space-between;cursor:pointer;">
          <span style="display:flex;align-items:center;gap:4px;">
            <input type="checkbox" class="filter-check" data-layer="${layerKey}" value="${name}" checked style="cursor:pointer;">
            <span style="font-size:11px;">${name}</span>
          </span>
          <span style="width:14px;height:14px;background:${color};border:1px solid #333;border-radius:2px;flex-shrink:0;"></span>
        </label>`;
      listDiv.appendChild(row);
    });
    
    // Filter change handler
    listDiv.addEventListener('change', function(e) {
      if (e.target.classList.contains('filter-check')) {
        state.selected.clear();
        listDiv.querySelectorAll('.filter-check:checked').forEach(cb => {
          state.selected.add(cb.value);
        });
        state.layer.setStyle(f => getStyle(layerKey, f));
      }
    });
  });
}