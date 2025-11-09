// === INISIALISASI MAP ===
const map = L.map("gis-map").setView([-6.2, 106.8], 10);

// === TILE LAYER ===
L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 19, attribution: "© Esri"
}).addTo(map);
L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
  maxZoom: 19
}).addTo(map);

// === STATE ===
let showMangrove = true;
let showHabitat = true;
let showTangkapan = true;
let selectedMangrove = new Set(["Vegetasi Padat", "Vegetasi Sedang", "Vegetasi Jarang"]);
let selectedHabitat = new Set(["Karang Mati dengan Alga", "Lamun", "Pasir", "Pasir dengan Karang Hidup"]);
let availableYears = [];
let currentYear = "all";

// === WARNA ===
const mangroveColors = {
  "Vegetasi Padat": "#08CB00",
  "Vegetasi Sedang": "#FFEB00",
  "Vegetasi Jarang": "#ED3500"
};
const habitatColors = {
  "Karang Mati dengan Alga": "#E63946",
  "Lamun": "#F77F00",
  "Pasir": "#FBD85D",
  "Pasir dengan Karang Hidup": "#5DEBD7"
};
const tangkapanColor = "#FFFFFF";

// === STYLE ===
function styleMangrove(f) {
  const kategori = f.properties?.Kategori || "";
  const match = selectedMangrove.has(kategori);
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
  const match = selectedHabitat.has(kelas);
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
    l.bindPopup(`
      <b>Alat Tangkap:</b> ${p.Alat_Tangk || "-"}<br>
      <b>Jenis Tangkapan:</b> ${p.Jenis_Tang || "-"}<br>
      <b>Jumlah Tangkapan:</b> ${p.Jumlah_Tan || "-"} kg
    `);
  }
});

// === DETEKSI TAHUN ===
async function detectAvailableYears() {
  try {
    const response = await fetch("/data/list.json");
    availableYears = await response.json();
  } catch {
    availableYears = ["2025"];
  }
}

// === MUAT DATA BERDASARKAN TAHUN ===
async function loadDataForYear(year) {
  const basePath = "/data";
  if (year === "all") return loadAllYears();

  const files = {
    mangrove: `${basePath}/mangrove_${year}.geojson`,
    habitat: `${basePath}/habitatbentik_${year}.geojson`,
    tangkapan: `${basePath}/titik_tangkapan_${year}.geojson`
  };

  try {
    const mg = await fetch(files.mangrove).then(r => r.ok ? r.json() : { features: [] });
    const hb = await fetch(files.habitat).then(r => r.ok ? r.json() : { features: [] });
    const tp = await fetch(files.tangkapan).then(r => r.ok ? r.json() : { features: [] });

    mangroveLayer.clearLayers().addData(mg);
    habitatLayer.clearLayers().addData(hb);
    tangkapanLayer.clearLayers().addData(tp);

    map.addLayer(mangroveLayer);
    map.addLayer(habitatLayer);
    map.addLayer(tangkapanLayer);

    const group = L.featureGroup([mangroveLayer, habitatLayer, tangkapanLayer]);
    if (group.getBounds().isValid()) map.fitBounds(group.getBounds());
  } catch {
    alert(`Gagal memuat data untuk tahun ${year}. Pastikan file *_${year}.geojson ada di /data.`);
  }
}

// === MUAT SEMUA TAHUN ===
async function loadAllYears() {
  const basePath = "/data";
  const allMangrove = [];
  const allHabitat = [];
  const allTangkapan = [];

  for (const year of availableYears) {
    const mg = await fetch(`${basePath}/mangrove_${year}.geojson`).then(r => r.ok ? r.json() : { features: [] });
    const hb = await fetch(`${basePath}/habitatbentik_${year}.geojson`).then(r => r.ok ? r.json() : { features: [] });
    const tp = await fetch(`${basePath}/titik_tangkapan_${year}.geojson`).then(r => r.ok ? r.json() : { features: [] });

    allMangrove.push(...mg.features);
    allHabitat.push(...hb.features);
    allTangkapan.push(...tp.features);
  }

  mangroveLayer.clearLayers().addData({ type: "FeatureCollection", features: allMangrove });
  habitatLayer.clearLayers().addData({ type: "FeatureCollection", features: allHabitat });
  tangkapanLayer.clearLayers().addData({ type: "FeatureCollection", features: allTangkapan });

  const group = L.featureGroup([mangroveLayer, habitatLayer, tangkapanLayer]);
  if (group.getBounds().isValid()) map.fitBounds(group.getBounds());
}

