"""
Share image (shown when the website link is shared on WhatsApp, Facebook, etc.)

Builds public/og-image.png and public/og-image.jpg (1200 x 630) from the
logo and each doctor's own portrait in public/doctors/.

Run from the project folder:  python scripts/generate_og_card.py
"""
import os
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
BG = (247, 250, 249)
INK = (9, 52, 55)
TEAL = (14, 101, 92)
MUTED = (82, 116, 113)

# Same order as the website
DOCTORS = [
    ("dr-dipesh-patel", "Dr. Dipesh Patel"),
    ("dr-naimuddin-kazi", "Dr. Naimuddin Kazi"),
    ("dr-paras-patel", "Dr. Paras Patel"),
    ("dr-santosh-prajapati", "Dr. Santosh Prajapati"),
    ("dr-saurabh-goswami", "Dr. Saurabh Goswami"),
    ("dr-pulkit-pandya", "Dr. Pulkit Pandya"),
]


def font(names, size):
    for name in names:
        for folder in ("C:/Windows/Fonts", "/usr/share/fonts/truetype/dejavu", "/Library/Fonts"):
            path = os.path.join(folder, name)
            if os.path.exists(path):
                return ImageFont.truetype(path, size)
    return ImageFont.load_default()


BOLD = ["segoeuib.ttf", "arialbd.ttf", "DejaVuSans-Bold.ttf"]
REGULAR = ["segoeui.ttf", "arial.ttf", "DejaVuSans.ttf"]


def rounded(img, radius):
    mask = Image.new("L", img.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([(0, 0), img.size], radius=radius, fill=255)
    out = Image.new("RGBA", img.size, (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    return out


def create():
    card = Image.new("RGBA", (W, H), BG + (255,))
    draw = ImageDraw.Draw(card)

    # Brand band at the bottom
    draw.rectangle([(0, H - 78), (W, H)], fill=INK)

    # Logo, top left
    logo = Image.open("public/logo-full.png").convert("RGBA")
    lw = 360
    logo = logo.resize((lw, int(logo.height * lw / logo.width)), Image.Resampling.LANCZOS)
    card.alpha_composite(logo, (56, 44))

    # Headline, top right
    f_head = font(BOLD, 30)
    f_sub = font(REGULAR, 21)
    head = "24x7 Emergency, ICU & Specialist Doctors"
    sub = "City Centre, Shamlaji Road, Modasa"
    hw = draw.textlength(head, font=f_head)
    sw = draw.textlength(sub, font=f_sub)
    draw.text((W - 56 - hw, 58), head, font=f_head, fill=INK)
    draw.text((W - 56 - sw, 100), sub, font=f_sub, fill=MUTED)

    # Six portraits in a row, each with its name
    gap = 14
    cw = (W - 2 * 56 - 5 * gap) // 6
    ch = int(cw * 1.42)                      # a little taller than 4:5
    row_h = ch + 36                          # photo + name
    top = 140 + ((H - 78 - 140) - row_h) // 2  # centred between header and band
    f_name = font(BOLD, 15)
    for i, (slug, name) in enumerate(DOCTORS):
        x = 56 + i * (cw + gap)
        photo = Image.open(f"public/doctors/{slug}.webp").convert("RGBA")
        # crop the 4:5 portrait to the taller card, keeping the face centred
        pw = int(photo.height * cw / ch)
        left = (photo.width - pw) // 2
        photo = photo.crop((left, 0, left + pw, photo.height)).resize((cw, ch), Image.Resampling.LANCZOS)
        card.alpha_composite(rounded(photo, 16), (x, top))
        tw = draw.textlength(name, font=f_name)
        draw.text((x + (cw - tw) / 2, top + ch + 10), name, font=f_name, fill=INK)

    # Footer line in the band
    f_band = font(BOLD, 22)
    band = "Pulse Hospital & I.C.U  ·  Appointments & emergency: +91 95120 45641"
    bw = draw.textlength(band, font=f_band)
    draw.text(((W - bw) / 2, H - 52), band, font=f_band, fill=(255, 255, 255))

    card.save("public/og-image.png", "PNG", optimize=True)
    card.convert("RGB").save("public/og-image.jpg", "JPEG", quality=92, optimize=True)
    print("Regenerated public/og-image.png and public/og-image.jpg")


if __name__ == "__main__":
    create()
