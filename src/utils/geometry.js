// Tıklama noktasının hata/nesne alanlarıyla kesişimini hesaplar.
const PAD = 6;

export const inArea = (p, a, pad = PAD) =>
  p.x >= a.x - pad && p.x <= a.x + a.width + pad && p.y >= a.y - pad && p.y <= a.y + a.height + pad;

export const hitItem = (p, items) => items.find((it) => it.areas.some((a) => inArea(p, a)));

/** Bir öğenin tüm alanlarını kapsayan dikdörtgen. */
export function bounds(areas) {
  const x = Math.min(...areas.map((a) => a.x));
  const y = Math.min(...areas.map((a) => a.y));
  const x2 = Math.max(...areas.map((a) => a.x + a.width));
  const y2 = Math.max(...areas.map((a) => a.y + a.height));
  return { x, y, width: x2 - x, height: y2 - y, cx: (x + x2) / 2, cy: (y + y2) / 2 };
}
