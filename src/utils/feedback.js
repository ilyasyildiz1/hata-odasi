// Oyuncunun gerçek performansına göre eğitimsel geri bildirim üretir.
import { CATEGORIES, categoryById } from "../data/categories.js";
import { SCORING } from "./scoring.js";

/**
 * @returns {{summary:string, strengths:string[], improvements:string[], recommendations:{title:string,text:string}[]}}
 */
export function buildFeedback(result, scenario) {
  const strengths = [];
  const improvements = [];
  const cats = CATEGORIES.filter((c) => result.category_scores[c.id] !== undefined);
  const strong = cats.filter((c) => result.category_scores[c.id] >= 80);
  const weak = cats.filter((c) => result.category_scores[c.id] < 60);
  const mid = cats.filter((c) => result.category_scores[c.id] >= 60 && result.category_scores[c.id] < 80);

  if (strong.length) {
    const names = strong.map((c) => c.name.toLocaleLowerCase("tr-TR"));
    strengths.push(`Performansınız özellikle ${joinTr(names)} alan${strong.length > 1 ? "larında" : "ında"} güçlüdür.`);
    strong.slice(0, 2).forEach((c) => strengths.push(c.strength));
  }
  weak.forEach((c) => improvements.push(`${c.name} kategorisinde gelişim fırsatı bulunmaktadır. ${c.improvement}`));
  mid.forEach((c) => improvements.push(`${c.name} kategorisinde iyi bir temeliniz var; kaçırılan maddeleri gözden geçirerek bu alanı güçlendirebilirsiniz.`));

  const missedCritical = scenario.errors.filter((e) => e.critical && result.missed_errors.includes(e.id));
  if (missedCritical.length) {
    improvements.unshift(`Kritik öneme sahip ${missedCritical.length} hata tespit edilemedi (${missedCritical.map((e) => e.title.toLocaleLowerCase("tr-TR")).join(", ")}). Bu hatalar doğrudan ciddi hasta zararına yol açabileceğinden öncelikli olarak ele alınmalıdır.`);
  } else if (scenario.errors.some((e) => e.critical)) {
    strengths.push("Kritik öneme sahip hataların tamamını tespit ettiniz.");
  }

  if (result.wrong_clicks === 0 && result.found_errors.length > 0) strengths.push("Hiç yanlış tespit yapmadınız; gözleminiz isabetli.");
  else if (result.wrong_clicks >= 6) improvements.push("Yanlış tespit sayınız yüksek. Nesneleri işaretlemeden önce hangi standarda aykırı olduğunu düşünmeniz isabetinizi artıracaktır.");

  if (result.hints_used === 0 && result.found_errors.length >= scenario.errors.length * 0.7) strengths.push("İpucu kullanmadan yüksek oranda tespit yaptınız.");
  if (result.hints_used >= SCORING.maxHints) improvements.push("İpuçlarına sık başvurdunuz. Oda kontrolünü 'baştan ayağa, içten dışa' sistematik bir sırayla yapmanız önerilir.");

  if (result.found_errors.length === scenario.errors.length && result.duration < scenario.timeLimit / 2) strengths.push("Tüm hataları sürenin yarısından kısa sürede buldunuz.");

  const recommendations = scenario.errors
    .filter((e) => result.missed_errors.includes(e.id))
    .sort((a, b) => Number(b.critical) - Number(a.critical))
    .map((e) => ({ title: e.title, category: categoryById(e.category)?.name, text: e.action }));

  const pct = Math.round((result.found_errors.length / scenario.errors.length) * 100);
  const summary = pct === 100
    ? "Odadaki tüm güvenlik risklerini tespit ettiniz. Bu dikkat düzeyi gerçek hasta başı kontrollerinde hasta güvenliğini doğrudan güçlendirir."
    : pct >= 70
      ? `Güvenlik risklerinin %${pct}'ini tespit ettiniz. Kaçırılan maddelerin açıklamalarını inceleyerek kontrol rutininizi tamamlayabilirsiniz.`
      : `Güvenlik risklerinin %${pct}'ini tespit ettiniz. Aşağıdaki önerileri inceleyip simülasyonu tekrar deneyerek gelişiminizi takip edebilirsiniz.`;

  return { summary, strengths, improvements, recommendations };
}

function joinTr(list) {
  if (list.length <= 1) return list[0] || "";
  return `${list.slice(0, -1).join(", ")} ve ${list[list.length - 1]}`;
}
