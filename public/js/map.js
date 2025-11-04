// === INISIALISASI MAP ===
const map = L.map("gis-map").setView([-6.2, 106.8], 10);

// === CITRA DASAR ===
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { attribution: "© Esri — Source: Esri", maxZoom: 19 }
).addTo(map);

// === LABEL TEMPAT ===
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19 }
).addTo(map);

// === JALAN & INFRASTRUKTUR ===
L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 19 }
).addTo(map);

// === STATE ===
let showMangrove = true;
let showHabitat = true;
let showTangkapan = true;
let selectedMangrove = new Set();
let selectedHabitat = new Set();

// === WARNA ===
const mangroveColors = {
  "Vegetasi Padat": "#E67514",
  "Vegetasi Sedang": "#FEA405",
  "Vegetasi Jarang": "#E63946"
};
const habitatColors = {
  "Karang Mati dengan Alga": "#E63946",
  "Lamun": "#F77F00",
  "Pasir": "#FBD85D",
  "Pasir dengan Karang Hidup": "#5DEBD7"
};
const tangkapanColor = "#FFE162"; // warna merah

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
  }
});

// === LOAD GEOJSON ===
Promise.all([
  fetch("/data/mangrove.geojson").then(r => r.json()),
  fetch("/data/habitatbentik.geojson").then(r => r.json()),
  fetch("/data/titik_tangkapan.geojson").then(r => r.json())
]).then(([mg, hb, tp]) => {
  mangroveLayer.addData(mg);
  habitatLayer.addData(hb);
  tangkapanLayer.addData(tp);

  map.addLayer(mangroveLayer);
  map.addLayer(habitatLayer);
  map.addLayer(tangkapanLayer);

  const group = L.featureGroup([mangroveLayer, habitatLayer, tangkapanLayer]);
  if (group.getBounds().isValid()) map.fitBounds(group.getBounds());

  buildPanel();
});

// === PANEL ===
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
              <input type="checkbox" id="toggleMangrove" checked>
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
              <input type="checkbox" id="toggleHabitat" checked>
              <span class="slider"></span>
            </label>
            <button id="dropHabitat" style="border:none;background:none;font-size:14px;cursor:pointer;">▼</button>
          </div>
        </div>
        <div id="hbList" style="margin-top:4px;display:none;"></div>
      </div>
      <hr>
      <div class="block">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:#E63946">Titik Tangkapan</b>
          <div>
            <label class="switch">
              <input type="checkbox" id="toggleTangkapan" checked>
              <span class="slider"></span>
            </label>
          </div>
        </div>
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

// === PANEL LOGIC ===
function setupLogic(div) {
  const mgList = div.querySelector("#mgList");
  const hbList = div.querySelector("#hbList");

  Object.entries(mangroveColors).forEach(([name, color]) => {
    const row = document.createElement("div");
    row.style.margin = "2px 0";
    row.innerHTML = `
      <label style="display:flex;align-items:center;justify-content:space-between;">
        <span><input type="checkbox" class="mgCheck" value="${name}" checked> ${name}</span>
        <span style="width:14px;height:14px;background:${color};border:1px solid #333;border-radius:2px;"></span>
      </label>`;
    mgList.appendChild(row);
  });

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

  div.querySelector("#toggleMangrove").addEventListener("change", e => {
    showMangrove = e.target.checked;
    if (showMangrove) map.addLayer(mangroveLayer);
    else map.removeLayer(mangroveLayer);
    mangroveLayer.setStyle(styleMangrove);
  });
  div.querySelector("#toggleHabitat").addEventListener("change", e => {
    showHabitat = e.target.checked;
    if (showHabitat) map.addLayer(habitatLayer);
    else map.removeLayer(habitatLayer);
    habitatLayer.setStyle(styleHabitat);
  });
  div.querySelector("#toggleTangkapan").addEventListener("change", e => {
    showTangkapan = e.target.checked;
    if (showTangkapan) map.addLayer(tangkapanLayer);
    else map.removeLayer(tangkapanLayer);
  });

  div.querySelector("#dropMangrove").addEventListener("click", () => {
    mgList.style.display = mgList.style.display === "none" ? "block" : "none";
  });
  div.querySelector("#dropHabitat").addEventListener("click", () => {
    hbList.style.display = hbList.style.display === "none" ? "block" : "none";
  });

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
