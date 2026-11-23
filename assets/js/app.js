/**
 * INTERATIVIDADE, GALERIA LIGHTBOX E FORMULÁRIO DE LEADS
 * Jooy Wonder
 */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  // 1. MÁSCARA AUTOMÁTICA DE TELEFONE (XX) XXXXX-XXXX
  const phoneInputs = document.querySelectorAll('input[type="tel"], #whatsapp, #telefone');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 10) {
        // (XX) XXXXX-XXXX
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (value.length > 6) {
        // (XX) XXXX-XXXX
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d{0,2})$/, '($1');
      }
      e.target.value = value;
    });
  });

  // 2. CONTROLE DO FORMULÁRIO DE LEADS (FUNIL DE VENDAS)
  const leadForm = document.getElementById('lead-form');
  const formFeedback = document.getElementById('form-feedback');
  const btnSubmit = document.getElementById('btn-submit-lead');

  if (leadForm) {
    leadForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      const pageType = document.body.dataset.pageType || 'Venda';
      const nome = document.getElementById('nome').value.trim();
      const whatsapp = document.getElementById('whatsapp').value.trim();
      const email = document.getElementById('email') ? document.getElementById('email').value.trim() : '';
      const mensagem = document.getElementById('mensagem') ? document.getElementById('mensagem').value.trim() : '';

      // Validação básica
      if (!nome || !whatsapp) {
        showFeedback('Por favor, preencha pelo menos seu nome e WhatsApp para contato.', 'error');
        return;
      }

      // Estado de Carregamento
      const originalBtnText = btnSubmit.innerHTML;
      btnSubmit.disabled = true;
      btnSubmit.innerHTML = `
        <span class="spinner"></span> Enviando informações...
      `;

      const tracking = window.WonderTracking ? window.WonderTracking.getTracking() : {};
      const device = window.WonderTracking ? window.WonderTracking.getDevice() : 'Desktop';

      const leadPayload = {
        action: 'lead',
        page_type: pageType,
        nome: nome,
        whatsapp: whatsapp,
        email: email,
        mensagem: mensagem,
        utm_source: tracking.utm_source || 'direto',
        utm_medium: tracking.utm_medium || '',
        utm_campaign: tracking.utm_campaign || '',
        utm_content: tracking.utm_content || '',
        utm_term: tracking.utm_term || '',
        device: device,
        url: window.location.href
      };

      try {
        if (window.WonderTracking) {
          // Envia para o Google Sheets
          await window.WonderTracking.sendToGoogleSheets(leadPayload);

          // Disparo de Evento de Conversão no GTM
          window.WonderTracking.pushGtmEvent('lead_form_submit', {
            lead_type: pageType,
            utm_source: tracking.utm_source || 'direto',
            utm_campaign: tracking.utm_campaign || '',
            has_email: Boolean(email)
          });
        }

        // Feedback de Sucesso
        leadForm.reset();
        btnSubmit.innerHTML = 'Enviado com Sucesso!';

        const directWaMsg = encodeURIComponent(CONFIG.MENSAGEM_LEAD_WHATSAPP(pageType, nome));
        const directWaUrl = `https://wa.me/${CONFIG.WHATSAPP_NUMBER}?text=${directWaMsg}`;

        showFeedback(`
          <div class="success-box">
            <h4>✅ Solicitação Recebida com Sucesso!</h4>
            <p>Obrigado, <strong>${nome}</strong>! Seus dados foram registrados com segurança.</p>
            <p>Para um atendimento imediato, você também pode nos chamar no WhatsApp agora:</p>
            <a href="${directWaUrl}" target="_blank" class="btn btn-whatsapp-direct">
              📲 Falar Imediatamente no WhatsApp (${CONFIG.WHATSAPP_DISPLAY})
            </a>
          </div>
        `, 'success');

      } catch (err) {
        console.error('Erro no envio do lead:', err);
        showFeedback('Ocorreu um erro ao enviar seus dados. Por favor, entre em contato diretamente pelo WhatsApp.', 'error');
      } finally {
        setTimeout(() => {
          btnSubmit.disabled = false;
          btnSubmit.innerHTML = originalBtnText;
        }, 3000);
      }
    });
  }

  function showFeedback(htmlContent, type) {
    if (!formFeedback) return;
    formFeedback.innerHTML = htmlContent;
    formFeedback.className = `form-feedback ${type}`;
    formFeedback.style.display = 'block';
  }

  // 3. GALERIA LIGHTBOX COM 20 FOTOS
  const galleryItems = document.querySelectorAll('.gallery-thumb');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-image');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentPhotoIndex = 0;
  const photoUrls = [];

  galleryItems.forEach((thumb, idx) => {
    const fullSrc = thumb.getAttribute('data-full') || thumb.getAttribute('src');
    photoUrls.push(fullSrc);

    thumb.addEventListener('click', function () {
      openLightbox(idx);
    });
  });

  function openLightbox(index) {
    if (!lightbox || photoUrls.length === 0) return;
    currentPhotoIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Trava scroll da tela de fundo
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    if (!lightboxImg) return;
    lightboxImg.src = photoUrls[currentPhotoIndex];
    if (lightboxCounter) {
      lightboxCounter.textContent = `${currentPhotoIndex + 1} de ${photoUrls.length}`;
    }
  }

  function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photoUrls.length;
    updateLightbox();
  }

  function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photoUrls.length) % photoUrls.length;
    updateLightbox();
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxNext) lightboxNext.addEventListener('click', nextPhoto);
  if (lightboxPrev) lightboxPrev.addEventListener('click', prevPhoto);

  // Fecha clicando no fundo escuro
  if (lightbox) {
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox || e.target.classList.contains('lightbox-backdrop')) {
        closeLightbox();
      }
    });
  }

  // Teclas do Teclado para Navegação
  document.addEventListener('keydown', function (e) {
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });

  // 4. SCROLL SUAVE PARA LINKS ÂNCORA (#)
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

});
