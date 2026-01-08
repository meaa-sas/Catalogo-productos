const WEB_APP_URL =
  "https://script.google.com/macros/s/AKfycbx_LVnDZA7N3_Q38zskfiYzHWTCruC5_NHng2AI89tcz5UGRIerK9mfANCsjeLLtuUi/exec";

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
  const payload = await getJSONP();
  const productos = payload.data || [];
  // aquí pintas las cards como ya lo tienes
}

cargarProductos();

