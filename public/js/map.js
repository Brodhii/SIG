// === map.js versi fix warna + UI rapi ===

var map = L.map('gis-map').setView([1.183, 104.537], 15);

// Basemap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// ==== DATA ====
let showMangrove = false, showHabitat = false;
let selectedMangrove = new Set(), selectedHabitat = new Set();

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

// ==== STYLE ====
function styleMangrove(f) {
  const kategori = f.properties?.Kategori || "";
  if (!showMangrove) return { fillOpacity: 0, opacity: 0 };
  const match = selectedMangrove.size === 0 || selectedMangrove.has(kategori);
  const color = mangroveColors[kategori] || "#CCCCCC";
  return {
    color: "#333",
    weight: 0.4,
    fillColor: color,
    fillOpacity: match ? 0.7 : 0.05,
    opacity: match ? 1 : 0.3
  };
}
function styleHabitat(f) {
  const kelas = f.properties?.Kelas || "";
  if (!showHabitat) return { fillOpacity: 0, opacity: 0 };
  const match = selectedHabitat.size === 0 || selectedHabitat.has(kelas);
  const color = habitatColors[kelas] || "#CCCCCC";
  return {
    color: "#333",
    weight: 0.4,
    fillColor: color,
    fillOpacity: match ? 0.7 : 0.05,
    opacity: match ? 1 : 0.3
  };
}

// ==== LAYERS ====
const mangroveLayer = L.geoJSON(null, {
  style: styleMangrove,
  onEachFeature: (f, l) => l.bindPopup(`${f.properties.Kategori}`)
});
const habitatLayer = L.geoJSON(null, {
  style: styleHabitat,
  onEachFeature: (f, l) => l.bindPopup(`${f.properties.Kelas}`)
});

// ==== LOAD ====
Promise.all([
  fetch("/data/mangrove.geojson").then(r => r.json()),
  fetch("/data/habitatbentik.geojson").then(r => r.json())
]).then(([mg, hb]) => {
  mangroveLayer.addData(mg);
  habitatLayer.addData(hb);
  const group = L.featureGroup([mangroveLayer, habitatLayer]);
  if (group.getBounds().isValid()) map.fitBounds(group.getBounds());
  buildPanel();

  showMangrove = true;
  showHabitat = true;
  map.addLayer(mangroveLayer);
  map.addLayer(habitatLayer);
});

// ==== PANEL ====
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
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
    });

    div.innerHTML = `
      <div class="block">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:#0A400C">Hutan Mangrove</b>
          <div>
            <label class="switch">
              <input type="checkbox" id="toggleMangrove">
              <span class="slider"></span>
            </label>
            <button id="dropMangrove" style="border:none;background:none;font-size:14px;cursor:pointer;">▼</button>
          </div>
        </div>
        <div id="mgList" style="margin-top:4px;display:none;"></div>
      </div>
      <hr>
      <div class="block">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:#8B0000">Habitat Bentik</b>
          <div>
            <label class="switch">
              <input type="checkbox" id="toggleHabitat">
              <span class="slider"></span>
            </label>
            <button id="dropHabitat" style="border:none;background:none;font-size:14px;cursor:pointer;">▼</button>
          </div>
        </div>
        <div id="hbList" style="margin-top:4px;display:none;"></div>
      </div>
    `;

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
    `;
    document.head.appendChild(style);

    L.DomEvent.disableClickPropagation(div);
    setTimeout(() => setupLogic(div), 0);
    return div;
  };
  ctrl.addTo(map);
}

// ==== PANEL LOGIC ====
function setupLogic(div) {
  const mgList = div.querySelector("#mgList");
  const hbList = div.querySelector("#hbList");

  // buat list kategori mangrove
  Object.entries(mangroveColors).forEach(([name, color]) => {
    const row = document.createElement("div");
    row.style.margin = "2px 0";
    row.innerHTML = `
      <label style="display:flex;align-items:center;justify-content:space-between;">
        <span><input type="checkbox" class="mgCheck" value="${name}" checked> ${name}</span>
        <span style="width:14px;height:14px;background:${color};border:1px solid #333;border-radius:2px;"></span>
      </label>`;
    mgList.appendChild(row);

    const toggleMangrove = div.querySelector("#toggleMangrove");
const toggleHabitat = div.querySelector("#toggleHabitat");

    toggleMangrove.checked = true;
    toggleHabitat.checked = true;

    // langsung tampilkan layer dan set style
    showMangrove = true;
    showHabitat = true;
    map.addLayer(mangroveLayer);
    map.addLayer(habitatLayer);
    mangroveLayer.setStyle(styleMangrove);
    habitatLayer.setStyle(styleHabitat);
  });

  // buat list habitat
  Object.entries(habitatColors).forEach(([name, color]) => {
    const row = document.createElement("div");
    row.style.margin = "2px 0";
    row.innerHTML = `
      <label style="display:flex;align-items:center;justify-content:space-between;">
        <span><input type="checkbox" class="hbCheck" value="${name}" checked> ${name}</span>
        <span style="width:14px;height:14px;background:${color};border:1px solid #333;border-radius:2px;"></span>
      </label>`;
    hbList.appendChild(row);
  });

  // event toggle utama
  div.querySelector("#toggleMangrove").addEventListener("change", e => {
    showMangrove = e.target.checked;
    if (showMangrove && !map.hasLayer(mangroveLayer)) map.addLayer(mangroveLayer);
    else if (!showMangrove && map.hasLayer(mangroveLayer)) map.removeLayer(mangroveLayer);
    mangroveLayer.setStyle(styleMangrove);
  });
  div.querySelector("#toggleHabitat").addEventListener("change", e => {
    showHabitat = e.target.checked;
    if (showHabitat && !map.hasLayer(habitatLayer)) map.addLayer(habitatLayer);
    else if (!showHabitat && map.hasLayer(habitatLayer)) map.removeLayer(habitatLayer);
    habitatLayer.setStyle(styleHabitat);
  });

  // dropdown buka/tutup
  div.querySelector("#dropMangrove").addEventListener("click", () => {
    mgList.style.display = mgList.style.display === "none" ? "block" : "none";
  });
  div.querySelector("#dropHabitat").addEventListener("click", () => {
    hbList.style.display = hbList.style.display === "none" ? "block" : "none";
  });

  // filter event
  mgList.addEventListener("change", () => {
    selectedMangrove.clear();
    mgList.querySelectorAll(".mgCheck:checked").forEach(cb => selectedMangrove.add(cb.value));
    mangroveLayer.setStyle(styleMangrove);
  });
  hbList.addEventListener("change", () => {
    selectedHabitat.clear();
    hbList.querySelectorAll(".hbCheck:checked").forEach(cb => selectedHabitat.add(cb.value));
    habitatLayer.setStyle(styleHabitat);
  });
}
