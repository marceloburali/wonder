import os
from PIL import Image, ImageDraw, ImageFont, ImageFilter

# Garante a existência do diretório artes
os.makedirs("artes", exist_ok=True)

# Fontes do Windows
FONT_BOLD = "C:/Windows/Fonts/segoeuib.ttf"
FONT_REGULAR = "C:/Windows/Fonts/segoeui.ttf"
if not os.path.exists(FONT_BOLD):
    FONT_BOLD = "C:/Windows/Fonts/arialbd.ttf"
    FONT_REGULAR = "C:/Windows/Fonts/arial.ttf"

def get_font(size, bold=True):
    path = FONT_BOLD if bold else FONT_REGULAR
    try:
        return ImageFont.truetype(path, size)
    except:
        return ImageFont.load_default()

def draw_rounded_rect(draw, bbox, radius, fill, outline=None, width=1):
    draw.rounded_rectangle(bbox, radius=radius, fill=fill, outline=outline, width=width)

def crop_center_cover(img, target_w, target_h):
    orig_w, orig_h = img.size
    aspect_orig = orig_w / orig_h
    aspect_target = target_w / target_h

    if aspect_orig > aspect_target:
        new_w = int(orig_h * aspect_target)
        left = (orig_w - new_w) // 2
        box = (left, 0, left + new_w, orig_h)
    else:
        new_h = int(orig_w / aspect_target)
        top = (orig_h - new_h) // 2
        box = (0, top, orig_w, top + new_h)

    cropped = img.crop(box)
    return cropped.resize((target_w, target_h), Image.Resampling.LANCZOS)

def create_badge(draw, text, xy, font, bg_color, text_color, radius=20, pad_x=20, pad_y=10):
    bbox = font.getbbox(text)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    x, y = xy
    box = [x, y, x + tw + (pad_x * 2), y + th + (pad_y * 2)]
    draw_rounded_rect(draw, box, radius, fill=bg_color)
    draw.text((x + pad_x, y + pad_y - bbox[1]), text, font=font, fill=text_color)
    return box

