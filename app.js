const API_KEY = "TU_API_KEY";
const SPREADSHEET_ID = "1hZoZBVe-tQrMrjdSQ8Vi6-RCjbsPSwAp";
const RANGE = "Productos!A1:H";

async function cargarProductos() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${encodeURIComponent(RANGE)}?key=${API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();

  const [headers, ...rows] = data.values || [];
  const idx = Object.fromEntries(headers.map((h, i) => [h.trim(), i]));

  const productos = rows.map(r => ({
    codigo: r[idx.codigo] || "",
    imagen_url: r[idx.imagen_url] || "",
    nombre: r[idx.nombre] || "",
    descripcion: r[idx.descripcion] || "",
    categoria: r[idx.categoria] || "",
    precio: r[idx.precio] || "",
    stock: r[idx.stock] || "",
    whatsapp: r[idx.whatsapp] || ""
  }));

  const cont = document.querySelector("#productos");
  cont.innerHTML = productos.map(p => `
    <article class="card">
      <img src="${p.imagen_url || 'assets/sin-imagen.png'}" alt="${p.nombre}">
      <h3>${p.nombre}</h3>
      <small>${p.codigo}${p.categoria ? " · " + p.categoria : ""}</small>
      <p>${p.descripcion}</p>
      ${p.precio ? `<div><strong>${p.precio}</strong></div>` : ""}
      ${p.stock ? `<div>Stock: ${p.stock}</div>` : ""}
      ${p.whatsapp ? `<a href="${p.whatsapp}" target="_blank" rel="noopener">Cotizar por WhatsApp</a>` : ""}
    </article>
  `).join("");
}

cargarProductos();

