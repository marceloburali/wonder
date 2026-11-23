/**
 * MOTOR DE RASTREAMENTO, UTMs, GTM E GOOGLE SHEETS
 * Jooy Wonder - Venda e Aluguel
 */

(function () {
  'use strict';

  // 1. Extração e Persistência de UTMs
  function getUrlParameters() {
    const params = new URLSearchParams(window.location.search);
    const trackingParams = {};
    const utmKeys = [
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'origem',
      'ref'
    ];

    utmKeys.forEach(key => {
      if (params.has(key)) {
        trackingParams[key] = params.get(key);
      }
    });

    // Se tiver UTMs na URL, salva no sessionStorage
    if (Object.keys(trackingParams).length > 0) {
      sessionStorage.setItem('jooy_tracking_data', JSON.stringify(trackingParams));
      return trackingParams;
    }

    // Se não tiver na URL atual, tenta recuperar do sessionStorage (usuário navegando entre páginas)
    const stored = sessionStorage.getItem('jooy_tracking_data');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.warn('Erro ao ler tracking do sessionStorage', e);
      }
    }

    // Identificação inteligente via document.referrer
    let autoSource = 'direto / organico';
    const ref = document.referrer.toLowerCase();
    if (ref.includes('instagram.com')) autoSource = 'instagram';
    else if (ref.includes('facebook.com') || ref.includes('fb.me')) autoSource = 'facebook';
    else if (ref.includes('google.com')) autoSource = 'google_busca';
    else if (ref.includes('t.co') || ref.includes('twitter.com')) autoSource = 'twitter';
    else if (ref.includes('whatsapp.com')) autoSource = 'whatsapp';
    else if (ref.includes('olx.com.br')) autoSource = 'olx';

    const defaultTracking = {
      utm_source: autoSource,
      utm_medium: 'organico',
      utm_campaign: 'padrao'
    };

    sessionStorage.setItem('jooy_tracking_data', JSON.stringify(defaultTracking));
    return defaultTracking;
  }

  // 2. Detecção de Dispositivo (Mobile / Desktop)
  function getDeviceType() {
    const ua = navigator.userAgent;
    if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
      return 'Tablet';
    }
    if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
      return 'Mobile';
    }
    return 'Desktop';
  }

  // 3. Inicialização e Disparo do GTM (DataLayer)
  window.dataLayer = window.dataLayer || [];

  function pushGtmEvent(eventName, eventData) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
      timestamp: new Date().toISOString()
    });
  }

  // 4. Envio de Dados para a Planilha do Google (Apps Script Web App)
  function sendToGoogleSheets(payload) {
    if (!CONFIG.GOOGLE_SHEET_WEBAPP_URL || CONFIG.GOOGLE_SHEET_WEBAPP_URL.trim() === '') {
      console.log('ℹ️ [Rastreamento] GOOGLE_SHEET_WEBAPP_URL não configurada em config.js. Dados que seriam gravados:', payload);
      return Promise.resolve({ status: 'mock_success' });
    }

    // Google Apps Script requer envio em JSON via POST
    return fetch(CONFIG.GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors', // Evita bloqueios de CORS no navegador
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    }).then(function () {
      console.log('✅ [Rastreamento] Enviado com sucesso para a planilha do Google Sheets');
      return { status: 'success' };
    }).catch(function (error) {
      console.error('❌ [Rastreamento] Erro ao enviar para a planilha:', error);
      throw error;
    });
  }

  // Executa ao carregar a página
  document.addEventListener('DOMContentLoaded', function () {
    const pageType = document.body.dataset.pageType || (window.location.pathname.includes('aluguel') ? 'Aluguel' : 'Venda');
    const tracking = getUrlParameters();
    const device = getDeviceType();

    // A) Disparo no GTM (page_view com dados de campanha)
    pushGtmEvent('page_view_custom', {
      page_type: pageType,
      utm_source: tracking.utm_source || 'direto',
      utm_medium: tracking.utm_medium || '',
      utm_campaign: tracking.utm_campaign || '',
      utm_content: tracking.utm_content || '',
      utm_term: tracking.utm_term || '',
      device_type: device
    });

    // B) Registro Automático na Planilha do Google Sheets (Pageview)
    const pageviewPayload = {
      action: 'pageview',
      page_type: pageType,
      utm_source: tracking.utm_source || 'direto',
      utm_medium: tracking.utm_medium || '',
      utm_campaign: tracking.utm_campaign || '',
      utm_content: tracking.utm_content || '',
      utm_term: tracking.utm_term || '',
      ref: tracking.ref || '',
      device: device,
      url: window.location.href,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent
    };

    sendToGoogleSheets(pageviewPayload);

    // C) Configurar Links de WhatsApp na Página
    setupWhatsAppLinks(pageType, tracking);
  });

  // Configuração dos links e botões de WhatsApp
  function setupWhatsAppLinks(pageType, tracking) {
    const baseMsg = pageType === 'Aluguel' ? CONFIG.MENSAGEM_ALUGUEL : CONFIG.MENSAGEM_VENDA;
    const originTag = tracking.utm_source ? ` (Origem: ${tracking.utm_source})` : '';
    const fullText = encodeURIComponent(`${baseMsg}${originTag}`);
    const whatsappUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${fullText}`;

    // Atualiza todos os botões e links com a classe .btn-whatsapp
    const whatsappElements = document.querySelectorAll('.btn-whatsapp, .whatsapp-link');
    whatsappElements.forEach(el => {
      el.setAttribute('href', whatsappUrl);
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');

      el.addEventListener('click', function () {
        // Disparo no GTM
        pushGtmEvent('whatsapp_click', {
          page_type: pageType,
          utm_source: tracking.utm_source || 'direto',
          utm_campaign: tracking.utm_campaign || '',
          target_number: CONFIG.WHATSAPP_NUMBER
        });
      });
    });

    // Atualiza exibição de telefone formatado na tela
    const phoneDisplayEls = document.querySelectorAll('.whatsapp-display-number');
    phoneDisplayEls.forEach(el => {
      el.textContent = CONFIG.WHATSAPP_DISPLAY;
    });
  }

  // Exporta métodos globais para uso no formulário de leads
  window.WonderTracking = {
    getTracking: getUrlParameters,
    getDevice: getDeviceType,
    pushGtmEvent: pushGtmEvent,
    sendToGoogleSheets: sendToGoogleSheets
  };

})();