// === PANEL ===
function buildPanel() {
  const ctrl = L.control({ position: "topright" });
  ctrl.onAdd = function () {
    const div = L.DomUtil.create("div", "info legend");
    Object.assign(div.style, {
      background: "white",
      padding: "8px",
      borderRadius: "8px",
      width: "200px",
      fontFamily: "Arial, sans-serif",
      fontSize: "11px",
      boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
    });

    div.innerHTML = `
      <label style="font-weight:bold;">Filter Tahun:</label><br>
      <select id="tahunSelect" style="width:100%;padding:4px;border-radius:4px;margin-bottom:6px;font-size:12px;"></select>
      <hr style="margin:6px 0;">

      <div class="block">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:#8B0000;text-transform:capitalize;">habitat bentik</b>
          <div>
            <label class="switch">
              <input type="checkbox" id="toggleHabitat" checked>
              <span class="slider"></span>
            </label>
            <button id="dropHabitat" class="dropBtn">▲</button>
          </div>
        </div>
        <div id="hbList" style="margin-top:4px;display:none;margin-left:4px;"></div>
      </div>

      <hr style="margin:6px 0;">
      <div class="block">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:green;text-transform:capitalize;">mangrove</b>
          <div>
            <label class="switch">
              <input type="checkbox" id="toggleMangrove" checked>
              <span class="slider"></span>
            </label>
            <button id="dropMangrove" class="dropBtn">▲</button>
          </div>
        </div>
        <div id="mgList" style="margin-top:4px;display:none;margin-left:4px;"></div>
      </div>

      <hr style="margin:6px 0;">
      <div class="block">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <b style="color:#1f1f1f;text-transform:capitalize;">titik tangkapan</b>
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
      .switch{position:relative;display:inline-block;width:26px;height:14px;vertical-align:middle;}
      .switch input{opacity:0;width:0;height:0;}
      .slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:#ccc;transition:.3s;border-radius:14px;}
      .slider:before{position:absolute;content:"";height:10px;width:10px;left:2px;bottom:2px;background:white;transition:.3s;border-radius:50%;}
      input:checked+.slider{background-color:#2196F3;}
      input:checked+.slider:before{transform:translateX(12px);}
      .dropBtn{border:none;background:none;font-size:12px;cursor:pointer;line-height:10px;padding:0;margin-left:3px;color:#222;}
      .filter-item{display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;}
      .filter-item label{cursor:pointer;}
      .color-box{width:12px;height:12px;border:1px solid #555;border-radius:2px;display:inline-block;margin-left:6px;}
    `;
    document.head.appendChild(style);

    L.DomEvent.disableClickPropagation(div);
    setTimeout(() => setupLogic(div), 0);
    return div;
  };
  ctrl.addTo(map);
}

