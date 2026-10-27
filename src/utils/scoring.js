// Merkezi puanlama. Tüm skor hesapları yalnızca bu dosyadan yapılır.
import { CATEGORIES } from "../data/categories.js";

export const SCORING = {
  maxScore: 1000,
  detectionMax: 900,   // hataların toplam ağırlığı bu değere ölçeklenir
  timeBonusMax: 100,   // tüm hatalar bulunduğunda kalan süreye göre 0-100
  wrongClick: 25,
  hint: 30,
  maxHints: 3,
  wrongClickCooldownMs: 700, // art arda hızlı tıklamalar tek ceza sayılır
};

const totalWeight = (errors) => errors.reduce((s, e) => s + e.points, 0) || 1;

/** Tek bir hatanın skora katkısı (ölçeklenmiş). */
export function pointsFor(error, errors) {
  return Math.round((error.points / totalWeight(errors)) * SCORING.detectionMax);
}

export function timeBonus({ foundCount, errorCount, remaining, timeLimit }) {
  if (foundCount < errorCount || timeLimit <= 0) return 0;
  return Math.round((Math.max(0, remaining) / timeLimit) * SCORING.timeBonusMax);
}

/**
 * Toplam skoru hesaplar.
 * @returns {{detection:number, penalties:number, bonus:number, total:number}}
 */
export function computeScore({ errors, foundIds, wrongClicks, hintsUsed, remaining, timeLimit, final = false }) {
  const found = errors.filter((e) => foundIds.includes(e.id));
  const weight = found.reduce((s, e) => s + e.points, 0);
  const detection = Math.round((weight / totalWeight(errors)) * SCORING.detectionMax);
  const penalties = wrongClicks * SCORING.wrongClick + hintsUsed * SCORING.hint;
  const bonus = final ? timeBonus({ foundCount: found.length, errorCount: errors.length, remaining, timeLimit }) : 0;
  const total = Math.max(0, Math.min(SCORING.maxScore, detection - penalties + bonus));
  return { detection, penalties, bonus, total };
}

/** Kategori bazlı başarı yüzdesi (ağırlıklı). Senaryoda olmayan kategoriler dönmez. */
export function categoryScores(errors, foundIds) {
  const out = {};
  for (const c of CATEGORIES) {
    const list = errors.filter((e) => e.category === c.id);
    if (!list.length) continue;
    const all = list.reduce((s, e) => s + e.points, 0);
    const got = list.filter((e) => foundIds.includes(e.id)).reduce((s, e) => s + e.points, 0);
    out[c.id] = Math.round((got / all) * 100);
  }
  return out;
}

export const GRADES = [
  { min: 850, id: "ustun", label: "ÜSTÜN BAŞARI", tone: "success", note: "Hasta odasını son derece dikkatli ve sistematik biçimde değerlendirdiniz." },
  { min: 650, id: "basarili", label: "BAŞARILI", tone: "success", note: "Güvenlik risklerinin büyük bölümünü doğru tespit ettiniz." },
  { min: 0, id: "gelisime-acik", label: "GELİŞİME AÇIK", tone: "warning", note: "Bu oturum gelişim alanlarınızı netleştirdi; aşağıdaki öneriler bir sonraki kontrolünüzü güçlendirecek." },
];

export const gradeOf = (score) => GRADES.find((g) => score >= g.min);
