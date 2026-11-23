/**
 * GOOGLE APPS SCRIPT - WEBHOOK DE RASTREAMENTO E CAPTAÇÃO DE LEADS
 * Empreendimento: Residencial Jooy Wonder - Campo Grande/MS
 * 
 * Este script recebe acessos de URL (com parâmetros UTM/origem) e cadastros do formulário.
 * Ele cria automaticamente as abas "Acessos" e "Leads" na planilha.
 */

function doPost(e) {
  return handleRequest(e);
}

function doGet(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  var lock = LockService.getScriptLock();
  // Aguarda até 10 segundos para evitar concorrência de escrita simultânea
  lock.tryLock(10000);

  try {
    var data = {};

    // Verifica se os dados vieram via corpo JSON (POST) ou parâmetros de URL (GET/POST)
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var action = (data.action || 'pageview').toLowerCase();
    var timestamp = new Date();
    var formattedDate = Utilities.formatDate(timestamp, "America/Campo_Grande", "dd/MM/yyyy HH:mm:ss");

    if (action === 'lead') {
      // -------------------------------------------------------------
      // REGISTRO DE NOVO LEAD NO FUNIL
      // -------------------------------------------------------------
      var sheetLeads = getOrCreateSheet(ss, "Leads", [
        "Data/Hora",
        "Finalidade",
        "Nome",
        "WhatsApp / Telefone",
        "E-mail",
        "Mensagem / Interesse",
        "Origem (utm_source)",
        "Mídia (utm_medium)",
        "Campanha (utm_campaign)",
        "Conteúdo (utm_content)",
        "Termo (utm_term)",
        "Status do Funil",
        "URL de Origem"
      ], "#1e5e3a"); // Verde corporativo para leads

      var rowLead = [
        formattedDate,
        data.page_type || data.finalidade || "Venda",
        data.nome || "",
        data.whatsapp || data.telefone || "",
        data.email || "",
        data.mensagem || "",
        data.utm_source || data.origem || "direto",
        data.utm_medium || "",
        data.utm_campaign || "",
        data.utm_content || "",
        data.utm_term || "",
        "1. Novo Lead",
        data.url || ""
      ];

      sheetLeads.appendRow(rowLead);

      return jsonResponse({
        status: "success",
        type: "lead",
        message: "Lead registrado com sucesso!"
      });

    } else {
      // -------------------------------------------------------------
      // REGISTRO DE ACESSO / PAGEVIEW COM UTMs
      // -------------------------------------------------------------
      var sheetAcessos = getOrCreateSheet(ss, "Acessos", [
        "Data/Hora",
        "Página",
        "Origem (utm_source)",
        "Mídia (utm_medium)",
        "Campanha (utm_campaign)",
        "Conteúdo (utm_content)",
        "Termo (utm_term)",
        "Referência (ref)",
        "Dispositivo",
        "URL Completa",
        "Referrer",
        "User Agent"
      ], "#1d3557"); // Azul escuro para acessos

      var rowAcesso = [
        formattedDate,
        data.page_type || "venda",
        data.utm_source || data.origem || "direto / orgânico",
        data.utm_medium || "",
        data.utm_campaign || "",
        data.utm_content || "",
        data.utm_term || "",
        data.ref || "",
        data.device || "Desktop",
        data.url || "",
        data.referrer || "",
        data.user_agent || ""
      ];

      sheetAcessos.appendRow(rowAcesso);

      return jsonResponse({
        status: "success",
        type: "pageview",
        message: "Acesso registrado com sucesso!"
      });
    }

  } catch (error) {
    return jsonResponse({
      status: "error",
      message: error.toString()
    });

  } finally {
    lock.releaseLock();
  }
}

/**
 * Cria ou recupera uma aba da planilha com cabeçalho formatado
 */
function getOrCreateSheet(ss, sheetName, headers, headerColor) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    
    // Adiciona o cabeçalho
    sheet.appendRow(headers);
    
    // Formata o cabeçalho
    var headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground(headerColor);
    headerRange.setFontColor("#FFFFFF");
    headerRange.setFontWeight("bold");
    headerRange.setHorizontalAlignment("center");
    
    // Congela a primeira linha
    sheet.setFrozenRows(1);
    
    // Auto-ajuste de colunas
    for (var i = 1; i <= headers.length; i++) {
      sheet.setColumnWidth(i, 160);
    }
  }
  return sheet;
}

/**
 * Helper para retornar resposta JSON com cabeçalhos corretos
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
