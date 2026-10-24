from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os

def draw_phone_icon(draw, x, y, size=20, fill=(255, 255, 255, 255)):
    # Draw simple clean handset outline
    # Receiver shape
    draw.rounded_rectangle([(x, y+2), (x+size, y+size-2)], radius=4, outline=fill, width=2)
    draw.ellipse([(x+4, y+6), (x+8, y+10)], fill=fill)
    draw.ellipse([(x+size-8, y+size-10), (x+size-4, y+size-6)], fill=fill)

def create_og_image():
    W, H = 1200, 630
    card = Image.new("RGBA", (W, H), (6, 32, 35, 255))
    draw = ImageDraw.Draw(card)

    # 1. Background gradient
    for y in range(H):
        r = int(5 + (12 - 5) * (y / H))
        g = int(28 + (58 - 28) * (y / H))
        b = int(32 + (64 - 32) * (y / H))
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Subtle decorative circular glow in top-left and bottom-right
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    g_draw = ImageDraw.Draw(glow)
    g_draw.ellipse([(-100, -100), (450, 450)], fill=(14, 101, 92, 40))
    g_draw.ellipse([(800, 300), (1350, 750)], fill=(40, 150, 114, 30))
    card = Image.alpha_composite(card, glow)
    draw = ImageDraw.Draw(card)

    # 2. Right side: Doctors Team Photo
    doc_img_path = "public/doctors-team.jpeg"
    if os.path.exists(doc_img_path):
        doc_img = Image.open(doc_img_path).convert("RGBA")
        
        # Frame dimensions
        dw, dh = 700, 520
        scale = max(dw / doc_img.width, dh / doc_img.height)
        new_size = (int(doc_img.width * scale * 1.06), int(doc_img.height * scale * 1.06))
        resized_doc = doc_img.resize(new_size, Image.Resampling.LANCZOS)
        
        # Crop keeping doctors' heads and upper bodies centered
        left = int((resized_doc.width - dw) * 0.48)
        top = int((resized_doc.height - dh) * 0.04)
        cropped_doc = resized_doc.crop((left, top, left + dw, top + dh))
        
        # Rounded mask
        mask = Image.new("L", (dw, dh), 0)
        ImageDraw.Draw(mask).rounded_rectangle([(0, 0), (dw, dh)], radius=20, fill=255)
        
        # Glowing border card
        border_img = Image.new("RGBA", (dw + 8, dh + 8), (45, 212, 191, 180))
        border_mask = Image.new("L", (dw + 8, dh + 8), 0)
        ImageDraw.Draw(border_mask).rounded_rectangle([(0, 0), (dw + 8, dh + 8)], radius=24, fill=255)
        
        pos_x, pos_y = 460, 55
        card.paste(border_img, (pos_x - 4, pos_y - 4), border_mask)
        card.paste(cropped_doc, (pos_x, pos_y), mask)
        
        # Bottom caption bar
        cap_h = 52
        caption_box = Image.new("RGBA", (dw, cap_h), (5, 28, 30, 240))
        c_draw = ImageDraw.Draw(caption_box)
        try:
            c_font = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 18)
        except:
            c_font = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 18)
        c_text = "Specialist MD Physicians & 24x7 Critical Care Team"
        c_draw.text((dw // 2, cap_h // 2), c_text, fill=(240, 253, 250, 255), font=c_font, anchor="mm")
        
        c_mask = Image.new("L", (dw, cap_h), 0)
        ImageDraw.Draw(c_mask).rounded_rectangle([(0, 0), (dw, cap_h)], radius=20, corners=(False, False, True, True), fill=255)
        card.paste(caption_box, (pos_x, pos_y + dh - cap_h), c_mask)

    # 3. Top-left: Pulse Hospital Logo
    logo_path = "public/logo-full.png"
    if os.path.exists(logo_path):
        logo = Image.open(logo_path).convert("RGBA")
        target_lw = 370
        target_lh = int(logo.height * (target_lw / logo.width))
        logo_resized = logo.resize((target_lw, target_lh), Image.Resampling.LANCZOS)
        
        # Crisp white badge backing
        badge_w, badge_h = 400, target_lh + 22
        logo_bg = Image.new("RGBA", (badge_w, badge_h), (255, 255, 255, 255))
        logo_bg_mask = Image.new("L", (badge_w, badge_h), 0)
        ImageDraw.Draw(logo_bg_mask).rounded_rectangle([(0, 0), (badge_w, badge_h)], radius=16, fill=255)
        
        card.paste(logo_bg, (40, 42), logo_bg_mask)
        card.paste(logo_resized, (55, 42 + 11), logo_resized)

    # 4. Typography
    try:
        font_headline = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 33)
        font_subhead = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 19)
        font_body = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 17)
        font_body_bold = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 17)
        font_emergency = ImageFont.truetype("C:/Windows/Fonts/segoeuib.ttf", 21)
        font_footer = ImageFont.truetype("C:/Windows/Fonts/segoeui.ttf", 14)
    except:
        font_headline = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 33)
        font_subhead = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 19)
        font_body = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 17)
        font_body_bold = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 17)
        font_emergency = ImageFont.truetype("C:/Windows/Fonts/arialbd.ttf", 21)
        font_footer = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 14)

    y_cursor = 175

    # Main Headline
    draw.text((42, y_cursor), "24x7 Critical Care &", fill=(255, 255, 255, 255), font=font_headline)
    draw.text((42, y_cursor + 40), "Emergency Hospital", fill=(45, 212, 191, 255), font=font_headline)
    
    y_cursor += 100

    # Location Subhead
    draw.text((42, y_cursor), "City Centre, Shamlaji Road, Modasa", fill=(203, 213, 225, 255), font=font_subhead)

    y_cursor += 42

    # Key Infrastructure Highlights with custom drawn check circles
    features = [
        "30+ Bed ICU & Ventilators",
        "In-House High-Speed CT Scan",
        "24x7 Dialysis Unit",
        "Modular Operation Theatres"
    ]
    
    for feat in features:
        # Green circle with white tick
        cx, cy = 52, y_cursor + 11
        draw.ellipse([(cx - 9, cy - 9), (cx + 9, cy + 9)], fill=(34, 197, 94, 255))
        # Draw checkmark lines
        draw.line([(cx - 4, cy), (cx - 1, cy + 3)], fill=(255, 255, 255, 255), width=2)
        draw.line([(cx - 1, cy + 3), (cx + 5, cy - 3)], fill=(255, 255, 255, 255), width=2)
        
        draw.text((70, y_cursor), feat, fill=(241, 245, 249, 255), font=font_body)
        y_cursor += 31

    # Emergency Contact Button (Left bottom)
    y_cursor += 15
    pill_w, pill_h = 390, 56
    pill_bg = Image.new("RGBA", (pill_w, pill_h), (225, 29, 72, 255)) # Vibrant Medical Red
    pill_mask = Image.new("L", (pill_w, pill_h), 0)
    ImageDraw.Draw(pill_mask).rounded_rectangle([(0, 0), (pill_w, pill_h)], radius=14, fill=255)
    card.paste(pill_bg, (40, y_cursor), pill_mask)

    # Emergency text inside pill
    draw.text((64, y_cursor + 14), "Call 24x7: 95120 45641", fill=(255, 255, 255, 255), font=font_emergency)

    # 5. Bottom Status Strip
    bottom_y = 598
    draw.line([(0, bottom_y), (W, bottom_y)], fill=(255, 255, 255, 30), width=1)
    
    # Left tag
    draw.text((42, 606), "Pulse Hospital & I.C.U · Modasa, Arvalli, Gujarat", fill=(148, 163, 184, 255), font=font_footer)
    # Right tag
    draw.text((W - 42, 606), "Book OPD on WhatsApp & Web: bluenovatechin.github.io/Pulse-Hospital", fill=(45, 212, 191, 255), font=font_footer, anchor="ra")

    # Save JPG & PNG
    rgb_card = card.convert("RGB")
    rgb_card.save("public/og-image.jpg", "JPEG", quality=94, optimize=True)
    card.save("public/og-image.png", "PNG", optimize=True)
    print("Regenerated public/og-image.jpg and public/og-image.png")

if __name__ == "__main__":
    create_og_image()
