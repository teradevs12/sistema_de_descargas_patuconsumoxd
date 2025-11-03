/**
 * Script.js - Versión "CineMax"
 * * Mejoras clave:
 * 1.  Carga Asíncrona: El catálogo se carga *después* del video principal para una
 * velocidad de carga percibida (LCP) instantánea.
 * 2.  Diseño Escalable: Preparado para aceptar "imageUrl", "description" y "category"
 * en el data.json para una experiencia Netflix completa.
 * 3.  Placeholders: Muestra un "skeleton loading" profesional mientras
 * carga el contenido.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Cache de Elementos del DOM ---
  const dom = {
    hero: document.getElementById('main-content'),
    title: document.getElementById('video-title'),
    description: document.getElementById('video-description'),
    backdrop: document.getElementById('video-backdrop'),
    ctaContainer: document.getElementById('cta-container'),
    loadingText: document.getElementById('loading-text'),
    catalogGrid: document.getElementById('video-catalog-grid'),
    catalogTitle: document.getElementById('catalog-title')
  };

  // --- 2. Enlaces Estáticos (Comunidad) ---
  const socialLinks = {
    x: "https://x.com/patuconsumoxxd?t=lBK2T6a-4wD-fXKMzQ_Lsg&s=35",
    facebook: "https://www.facebook.com/people/GREAT-LINKS/61556741140694/?mibextid=ZbWKwL",
    instagram: "https://www.instagram.com/mysweetlinks/?igsh=eDhuZHNtOHE4eXdx#",
    whatsapp: "https://whatsapp.com/channel/0029VaUDtFDDp2QCGAzyPB3u",
    tiktok: "https://www.tiktok.com/@patuconsumoxdpacks?is_from_webapp=1&sender_device=pc"
  };

  const telegramChannels = {
    main: "https://t.me/+iQ-eesmcw0VhYzQx",
    catalog: "https://t.me/patuconsumoxdmenu",
    tutorial: "https://t.me/tutodescargas"
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
   * TAREA 2: Rellenar el video "Hero" (el actual).
   * Esta es la tarea prioritaria para el usuario.
   */
  function populateHero(video) {
    // 1. Quitar placeholders
    dom.title.classList.remove('loading-placeholder');
    dom.description.classList.remove('loading-placeholder');
    dom.loadingText.style.display = 'none';

    // 2. Rellenar Título y Título de Página
    const formattedTitle = video.title.toUpperCase();
    dom.title.textContent = formattedTitle;
    document.title = `Ver ${formattedTitle} | Tu Sistema`;

    // 3. Rellenar Descripción (¡NUEVA FUNCIÓN!)
    // Si añades "description" a tu data.json, aparecerá aquí.
    if (video.description) {
      dom.description.textContent = video.description;
    } else {
      dom.description.textContent = "Elige tu opción de descarga preferida a continuación.";
    }

    // 4. Rellenar Fondo (¡NUEVA FUNCIÓN!)
    // Si añades "imageUrl" a tu data.json, aparecerá aquí.
    if (video.imageUrl) {
      dom.backdrop.src = video.imageUrl;
      dom.backdrop.style.display = 'block';
    }

    // 5. Rellenar Botones de Descarga (CTA)
    // Orden de marketing: Terabox (primario), otros (secundarios)
    if (video.terabox) {
      dom.ctaContainer.appendChild(
        createCtaButton(video.terabox, "Descargar (Terabox)", "btn-cta-primary")
      );
    }
    if (video.filemoon) {
      dom.ctaContainer.appendChild(
        createCtaButton(video.filemoon, "Ver (Filemoon)", "btn-cta-secondary")
      );
    }
    if (video.streamhg) {
      dom.ctaContainer.appendChild(
        createCtaButton(video.streamhg, "Ver (StreamHG)", "btn-cta-secondary")
      );
    }
  }

  /**
   * TAREA 3: Rellenar el Catálogo (Rejilla Netflix).
   * Se ejecuta de forma asíncrona para no bloquear la carga principal.
   * * @param {object} data - El objeto JSON completo.
   * @param {string} currentVideoId - El ID del video que ya se está viendo.
   */
  function populateVideoCatalog(data, currentVideoId) {
    // Limpiamos los placeholders
    dom.catalogGrid.innerHTML = ''; 
    
    // Convertimos el objeto en un array y lo invertimos (más nuevos primero)
    const allVideos = Object.entries(data).reverse();

    let count = 0;
    const MAX_VIDEOS = 24; // Mostrar solo los últimos 24 para velocidad

    allVideos.forEach(([videoKey, video]) => {
      // No mostrar el video actual en el catálogo "Últimos Añadidos"
      if (videoKey === currentVideoId) return;

      // Limitar la cantidad de videos en la página principal
      if (count >= MAX_VIDEOS) return;

      // Crear la tarjeta de video
      const card = document.createElement('a');
      card.href = `/${videoKey}`; // Enlace usa la redirección
      card.className = 'video-card';
      
      // Thumbnail (con placeholder si no hay imagen)
      const thumbnail = document.createElement('div');
      thumbnail.className = 'video-card-thumbnail';
      if (video.imageUrl) {
        thumbnail.style.backgroundImage = `url(${video.imageUrl})`;
      } else {
        thumbnail.textContent = '▶'; // Icono de play simple
      }

      // Título
      const title = document.createElement('div');
      title.className = 'video-card-title';
      title.textContent = video.title.toUpperCase();

      card.appendChild(thumbnail);
      card.appendChild(title);
      dom.catalogGrid.appendChild(card);
      
      count++;
    });
    
    // Si por alguna razón el catálogo está vacío (después de filtrar)
    if (count === 0) {
        dom.catalogTitle.textContent = "No hay más videos en el catálogo.";
    }
  }

  /**
   * TAREA 4: Lógica Principal (Fetch y carga)
   */
  async function main() {
    // 1. Rellenar la comunidad INMEDIATAMENTE
    populateCommunityLinks();

    // 2. Obtener el ID del video actual
    // La regla de _redirects (/* /index.html 200) hace que esto funcione
    const videoId = window.location.pathname.substring(1);

    // 3. Si estamos en la página de inicio (sin ID), mostrar solo el catálogo
    if (!videoId || videoId === 'index.html') {
      handleHomepageLoad();
      return;
    }

    // 4. Si estamos en una página de video, buscar los datos
    try {
      const response = await fetch('data.json');
      if (!response.ok) {
        throw new Error(`Error en la red: ${response.statusText}`);
      }
      const data = await response.json();

      // 5. Rellenar el Video Principal (¡Prioridad!)
      if (!data[videoId]) {
        handleError("❌ Video no encontrado ❌", "El video no existe o fue movido de nuestros archivos.");
        return;
      }
      
      const video = data[videoId];
      populateHero(video);

      // 6. Rellenar el Catálogo (Asíncrono, no bloquea lo principal)
      // Usamos setTimeout 0 para moverlo al final de la cola de ejecución
      setTimeout(() => {
        populateVideoCatalog(data, videoId);
      }, 0);

    } catch (error) {
      console.error('Error al cargar data.json:', error);
      handleError("Error en el Sistema", "⚠️ Error cargando enlaces. Intenta más tarde.");
    }
  }

  // --- Funciones de Utilidad ---

  /**
   * Crea un botón de CTA.
   */
  function createCtaButton(href, text, className) {
    const button = document.createElement('a');
    button.href = href;
    button.target = '_blank'; // Abrir en nueva pestaña
    button.className = `btn-cta ${className}`;
    button.textContent = text;
    return button;
  }

  /**
   * Maneja el estado de "no se encontró video" o error.
   */
  function handleError(title, description) {
    dom.title.classList.remove('loading-placeholder');
    dom.description.classList.remove('loading-placeholder');
    dom.loadingText.style.display = 'none';

    dom.title.textContent = title;
    dom.description.textContent = description;
    document.title = "Error | No Encontrado";
    
    // Ocultar catálogo si hay error
    document.querySelector('.catalog-section').style.display = 'none';
  }

  /**
   * Maneja la carga de la página principal (/)
   * Oculta el "hero" y solo muestra el catálogo.
   */
  async function handleHomepageLoad() {
    dom.hero.style.display = 'none'; // Ocultar sección "hero"
    dom.catalogTitle.textContent = "Catálogo Completo";
    document.title = "Catálogo | Tu Sistema de Descargas";

    // Cargar solo el catálogo
    try {
      const response = await fetch('data.json');
      const data = await response.json();
      setTimeout(() => {
        populateVideoCatalog(data, null); // null = no hay video actual
      }, 0);
    } catch (error) {
      console.error('Error al cargar data.json:', error);
      dom.catalogGrid.innerHTML = '<p style="color: var(--color-text-secondary);">Error al cargar el catálogo.</p>';
    }
  }

  // ¡Ejecutar!
  main();
});