# ==============================================================================
# 1. ARTE STORIES / REELS / TIKTOK (1080 x 1920) - VENDA
# ==============================================================================
def render_stories_venda():
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), "#0B1329")
    draw = ImageDraw.Draw(img)

    # 1. Top Header Banner
    draw_rounded_rect(draw, [40, 50, W - 40, 110], radius=15, fill="#1E293B", outline="#F59E0B", width=2)
    font_top = get_font(26, bold=True)
    draw.text((W // 2, 80), "RESIDENCIAL JOOY WONDER • CAMPO GRANDE/MS", font=font_top, fill="#FBBF24", anchor="mm")

    # Super Headline
    font_h1 = get_font(52, bold=True)
    draw.text((W // 2, 175), "OPORTUNIDADE DIRETO", font=font_h1, fill="#FFFFFF", anchor="mm")
    font_h2 = get_font(50, bold=True)
    draw.text((W // 2, 235), "COM O PROPRIETÁRIO", font=font_h2, fill="#F59E0B", anchor="mm")

    font_sub = get_font(28, bold=False)
    draw.text((W // 2, 290), "Sem intermediários • Pronto para morar • Vila Planalto", font=font_sub, fill="#94A3B8", anchor="mm")

    # 2. Fotos Reais Compostas Selecionadas pelo Proprietário
    img_foto1 = Image.open("WhatsApp Image 2026-11-23 at 07.54.53 (1).jpeg")
    img_foto2 = Image.open("WhatsApp Image 2026-11-23 at 07.54.24.jpeg")

    # Foto Principal (620x500)
    f1 = crop_center_cover(img_foto1, 620, 500)
    # Foto Secundária (340x500)
    f2 = crop_center_cover(img_foto2, 340, 500)

    # Sombra da moldura das fotos
    draw_rounded_rect(draw, [40, 330, 680, 850], radius=24, fill="#0F172A", outline="#334155", width=3)
    img.paste(f1, (50, 340))

    draw_rounded_rect(draw, [700, 330, 1040, 850], radius=24, fill="#0F172A", outline="#334155", width=3)
    img.paste(f2, (700, 340))

    # 3. Card do Preço em Destaque
    price_box = [50, 870, W - 50, 1070]
    draw_rounded_rect(draw, price_box, radius=24, fill="#1E293B", outline="#F59E0B", width=3)
    
    font_plabel = get_font(28, bold=True)
    draw.text((W // 2, 915), "VALOR DE VENDA", font=font_plabel, fill="#94A3B8", anchor="mm")
    
    font_pval = get_font(72, bold=True)
    draw.text((W // 2, 980), "R$ 480.000", font=font_pval, fill="#FBBF24", anchor="mm")
    
    font_psub = get_font(26, bold=False)
    draw.text((W // 2, 1035), "Condomínio Clube: R$ 376 / mês • 65m² Privativos", font=font_psub, fill="#E2E8F0", anchor="mm")

    # 4. Diferenciais Reais (Grid de 6 Itens)
    features = [
        ("❄️ 3 Ar Split Instalados", "(Sala e nos 2 quartos)"),
        ("🍳 Armários Planejados", "(Cozinha, banheiros e churrasq.)"),
        ("🔥 Aquecedor a Gás", "(Duchas quentes com pressão)"),
        ("🚿 Boxes Blindex nos 2 WCs", "(Acabamento impecável)"),
        ("🥩 Varanda c/ Churrasqueira", "(Privativa a carvão)"),
        ("🏊‍♂️ Lazer Clube Resort", "(Piscinas, academia e quadra)")
    ]

    card_y = 1100
    row_h = 70
    col_w = 475
    font_feat_title = get_font(25, bold=True)
    font_feat_sub = get_font(20, bold=False)

    for i, (title, sub) in enumerate(features):
        col = i % 2
        row = i // 2
        x = 50 if col == 0 else 555
        y = card_y + (row * (row_h + 12))
        
        draw_rounded_rect(draw, [x, y, x + col_w, y + row_h], radius=14, fill="#131F37", outline="#1E293B", width=1)
        draw.text((x + 18, y + 16), title, font=font_feat_title, fill="#FFFFFF")
        draw.text((x + 18, y + 42), sub, font=font_feat_sub, fill="#94A3B8")

    # 5. Localização
    font_loc = get_font(26, bold=True)
    draw.text((W // 2, 1390), "📍 Vila Planalto • A poucos passos da Orla Morena", font=font_loc, fill="#38BDF8", anchor="mm")

    # 6. Rodapé / Botão WhatsApp de Conversão
    wa_box = [50, 1440, W - 50, 1580]
    draw_rounded_rect(draw, wa_box, radius=35, fill="#25D366")
    font_wa_title = get_font(42, bold=True)
    font_wa_sub = get_font(26, bold=True)
    draw.text((W // 2, 1485), "📲 Falar no WhatsApp", font=font_wa_title, fill="#FFFFFF", anchor="mm")
    draw.text((W // 2, 1540), "(19) 98192-0044", font=font_wa_sub, fill="#0B1329", anchor="mm")

    # 7. Link Direto e Instrução para Stories/TikTok
    link_box = [50, 1615, W - 50, 1850]
    draw_rounded_rect(draw, link_box, radius=24, fill="#0F172A", outline="#38BDF8", width=2)
    
    font_link_tip = get_font(28, bold=True)
    draw.text((W // 2, 1660), "🔗 TOQUE NA FIGURINHA DE LINK OU ACESSE:", font=font_link_tip, fill="#38BDF8", anchor="mm")

    font_url = get_font(34, bold=True)
    draw.text((W // 2, 1720), "wonder-jooy.vercel.app/venda.html", font=font_url, fill="#FFFFFF", anchor="mm")

    font_sub_tip = get_font(24, bold=False)
    draw.text((W // 2, 1785), "Tour em Vídeo Completo • 20 Fotos • Ficha Técnica", font=font_sub_tip, fill="#94A3B8", anchor="mm")

    img.save("artes/arte-venda-stories-1080x1920.png", optimize=True)
    print("✅ Gerada: artes/arte-venda-stories-1080x1920.png")

# ==============================================================================
# 2. ARTE STORIES / REELS / TIKTOK (1080 x 1920) - ALUGUEL
# ==============================================================================
def render_stories_aluguel():
    W, H = 1080, 1920
    img = Image.new("RGB", (W, H), "#06231A")
    draw = ImageDraw.Draw(img)

    # 1. Top Header Banner
    draw_rounded_rect(draw, [40, 50, W - 40, 110], radius=15, fill="#0B382A", outline="#10B981", width=2)
    font_top = get_font(26, bold=True)
    draw.text((W // 2, 80), "RESIDENCIAL JOOY WONDER • CAMPO GRANDE/MS", font=font_top, fill="#6EE7B7", anchor="mm")

    # Super Headline
    font_h1 = get_font(52, bold=True)
    draw.text((W // 2, 175), "ALUGUEL DIRETO COM", font=font_h1, fill="#FFFFFF", anchor="mm")
    font_h2 = get_font(50, bold=True)
    draw.text((W // 2, 235), "O PROPRIETÁRIO", font=font_h2, fill="#10B981", anchor="mm")

    font_sub = get_font(28, bold=False)
    draw.text((W // 2, 290), "Sem fiador burocrático • 100% Pronto para Morar", font=font_sub, fill="#A7F3D0", anchor="mm")

    # 2. Fotos Reais Compostas Selecionadas pelo Proprietário
    img_foto1 = Image.open("WhatsApp Image 2026-11-23 at 07.54.53 (1).jpeg")
    img_foto2 = Image.open("WhatsApp Image 2026-11-23 at 07.54.24.jpeg")

    f1 = crop_center_cover(img_foto1, 620, 500)
    f2 = crop_center_cover(img_foto2, 340, 500)

    draw_rounded_rect(draw, [40, 330, 680, 850], radius=24, fill="#0F3B2C", outline="#059669", width=3)
    img.paste(f1, (50, 340))

    draw_rounded_rect(draw, [700, 330, 1040, 850], radius=24, fill="#0F3B2C", outline="#059669", width=3)
    img.paste(f2, (700, 340))

    # 3. Card do Preço em Destaque
    price_box = [50, 870, W - 50, 1070]
    draw_rounded_rect(draw, price_box, radius=24, fill="#0B382A", outline="#10B981", width=3)
    
    font_plabel = get_font(28, bold=True)
    draw.text((W // 2, 915), "VALOR DO ALUGUEL", font=font_plabel, fill="#A7F3D0", anchor="mm")
    
    font_pval = get_font(72, bold=True)
    draw.text((W // 2, 980), "R$ 2.000 / mês", font=font_pval, fill="#34D399", anchor="mm")
    
    font_psub = get_font(26, bold=False)
    draw.text((W // 2, 1035), "Condomínio Clube: R$ 376 / mês • 65m² Privativos", font=font_psub, fill="#FFFFFF", anchor="mm")

    # 4. Diferenciais Reais (Grid de 6 Itens)
    features = [
        ("❄️ 3 Ar Split Instalados", "(Economize milhares de reais)"),
        ("✨ Armários Completos", "(Cozinha, banheiros e sacada)"),
        ("🔥 Aquecedor a Gás", "(Banho quente econômico)"),
        ("🚿 Boxes nos 2 Banheiros", "(Vidro temperado blindex)"),
        ("🥩 Sacada c/ Churrasqueira", "(A carvão, exclusiva)"),
        ("🚗 1 Vaga de Garagem", "(Condomínio clube incluso)")
    ]

    card_y = 1100
    row_h = 70
    col_w = 475
    font_feat_title = get_font(25, bold=True)
    font_feat_sub = get_font(20, bold=False)

    for i, (title, sub) in enumerate(features):
        col = i % 2
        row = i // 2
        x = 50 if col == 0 else 555
        y = card_y + (row * (row_h + 12))
        
        draw_rounded_rect(draw, [x, y, x + col_w, y + row_h], radius=14, fill="#082B20", outline="#0E4A37", width=1)
        draw.text((x + 18, y + 16), title, font=font_feat_title, fill="#FFFFFF")
        draw.text((x + 18, y + 42), sub, font=font_feat_sub, fill="#6EE7B7")

    # 5. Localização
    font_loc = get_font(26, bold=True)
    draw.text((W // 2, 1390), "📍 Vila Planalto • Ao lado da Orla Morena", font=font_loc, fill="#6EE7B7", anchor="mm")

    # 6. Rodapé / Botão WhatsApp de Conversão
    wa_box = [50, 1440, W - 50, 1580]
    draw_rounded_rect(draw, wa_box, radius=35, fill="#25D366")
    font_wa_title = get_font(42, bold=True)
    font_wa_sub = get_font(26, bold=True)
    draw.text((W // 2, 1485), "📲 Falar no WhatsApp", font=font_wa_title, fill="#FFFFFF", anchor="mm")
    draw.text((W // 2, 1540), "(19) 98192-0044", font=font_wa_sub, fill="#06231A", anchor="mm")

    # 7. Link Direto e Instrução para Stories/TikTok
    link_box = [50, 1615, W - 50, 1850]
    draw_rounded_rect(draw, link_box, radius=24, fill="#0B382A", outline="#10B981", width=2)
    
    font_link_tip = get_font(28, bold=True)
    draw.text((W // 2, 1660), "🔗 TOQUE NA FIGURINHA DE LINK OU ACESSE:", font=font_link_tip, fill="#6EE7B7", anchor="mm")

    font_url = get_font(34, bold=True)
    draw.text((W // 2, 1720), "wonder-jooy.vercel.app/aluguel.html", font=font_url, fill="#FFFFFF", anchor="mm")

    font_sub_tip = get_font(24, bold=False)
    draw.text((W // 2, 1785), "Tour em Vídeo Completo • 20 Fotos • Ficha Técnica", font=font_sub_tip, fill="#A7F3D0", anchor="mm")

    img.save("artes/arte-aluguel-stories-1080x1920.png", optimize=True)
    print("✅ Gerada: artes/arte-aluguel-stories-1080x1920.png")

# ==============================================================================
# 3. ARTE FEED INSTAGRAM & FACEBOOK (1080 x 1080) - VENDA
# ==============================================================================
def render_feed_venda():
    W, H = 1080, 1080
    img = Image.new("RGB", (W, H), "#0B1329")
    draw = ImageDraw.Draw(img)

    # Header
    font_tag = get_font(22, bold=True)
    create_badge(draw, "RESIDENCIAL JOOY WONDER • CAMPO GRANDE/MS", (50, 40), font_tag, "#1E293B", "#FBBF24", radius=10, pad_x=16, pad_y=6)

    font_title = get_font(42, bold=True)
    draw.text((50, 95), "VENDA DIRETA C/ PROPRIETÁRIO", font=font_title, fill="#FFFFFF")

    # Fotos Reais Selecionadas
    img_foto1 = Image.open("WhatsApp Image 2026-11-23 at 07.54.53 (1).jpeg")
    img_foto2 = Image.open("WhatsApp Image 2026-11-23 at 07.54.24.jpeg")

    f1 = crop_center_cover(img_foto1, 470, 400)
    f2 = crop_center_cover(img_foto2, 470, 400)

    draw_rounded_rect(draw, [50, 160, 530, 570], radius=18, fill="#1E293B", outline="#334155", width=2)
    img.paste(f1, (55, 165))

    draw_rounded_rect(draw, [550, 160, 1030, 570], radius=18, fill="#1E293B", outline="#334155", width=2)
    img.paste(f2, (555, 165))

    # Preço Card Central
    draw_rounded_rect(draw, [50, 590, W - 50, 750], radius=18, fill="#1E293B", outline="#F59E0B", width=2)
    font_pval = get_font(56, bold=True)
    draw.text((75, 615), "R$ 480.000", font=font_pval, fill="#FBBF24")
    font_pdesc = get_font(26, bold=True)
    draw.text((450, 625), "65m² • 2 Quartos (1 Suíte) • 1 Vaga", font=font_pdesc, fill="#FFFFFF")
    font_psub = get_font(22, bold=False)
    draw.text((450, 670), "Condomínio Clube: R$ 376 / mês • Vila Planalto", font=font_psub, fill="#94A3B8")

    # Diferenciais (Linha de chips)
    chips = ["❄️ 3 Ar Split", "🍳 Planejados", "🔥 Aquecedor a Gás", "🥩 Churrasqueira", "🏊‍♂️ Piscinas"]
    cx = 50
    font_chip = get_font(20, bold=True)
    for c in chips:
        b = create_badge(draw, c, (cx, 775), font_chip, "#131F37", "#FFFFFF", radius=10, pad_x=14, pad_y=8)
        cx = b[2] + 12

    # Bottom Actions
    wa_box = [50, 850, 520, 1010]
    draw_rounded_rect(draw, wa_box, radius=20, fill="#25D366")
    font_w1 = get_font(32, bold=True)
    font_w2 = get_font(24, bold=True)
    draw.text((285, 905), "💬 WhatsApp Direto", font=font_w1, fill="#FFFFFF", anchor="mm")
    draw.text((285, 955), "(19) 98192-0044", font=font_w2, fill="#0B1329", anchor="mm")

    link_box = [550, 850, W - 50, 1010]
    draw_rounded_rect(draw, link_box, radius=20, fill="#0F172A", outline="#38BDF8", width=2)
    font_l1 = get_font(22, bold=True)
    font_l2 = get_font(20, bold=True)
    draw.text((790, 895), "🔗 LINK NA BIO OU ACESSE:", font=font_l1, fill="#38BDF8", anchor="mm")
    draw.text((790, 940), "wonder-jooy.vercel.app/venda.html", font=font_l2, fill="#FFFFFF", anchor="mm")
    font_l3 = get_font(18, bold=False)
    draw.text((790, 980), "Tour em Vídeo + 20 Fotos Reais", font=font_l3, fill="#94A3B8", anchor="mm")

    img.save("artes/arte-venda-feed-1080x1080.png", optimize=True)
    print("✅ Gerada: artes/arte-venda-feed-1080x1080.png")

# ==============================================================================
# 4. ARTE FEED INSTAGRAM & FACEBOOK (1080 x 1080) - ALUGUEL
# ==============================================================================
def render_feed_aluguel():
    W, H = 1080, 1080
    img = Image.new("RGB", (W, H), "#06231A")
    draw = ImageDraw.Draw(img)

    # Header
    font_tag = get_font(22, bold=True)
    create_badge(draw, "RESIDENCIAL JOOY WONDER • CAMPO GRANDE/MS", (50, 40), font_tag, "#0B382A", "#6EE7B7", radius=10, pad_x=16, pad_y=6)

    font_title = get_font(42, bold=True)
    draw.text((50, 95), "ALUGUEL DIRETO C/ PROPRIETÁRIO", font=font_title, fill="#FFFFFF")

    # Fotos Reais Selecionadas
    img_foto1 = Image.open("WhatsApp Image 2026-11-23 at 07.54.53 (1).jpeg")
    img_foto2 = Image.open("WhatsApp Image 2026-11-23 at 07.54.24.jpeg")

    f1 = crop_center_cover(img_foto1, 470, 400)
    f2 = crop_center_cover(img_foto2, 470, 400)

    draw_rounded_rect(draw, [50, 160, 530, 570], radius=18, fill="#0B382A", outline="#059669", width=2)
    img.paste(f1, (55, 165))

    draw_rounded_rect(draw, [550, 160, 1030, 570], radius=18, fill="#0B382A", outline="#059669", width=2)
    img.paste(f2, (555, 165))

    # Preço Card Central
    draw_rounded_rect(draw, [50, 590, W - 50, 750], radius=18, fill="#0B382A", outline="#10B981", width=2)
    font_pval = get_font(54, bold=True)
    draw.text((75, 615), "R$ 2.000 /mês", font=font_pval, fill="#34D399")
    font_pdesc = get_font(26, bold=True)
    draw.text((450, 625), "65m² • 2 Quartos (1 Suíte) • 1 Vaga", font=font_pdesc, fill="#FFFFFF")
    font_psub = get_font(22, bold=False)
    draw.text((450, 670), "Condomínio: R$ 376 / mês • Vila Planalto", font=font_psub, fill="#A7F3D0")

    # Diferenciais (Linha de chips)
    chips = ["❄️ 3 Ar Split", "✨ Planejados", "🔥 Aquecedor a Gás", "🥩 Churrasqueira", "🏊‍♂️ Lazer Clube"]
    cx = 50
    font_chip = get_font(20, bold=True)
    for c in chips:
        b = create_badge(draw, c, (cx, 775), font_chip, "#082B20", "#FFFFFF", radius=10, pad_x=14, pad_y=8)
        cx = b[2] + 12

    # Bottom Actions
    wa_box = [50, 850, 520, 1010]
    draw_rounded_rect(draw, wa_box, radius=20, fill="#25D366")
    font_w1 = get_font(32, bold=True)
    font_w2 = get_font(24, bold=True)
    draw.text((285, 905), "💬 WhatsApp Direto", font=font_w1, fill="#FFFFFF", anchor="mm")
    draw.text((285, 955), "(19) 98192-0044", font=font_w2, fill="#06231A", anchor="mm")

    link_box = [550, 850, W - 50, 1010]
    draw_rounded_rect(draw, link_box, radius=20, fill="#082B20", outline="#10B981", width=2)
    font_l1 = get_font(22, bold=True)
    font_l2 = get_font(20, bold=True)
    draw.text((790, 895), "🔗 LINK NA BIO OU ACESSE:", font=font_l1, fill="#6EE7B7", anchor="mm")
    draw.text((790, 940), "wonder-jooy.vercel.app/aluguel.html", font=font_l2, fill="#FFFFFF", anchor="mm")
    font_l3 = get_font(18, bold=False)
    draw.text((790, 980), "Tour em Vídeo + 20 Fotos Reais", font=font_l3, fill="#A7F3D0", anchor="mm")

    img.save("artes/arte-aluguel-feed-1080x1080.png", optimize=True)
    print("✅ Gerada: artes/arte-aluguel-feed-1080x1080.png")

if __name__ == "__main__":
    print("🎨 Renderizando artes para redes sociais...")
    render_stories_venda()
    render_stories_aluguel()
    render_feed_venda()
    render_feed_aluguel()
    print("🎉 Todas as 4 artes foram geradas com sucesso na pasta artes/!")
