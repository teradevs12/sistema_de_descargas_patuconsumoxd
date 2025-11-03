// Este objeto 'videoData' es tu base de datos segura.
// Aquí es donde añades o editas videos.
const videoData = {
  "test": {
    "title": "PRUEBA FUNCIONANDO",
    "filemoon": "https://link-target.net/587204/HMNdhqQpluDS",
    "streamhg": "https://link-center.net/587204/4vM0A0kouGp3",
    "terabox": "https://1024terabox.com/s/1OhMMisYt6C8FgJc34dS_wQ"
  },
  "sarablondepart2": {
    "title": "SARA BLONDE",
    "filemoon": "https://direct-link.net/587204/FS0pozhUPMZW",
    "streamhg": "https://link-center.net/587204/QEA36CbkuejI",
    "terabox": "https://link-center.net/587204/NI8yotzzTAwN"
  },
  "lina1": {
    "title": "LINA HENAO",
    "filemoon": "https://link-target.net/587204/H08akcz1lbQV",
    "streamhg": "https://link-target.net/587204/cPe7hVe3HROX",
    "terabox": "https://link-center.net/587204/RyZbdN78o49x"
  },
  "analia1": {
    "title": "ANALIA LIPHA",
    "filemoon": "https://link-hub.net/587204/VauwpBB1J7Kg",
    "streamhg": "https://link-target.net/587204/q9sMSjTBinWP",
    "terabox": "https://link-target.net/587204/hjbLQ4OMzBEC"
  },
  "lilyph1": {
    "title": "LILY PHILLIPS OF",
    "filemoon": "https://link-target.net/587204/u4UHIh6LaBHR",
    "streamhg": "https://link-target.net/587204/hXFgFlLLxu9A",
    "terabox": "https://direct-link.net/587204/BmRSF7CBqtWc"
  },
  // ... (Añade el resto de tus datos de video aquí) ...
  // ... (Asegúrate de copiar todos los datos del archivo original) ...
  "sarapayasita": {
    "title": "SARA BLONDE LA PAYASITA",
    "filemoon": "https://link-target.net/587204/b2NqUU68UCQD",
    "streamhg": "https://link-hub.net/587204/yJfcQLxg8i6O",
    "terabox": "https://direct-link.net/587204/mpXhbfWSudcs"
  }
};


/**
 * Esta es la función de Cloudflare que se ejecuta en el servidor.
 * Ahora devuelve TODOS los videos en una sola llamada.
 */
export async function onRequest(context) {
  
  // Devolvemos todos los datos de video como JSON
  return new Response(JSON.stringify(videoData), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*', // Permite que tu página llame a esta API
      'Cache-Control': 's-maxage=300' // Añade caché de 5 minutos para velocidad
    },
  });
}