function setupLogic(div) {
  const tahunSelect = div.querySelector("#tahunSelect");
  tahunSelect.innerHTML =
    `<option value="Semua">Semua Tahun</option>` +
    availableYears.map(y => `<option value="${y}">${y}</option>`).join("");
  tahunSelect.value = "Semua";
  tahunSelect.addEventListener("change", e => {
    const tahun = e.target.value;
    if (tahun === "Semua") loadAllYears();
    else loadDataForYear(tahun);
  });

  // habitat bentik
  const hbList = div.querySelector("#hbList");
  hbList.innerHTML = Object.entries(habitatColors).map(([k, v]) => `
    <div class="filter-item">
      <label><input type="checkbox" class="habitatFilter" value="${k}" checked> ${k}</label>
      <span class="color-box" style="background:${v};"></span>
    </div>
  `).join("");

  // mangrove
  const mgList = div.querySelector("#mgList");
  mgList.innerHTML = Object.entries(mangroveColors).map(([k, v]) => `
    <div class="filter-item">
      <label><input type="checkbox" class="mangroveFilter" value="${k}" checked> ${k}</label>
      <span class="color-box" style="background:${v};"></span>
    </div>
  `).join("");

  
   // Dropdown animasi (balik arah panah)
  const dropMg = div.querySelector("#dropMangrove");
  const dropHb = div.querySelector("#dropHabitat");

  dropMg.addEventListener("click", () => {
    const mg = div.querySelector("#mgList");
    const hidden = mg.style.display === "none";
    mg.style.display = hidden ? "block" : "none";
    dropMg.textContent = hidden ? "▲" : "▼";
  });
  dropHb.addEventListener("click", () => {
    const hb = div.querySelector("#hbList");
    const hidden = hb.style.display === "none";
    hb.style.display = hidden ? "block" : "none";
    dropHb.textContent = hidden ? "▲" : "▼";
  });

  // Layer toggles
  div.querySelector("#toggleHabitat").addEventListener("change", e => {
    map[e.target.checked ? "addLayer" : "removeLayer"](habitatLayer);
  });
  div.querySelector("#toggleMangrove").addEventListener("change", e => {
    map[e.target.checked ? "addLayer" : "removeLayer"](mangroveLayer);
  });
  div.querySelector("#toggleTangkapan").addEventListener("change", e => {
    map[e.target.checked ? "addLayer" : "removeLayer"](tangkapanLayer);
  });

  // Filter checkbox
  div.querySelectorAll(".mangroveFilter").forEach(chk => {
    chk.addEventListener("change", e => {
      if (e.target.checked) selectedMangrove.add(e.target.value);
      else selectedMangrove.delete(e.target.value);
      mangroveLayer.setStyle(styleMangrove);
    });
  });
  div.querySelectorAll(".habitatFilter").forEach(chk => {
    chk.addEventListener("change", e => {
      if (e.target.checked) selectedHabitat.add(e.target.value);
      else selectedHabitat.delete(e.target.value);
      habitatLayer.setStyle(styleHabitat);
    });
  });

  // default load
  loadAllYears();
}


// === MUAT SEMUA DATA DARI SEMUA TAHUN ===
async function loadAllYears() {
  const basePath = "/data";

  mangroveLayer.clearLayers();
  habitatLayer.clearLayers();
  tangkapanLayer.clearLayers();

  for (const year of availableYears) {
    const files = {
      mangrove: `${basePath}/mangrove_${year}.geojson`,
      habitat: `${basePath}/habitatbentik_${year}.geojson`,
      tangkapan: `${basePath}/titik_tangkapan_${year}.geojson`
    };

    try {
      const [mg, hb, tp] = await Promise.all([
        fetch(files.mangrove).then(r => r.ok ? r.json() : { type: "FeatureCollection", features: [] }),
        fetch(files.habitat).then(r => r.ok ? r.json() : { type: "FeatureCollection", features: [] }),
        fetch(files.tangkapan).then(r => r.ok ? r.json() : { type: "FeatureCollection", features: [] })
      ]);

      mg.features.forEach(f => f.properties.Tahun = year);
      hb.features.forEach(f => f.properties.Tahun = year);
      tp.features.forEach(f => f.properties.Tahun = year);

      mangroveLayer.addData(mg);
      habitatLayer.addData(hb);
      tangkapanLayer.addData(tp);
    } catch (err) {
      console.warn(`Gagal memuat data tahun ${year}`, err);
    }
  }

  map.addLayer(mangroveLayer);
  map.addLayer(habitatLayer);
  map.addLayer(tangkapanLayer);

  const group = L.featureGroup([mangroveLayer, habitatLayer, tangkapanLayer]);
  if (group.getBounds().isValid()) map.fitBounds(group.getBounds());
}




// === JALANKAN ===
(async () => {
  await detectAvailableYears();
  buildPanel();
})();
