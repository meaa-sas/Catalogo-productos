const WEB_APP_URL = "https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbx_LVnDZA7N3_Q38zskfiYzHWTCruC5_NHng2AI89tcz5UGRIerK9mfANCsjeLLtuUi/exec";

function getJSONP() {
  return new Promise((resolve, reject) => {
    const cb = "cb_" + Date.now();
    window[cb] = (payload) => {
      delete window[cb];
      script.remove();
      resolve(payload);
    };

    const script = document.createElement("script");
    script.src = `${WEB_APP_URL}?prefix=${cb}`;
    script.onerror = () => {
      delete window[cb];
      script.remove();
      reject(new Error("No se pudo cargar el JSONP"));
    };
    document.body.appendChild(script);
  });
}

async function cargarProductos() {
  const payload = await getJSONP();
  const productos = payload.data || [];
  // ... aquí pintas las cards igual que ya lo tienes ...
}

cargarProductos();

