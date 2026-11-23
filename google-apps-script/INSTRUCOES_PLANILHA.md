# 📊 Manual de Integração com Google Sheets (Gratuito)

Este guia explica como ativar o registro automático de acessos e leads na sua planilha do Google Sheets.

---

## 🚀 Passo a Passo de Instalação (Leva apenas 2 minutos)

1. **Crie uma nova Planilha no Google:**
   - Acesse [Google Sheets](https://sheets.new) e crie uma planilha em branco.
   - Dê um nome a ela, por exemplo: `Leads & Acessos - Jooy Wonder`.

2. **Abra o Editor de Scripts:**
   - No menu superior da planilha, clique em **Extensões** > **Apps Script**.

3. **Cole o Código:**
   - Apague qualquer código que estiver no editor (`function myFunction() { ... }`).
   - Abra o arquivo `google-apps-script/Code.gs` deste projeto, copie todo o conteúdo e cole no editor do Apps Script.
   - Clique no ícone de disquete 💾 ou pressione `Ctrl + S` para salvar.

4. **Implante como Aplicativo da Web (Web App):**
   - No canto superior direito da tela do Apps Script, clique no botão azul **Implantar** (ou *Deploy*) > **Nova implantação** (*New deployment*).
   - Clique na engrenagem ⚙️ ao lado de "Selecionar tipo" e escolha **App da Web** (*Web app*).
   - Preencha:
     - **Descrição:** `Webhook Jooy Wonder`
     - **Executar como:** `Eu (seu-email@gmail.com)`
     - **Quem tem acesso:** `Qualquer pessoa` (*Anyone*) — *Importante: esta opção permite que as páginas enviem os acessos e cadastros sem exigir login do visitante.*
   - Clique em **Implantar** (*Deploy*).
   - O Google solicitará que você autorize o acesso (clique em *Revisar permissões*, escolha sua conta Google, clique em *Avançado* e depois em *Acessar [Nome do Projeto] (não seguro)* e clique em *Permitir*).

5. **Copie a URL do App da Web gerada:**
   - O Google fornecerá uma URL que termina com `/exec` (exemplo: `https://script.google.com/macros/s/AKfycbx.../exec`).
   - Copie essa URL.

6. **Cole a URL no arquivo de configuração do projeto:**
   - Abra o arquivo `assets/js/config.js` e cole a sua URL no campo `GOOGLE_SHEET_WEBAPP_URL`:
   ```javascript
   GOOGLE_SHEET_WEBAPP_URL: 'https://script.google.com/macros/s/SUA_URL_AQUI/exec',
   ```

Pronto! As abas **"Acessos"** e **"Leads"** serão criadas sozinhas na sua planilha com colunas formatadas e congeladas no primeiro acesso/cadastro!

---

## 🎯 Como Criar Links Rastreados para Publicar nas Redes Sociais

Você pode adicionar variáveis de rastreamento (`utm_source`, `utm_medium`, `utm_campaign`, etc.) em qualquer link da sua landing page. Veja exemplos prontos:

### Para a Página de Venda (`venda.html`):
- **Instagram Bio:**
  `https://seusite.com.br/venda.html?utm_source=instagram&utm_medium=bio`
- **Instagram Stories:**
  `https://seusite.com.br/venda.html?utm_source=instagram&utm_medium=stories&utm_campaign=black_friday`
- **Anúncio no Facebook/Instagram Ads:**
  `https://seusite.com.br/venda.html?utm_source=meta_ads&utm_medium=cpc&utm_campaign=venda_jooy_wonder`
- **OLX / Portais:**
  `https://seusite.com.br/venda.html?utm_source=olx&utm_medium=classificados`
- **Status do WhatsApp:**
  `https://seusite.com.br/venda.html?utm_source=whatsapp&utm_medium=status`

### Para a Página de Aluguel (`aluguel.html`):
- **Instagram Stories:**
  `https://seusite.com.br/aluguel.html?utm_source=instagram&utm_medium=stories`
- **Grupos do Facebook / WhatsApp:**
  `https://seusite.com.br/aluguel.html?utm_source=facebook_grupos&utm_medium=social`
- **OLX Locação:**
  `https://seusite.com.br/aluguel.html?utm_source=olx&utm_medium=locacao`

---

## 📈 Colunas Gravadas Automaticamente

### Aba `Acessos` (Pageviews):
1. **Data/Hora:** Momento exato em que a pessoa abriu a página.
2. **Página:** Venda ou Aluguel.
3. **Origem (`utm_source`):** Ex: instagram, facebook, olx, google, etc.
4. **Mídia (`utm_medium`):** Ex: stories, bio, feed, status, cpc.
5. **Campanha (`utm_campaign`):** Nome da campanha.
6. **Conteúdo / Termo:** Variações de criativo ou palavras-chave.
7. **Dispositivo:** Mobile ou Desktop.
8. **URL Completa & Referrer:** Para auditoria e confirmação da procedência.

### Aba `Leads` (Funil de Vendas):
1. **Data/Hora:** Horário do preenchimento.
2. **Finalidade:** Venda ou Aluguel.
3. **Nome:** Nome do interessado.
4. **WhatsApp / Telefone:** Contato com DDD formatado.
5. **E-mail:** E-mail fornecido.
6. **Mensagem / Interesse:** Dúvidas ou mensagem enviada.
7. **Origem & Campanha:** Mostra exatamente qual post/rede gerou o lead!
8. **Status do Funil:** Inicia como `"1. Novo Lead"`, permitindo que você altere depois para `"2. Em Contato"`, `"3. Visita Agendada"`, `"4. Proposta"`, etc.
