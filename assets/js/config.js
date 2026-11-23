/**
 * CONFIGURAÇÃO CENTRALIZADA DO PROJETO - JOOY WONDER
 * Altere aqui as configurações globais de rastreamento, GTM, WhatsApp e Google Sheets.
 */

const CONFIG = {
  // Identificador do Google Tag Manager (Substitua pelo seu ID se tiver, ex: 'GTM-XXXXXXX')
  GTM_ID: 'GTM-MDQLG6R3',

  // URL do Webhook do Google Apps Script gerada na sua planilha
  // Cole aqui a URL gerada seguindo o arquivo google-apps-script/INSTRUCOES_PLANILHA.md
  GOOGLE_SHEET_WEBAPP_URL: 'https://script.google.com/macros/s/AKfycbyNcRjSqM3zRA70lIfGYDiCHXUJFRUt_FlP-rTpv3c6DyXHTRf9lMgLI9ZU_74jD2Q/exec',

  // Dados de Contato e WhatsApp
  WHATSAPP_NUMBER: '5519981920044', // Formato internacional sem caracteres especiais
  WHATSAPP_DISPLAY: '(19) 98192-0044',

  // Valores e Detalhes
  PRECO_VENDA: 'R$ 480.000',
  PRECO_ALUGUEL: 'R$ 2.000',
  VALOR_CONDOMINIO: 'R$ 376',
  
  // Mensagens Pré-formatadas para o WhatsApp
  MENSAGEM_VENDA: 'Olá! Vi o anúncio de VENDA do apartamento no Residencial Jooy Wonder (R$ 480 mil) e gostaria de agendar uma visita e tirar dúvidas.',
  MENSAGEM_ALUGUEL: 'Olá! Vi o anúncio de ALUGUEL do apartamento no Residencial Jooy Wonder (R$ 2.000/mês + cond. R$ 376) e gostaria de mais informações.',

  // Mensagem padrão ao clicar no botão do WhatsApp após preencher o formulário
  MENSAGEM_LEAD_WHATSAPP: function(tipo, nome) {
    return `Olá! Sou ${nome}, acabei de preencher o formulário na página de ${tipo} do Jooy Wonder e gostaria de atendimento.`;
  }
};
