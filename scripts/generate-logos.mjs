// Builds every logo / icon file in public/ from the master artwork.
// Run after replacing brand/pulse-logo.png:  node scripts/generate-logos.mjs
import sharp from 'sharp';

const SRC = 'brand/pulse-logo.png';
const OUT = 'public/';
const CLEAR = { r: 0, g: 0, b: 0, alpha: 0 };
const WHITE = { r: 255, g: 255, b: 255, alpha: 1 };

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height;
const ink = (x, y) => {
  const i = (y * W + x) * 4;
  return data[i + 3] > 20 && !(data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235);
};

// Bounding box of the ink inside columns [x0, x1]
function bbox(x0, x1) {
  let l = W, t = H, r = -1, b = -1;
  for (let y = 0; y < H; y++) for (let x = x0; x <= x1; x++) {
    if (!ink(x, y)) continue;
    l = Math.min(l, x); r = Math.max(r, x); t = Math.min(t, y); b = Math.max(b, y);
  }
  return { left: l, top: t, width: r - l + 1, height: b - t + 1 };
}

// The cross emblem is the first block of ink; the wordmark starts after the first wide gap.
const colHasInk = (x) => { for (let y = 0; y < H; y++) if (ink(x, y)) return true; return false; };
let x = 0;
while (!colHasInk(x)) x++;
while (colHasInk(x)) x++;
const gapStart = x;
while (!colHasInk(x)) x++;
const emblemBox = bbox(0, gapStart - 1);
const nameBox = bbox(x, W - 1);
const fullBox = bbox(0, W - 1);

const crop = (box) => sharp(SRC).extract(box);
const PAD = 2;
const padded = (img) => img.extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: CLEAR });

// Square, transparent emblem (cross only)
const side = Math.max(emblemBox.width, emblemBox.height);
const emblem = await crop(emblemBox)
  .resize(side, side, { fit: 'contain', background: CLEAR })
  .extend({ top: PAD, bottom: PAD, left: PAD, right: PAD, background: CLEAR })
  .png().toBuffer();

// Wordmark on its own, plus a version for dark backgrounds (teal tagline -> white)
const name = await padded(crop(nameBox)).png().toBuffer();
const nameRaw = await sharp(name).raw().toBuffer({ resolveWithObject: true });
const light = Buffer.from(nameRaw.data);
for (let i = 0; i < light.length; i += 4) {
  if (light[i + 2] > light[i]) { light[i] = 255; light[i + 1] = 255; light[i + 2] = 255; }
}
const nameLight = sharp(light, { raw: nameRaw.info });

const full = padded(crop(fullBox));

// Emblem centred on a solid square (app icons need an opaque background)
const tile = async (size, scale, file) => {
  const inner = Math.round(size * scale);
  const mark = await sharp(emblem).resize(inner, inner, { kernel: 'lanczos3' }).toBuffer();
  await sharp({ create: { width: size, height: size, channels: 4, background: WHITE } })
    .composite([{ input: mark, gravity: 'centre' }])
    .flatten({ background: WHITE })
    .png({ compressionLevel: 9 })
    .toFile(OUT + file);
};

const jobs = [
  sharp(emblem).webp({ quality: 92, alphaQuality: 100 }).toFile(OUT + 'logo-emblem.webp'),
  sharp(name).webp({ quality: 92, alphaQuality: 100 }).toFile(OUT + 'logo-name.webp'),
  nameLight.webp({ quality: 92, alphaQuality: 100 }).toFile(OUT + 'logo-name-light.webp'),
  full.clone().png({ compressionLevel: 9 }).toFile(OUT + 'logo-full.png'),
  full.clone().png({ compressionLevel: 9 }).toFile(OUT + 'logo.png'),
  full.clone().webp({ quality: 92, alphaQuality: 100 }).toFile(OUT + 'logo.webp'),
  ...[16, 32, 48].map((s) =>
    sharp(emblem).resize(s, s, { kernel: 'lanczos3' }).png({ compressionLevel: 9 })
      .toFile(OUT + (s === 48 ? 'favicon.png' : `favicon-${s}.png`))),
  tile(180, 0.78, 'apple-touch-icon.png'),
  // 192/512 are also "maskable": keep the cross inside the 80% safe zone
  tile(192, 0.6, 'icon-192.png'),
  tile(512, 0.6, 'icon-512.png')
];
await Promise.all(jobs);

console.log('emblem', emblemBox, 'name', nameBox, 'full', fullBox);
