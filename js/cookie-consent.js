/* ============================================================
   GRULU · cookie-consent.js
   Banner de cookies + Google Consent Mode v2 + GA4
   ============================================================
   
   INSTRUCCIONES:
   1. Crea tu cuenta en analytics.google.com
   2. Obtén tu ID de medición (formato G-XXXXXXXXXX)
   3. Reemplaza 'G-XXXXXXXXXX' en la constante GA_ID de abajo
   ============================================================ */

const GA_ID = 'G-XXXXXXXXXX'; // ← REEMPLAZA ESTE VALOR CON TU ID DE GA4

/* ---- 1. Google Consent Mode v2: valores por defecto (denegado) ---- */
window.dataLayer = window.dataLayer || [];
function gtag() { dataLayer.push(arguments); }

gtag('consent', 'default', {
  ad_storage:              'denied',
  ad_user_data:            'denied',
  ad_personalization:      'denied',
  analytics_storage:       'denied',
  functionality_storage:   'denied',
  personalization_storage: 'denied',
  security_storage:        'granted', // Siempre permitido (necesario para seguridad)
  wait_for_update:         2000       // Espera 2s antes de enviar datos sin respuesta
});

gtag('set', 'ads_data_redaction', true); // Protección extra: anonimizar datos de anuncios

/* ---- 2. Cargar GA4 de forma condicional ---- */
function loadGA4() {
  if (GA_ID === 'G-XXXXXXXXXX') return; // No cargar si aún no está configurado
  if (document.querySelector('script[data-ga-loaded]')) return; // No cargar dos veces

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  script.setAttribute('data-ga-loaded', 'true');
  document.head.appendChild(script);

  gtag('js', new Date());
  gtag('config', GA_ID, { anonymize_ip: true });
}

/* ---- 3. Actualizar consentimiento ---- */
function setConsent(accepted) {
  const consentValue = accepted ? 'granted' : 'denied';
  gtag('consent', 'update', {
    ad_storage:              consentValue,
    ad_user_data:            consentValue,
    ad_personalization:      consentValue,
    analytics_storage:       consentValue,
    functionality_storage:   consentValue,
    personalization_storage: consentValue,
  });

  // Guardar preferencia en localStorage
  localStorage.setItem('grulu_cookie_consent', accepted ? 'accepted' : 'rejected');
  localStorage.setItem('grulu_cookie_date', new Date().toISOString());

  if (accepted) loadGA4();
}

/* ---- 4. Crear e inyectar el banner ---- */
function createBanner() {
  const banner = document.createElement('div');
  banner.id = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML = `
    <div class="cookie-inner">
      <div class="cookie-text">
        <p class="cookie-title">Este sitio usa cookies</p>
        <p class="cookie-desc">
          Usamos cookies de Google Analytics para entender cómo los visitantes interactúan con la web. 
          Puedes aceptarlas o rechazarlas. Consulta nuestra 
          <a href="cookies.html">Política de Cookies</a>.
        </p>
      </div>
      <div class="cookie-actions">
        <button id="cookie-reject" class="cookie-btn cookie-btn-secondary">Rechazar</button>
        <button id="cookie-accept" class="cookie-btn cookie-btn-primary">Aceptar todo</button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  // Animar entrada después de un pequeño delay
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      banner.classList.add('cookie-visible');
    });
  });

  document.getElementById('cookie-accept').addEventListener('click', () => {
    setConsent(true);
    closeBanner(banner);
  });

  document.getElementById('cookie-reject').addEventListener('click', () => {
    setConsent(false);
    closeBanner(banner);
  });
}

function closeBanner(banner) {
  banner.classList.remove('cookie-visible');
  banner.classList.add('cookie-hidden');
  setTimeout(() => banner.remove(), 400);
}

/* ---- 5. Inicializar ---- */
(function init() {
  const saved = localStorage.getItem('grulu_cookie_consent');
  const savedDate = localStorage.getItem('grulu_cookie_date');

  // Verificar si el consentimiento tiene más de 6 meses (re-preguntar)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const consentExpired = savedDate && new Date(savedDate) < sixMonthsAgo;

  if (saved && !consentExpired) {
    // Ya respondió y no ha expirado: aplicar preferencia directamente
    if (saved === 'accepted') {
      setConsent(true);
    } else {
      setConsent(false);
    }
  } else {
    // Primera visita o expirado: mostrar banner
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => setTimeout(createBanner, 800));
    } else {
      setTimeout(createBanner, 800);
    }
  }
})();
