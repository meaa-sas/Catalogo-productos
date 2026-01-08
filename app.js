const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbziYyyMPi0KXOJFQVt1NXWeDC89gWrkv0LSZs6PkgDrNwIlfL3mgY6YbBK-UDYUF-TC/exec";

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

let productosGlobal = [];

async function cargarProductos() {
  const status = document.getElementById("status");
  const count = document.getElementById("count");

  try {
    status.textContent = "Conectando con Google Sheets...";
    const payload = await getJSONP();
    productosGlobal = payload.data || [];

    renderizarProductos(productosGlobal);

    count.textContent = `${productosGlobal.length} producto(s)`;
    status.textContent = "";

    if (typeof window.__catalogo_ready === "function") {
      window.__catalogo_ready(productosGlobal);
    }
  } catch (err) {
    count.textContent = "0 producto(s)";
    status.textContent = "❌ Error: No se pudo cargar.";
    console.error("Error cargando productos:", err);
  }
}

function renderizarProductos(productos) {
  const cont = document.querySelector("#productos");
  cont.innerHTML = productos.map((p, index) => {
    const search = `${p.codigo} ${p.nombre} ${p.descripcion} ${p.categoria}`.toLowerCase();
    return `
      <article class="card" data-search="${esc(search)}" data-categoria="${esc(p.categoria)}" onclick="mostrarDetalle(${index})">
        <img src="${p.imagen || 'https://via.placeholder.com/400x300/1a2332/34d399?text=Sin+imagen'}" alt="${esc(p.nombre)}" onerror="this.src='https://via.placeholder.com/400x300/1a2332/34d399?text=Sin+imagen'">
        <div class="card-content">
          <h3>${p.nombre || ''}</h3>
          <small>${p.codigo || ''} · ${p.categoria || ''}</small>
          <strong>${p.precio || ''}</strong>
        </div>
      </article>
    `;
  }).join("");
}

function mostrarDetalle(index) {
  const p = productosGlobal[index];
  const modal = document.getElementById("modal");
  
  document.getElementById("modal-image").src = p.imagen || 'https://via.placeholder.com/600x400/1a2332/34d399?text=Sin+imagen';
  document.getElementById("modal-nombre").textContent = p.nombre || '';
  document.getElementById("modal-codigo").textContent = `${p.codigo || ''} · ${p.categoria || ''}`;
  document.getElementById("modal-precio").textContent = p.precio || '';
  document.getElementById("modal-descripcion").textContent = p.descripcion || 'Sin descripción disponible';
  
  const whatsappBtn = document.getElementById("modal-whatsapp");
  if (p.whatsapp) {
    whatsappBtn.href = p.whatsapp;
    whatsappBtn.style.display = 'inline-block';
  } else {
    whatsappBtn.style.display = 'none';
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevenir scroll del body
}

function cerrarModal() {
  document.getElementById("modal").classList.remove('active');
  document.body.style.overflow = ''; // Restaurar scroll
}

// Cerrar modal al hacer clic fuera
document.addEventListener('click', (e) => {
  const modal = document.getElementById("modal");
  if (e.target === modal) {
    cerrarModal();
  }
});

// Cerrar modal con tecla ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    cerrarModal();
  }
});

cargarProductos();
