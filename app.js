const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbwEfq9lqxIQm481wdu5LpPii0ZEAXavmlSikPYmtr9_JFFtYGAEO0QU3K0ZweDJZKBr/exec";

function esc(s) {
  return (s ?? "").toString().replaceAll('"', "&quot;");
}

function getJSONP() {
  return new Promise((resolve, reject) => {
    const cb = "cb_" + Date.now();
    const script = document.createElement("script");
    
    window[cb] = (payload) => {
      try { delete window[cb]; } catch (e) { window[cb] = undefined; }
      script.remove();
      resolve(payload);
    };

    script.src = `${WEB_APP_URL}?prefix=${cb}`;
    script.onerror = () => {
      try { delete window[cb]; } catch (e) { window[cb] = undefined; }
      script.remove();
      reject(new Error("No se pudo cargar el JSONP"));
    };

    document.body.appendChild(script);
  });
}

async function cargarProductos() {
  const status = document.getElementById("status");
  const count = document.getElementById("count");

  try {
    status.textContent = "Conectando con Google Sheets...";
    const payload = await getJSONP();
    const productos = payload.data || [];

    const cont = document.querySelector("#productos");
    cont.innerHTML = productos.map(p => {
      const search = `${p.codigo} ${p.nombre} ${p.descripcion} ${p.categoria}`.toLowerCase();
      return `
        <article class="card" data-search="${esc(search)}" data-categoria="${esc(p.categoria)}">
          <img src="${p.imagen_url || 'https://via.placeholder.com/400x200/1a2332/34d399?text=Sin+imagen'}" alt="${esc(p.nombre)}" onerror="this.src='https://via.placeholder.com/400x200/1a2332/34d399?text=Sin+imagen'">
          <h3>${p.nombre || ''}</h3>
          <small>${p.codigo || ''}${p.categoria ? " · " + p.categoria : ""}</small>
          <p>${p.descripcion || ''}</p>
          ${p.precio ? `<strong>${p.precio}</strong>` : ""}
          ${p.stock ? `<small style="display:block;margin:0 12px 8px;color:rgba(231,238,252,.75);">Stock: ${p.stock}</small>` : ""}
          ${p.whatsapp ? `<a href="${p.whatsapp}" target="_blank" rel="noopener">Cotizar por WhatsApp</a>` : ""}
        </article>
      `;
    }).join("");

    count.textContent = `${productos.length} producto(s)`;
    status.textContent = "";

    if (typeof window.__catalogo_ready === "function") {
      window.__catalogo_ready(productos);
    }
  } catch (err) {
    count.textContent = "0 producto(s)";
    status.textContent = "❌ Error: No se pudo cargar. Verifica la URL del Web App.";
    console.error("Error cargando productos:", err);
  }
}

cargarProductos();
