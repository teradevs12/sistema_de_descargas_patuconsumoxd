// --- Elementos del DOM (cache) ---
const loading = document.getElementById('loading');
const videoTitle = document.getElementById('video-title');
const btnFilemoon = document.getElementById('btn-filemoon');
const btnStreamhg = document.getElementById('btn-streamhg');
const btnTerabox = document.getElementById('btn-terabox');
const catalogList = document.getElementById('video-catalog-list');
const downloadPrompt = document.getElementById('download-prompt');

// --- Tus Enlaces (Se mantienen igual) -------
// ¡¡ACTUALIZA ESTOS ENLACES CON LOS TUYOS DE PATUCONSUMOXD!!
const socialLinks = {
  x: "https://x.com/patuconsumoxd?t=lBK2T6a-4wD-fXKMzQ_Lsg&s=35",
  facebook: "https://www.facebook.com/people/GREAT-LINKS/61556741140694/?mibextid=ZbWKwL",
  instagram: "https://www.instagram.com/mysweetlinks/?igsh=eDhuZHNtOHE4eXdx#",
  whatsapp: "https://whatsapp.com/channel/0029VaUDtFDDp2QCGAzyPB3u",
  tiktok: "https://www.tiktok.com/@patuconsumoxdpacks?is_from_webapp=1&sender_device=pc"
};

const telegramChannels = {
  main: "https://t.me/+iQ-eesmcw0VhYzQx",      // Este es @teralinks12 (VIP)
  catalog: "https://t.me/patuconsumoxdmenu",   // Este es el Catálogo (Carpeta)
  tutorial: "https://t.me/tutodescargas" // Este es el de Guías (Libro)
};

/**
 * TAREA 1: Hidratar enlaces estáticos de la comunidad.
 */
function populateCommunityLinks() {
  document.getElementById('link-telegram-main').href = telegramChannels.main;
  document.getElementById('link-telegram-catalog').href = telegramChannels.catalog;
  document.getElementById('link-telegram-tutorial').href = telegramChannels.tutorial;
  
  document.getElementById('link-tiktok').href = socialLinks.tiktok;
  document.getElementById('link-whatsapp').href = socialLinks.whatsapp;
  document.getElementById('link-x').href = socialLinks.x;
  document.getElementById('link-facebook').href = socialLinks.facebook;
  document.getElementById('link-instagram').href = socialLinks.instagram;
}

/**
 * TAREA 2: Rellenar el catálogo de videos.
 */
function populateVideoCatalog(data) {
  catalogList.innerHTML = ''; 
  
  // .reverse() para mostrar los más nuevos primero
  const allVideos = Object.entries(data).reverse();

  allVideos.forEach(([videoKey, video]) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    
    // La redirección funciona gracias a _redirects
    link.href = `/${videoKey}`; 
    
    link.textContent = `⚡ ${video.title.toUpperCase()}`;
    
    listItem.appendChild(link);
    catalogList.appendChild(listItem);
  });
}

/**
 * TAREA 3: Lógica Principal (Fetch y carga del video actual)
 */
function main() {
  // 1. Rellenar la comunidad INMEDIATAMENTE
  populateCommunityLinks();

  // 2. Obtener el ID del video actual (Sin cambios)
  const videoId = window.location.pathname.substring(1);

  // 3. Buscar los datos del video desde NUESTRA API SEGURA
  // ¡Esta es la única llamada que hacemos!
  fetch('/api/get-video')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error en la red: ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      // --- A. Rellenar el Catálogo de Videos (con todos los datos) ---
      populateVideoCatalog(data);

      // --- B. Rellenar el Video Principal ---
      // Buscamos el videoId DENTRO de los datos recibidos
      if (!data[videoId]) {
        // Video no encontrado
        videoTitle.textContent = "❌ Video no encontrado ❌";
        loading.textContent = "El video no existe o fue movido.";
        return;
      }

      // ¡Video encontrado!
      const video = data[videoId];
      
      // Rellenar Título y Enlaces
      videoTitle.textContent = `🎬 » ${video.title.toUpperCase()} « 🎬`;
      
      // Actualiza el título de la pestaña del navegador
      document.title = `⚡ ${video.title.toUpperCase()} | PatuConsumoXD`;

      btnFilemoon.href = video.filemoon;
      btnStreamhg.href = video.streamhg;
      btnTerabox.href = video.terabox;

      // Ocultar "Cargando..."
      loading.style.display = 'none';

      // Mostrar el prompt y los botones (CTA Primario)
      downloadPrompt.classList.remove('hidden');
      btnFilemoon.classList.remove('hidden');
      btnStreamhg.classList.remove('hidden');
      btnTerabox.classList.remove('hidden');

    })
    .catch((error) => {
      console.error('Error al cargar datos desde la API:', error);
      videoTitle.textContent = "Error en el Sistema";
      loading.textContent = "⚠️ Error cargando enlaces. Intenta más tarde.";
    });
}

// Ejecutar la lógica principal cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', main);
