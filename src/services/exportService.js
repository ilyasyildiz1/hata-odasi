// CSV (Excel) ve PDF dışa aktarma.
import { scenarioById } from "../data/scenarios.js";
import { CATEGORIES, categoryById } from "../data/categories.js";
import { formatDate, formatDuration } from "../utils/format.js";
import { gradeOf, pointsFor } from "../utils/scoring.js";
import { buildFeedback } from "../utils/feedback.js";

function download(filename, blob) {
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement("a"), { href: url, download: filename });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

const csvCell = (v) => {
  const s = String(v ?? "");
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

/** Sonuçları Excel'in Türkçe ayarlarıyla doğrudan açılan CSV olarak indirir. */
export function exportResultsCsv(results, filename = "hata-odasi-sonuclar.csv") {
  const titleOf = (sid, eid) => scenarioById(sid)?.errors?.find((e) => e.id === eid)?.title || eid;
  const header = [
    "player_id", "Oyuncu", "Birim", "Senaryo", "Skor", "Süre (sn)", "Süre", "Bulunan", "Kaçırılan",
    "Bulunan Hatalar", "Kaçırılan Hatalar", "Yanlış Tıklama", "İpucu", "Süre Bonusu",
    ...CATEGORIES.map((c) => `${c.name} %`), "Tarih", "Demo",
  ];
  const rows = results.map((r) => [
    r.player_id, r.player_name, r.unit, scenarioById(r.scenario_id)?.name || r.scenario_id, r.score, r.duration,
    formatDuration(r.duration), r.found_errors.length, r.missed_errors.length,
    r.found_errors.map((e) => titleOf(r.scenario_id, e)).join(" | "),
    r.missed_errors.map((e) => titleOf(r.scenario_id, e)).join(" | "),
    r.wrong_clicks, r.hints_used, r.time_bonus ?? "",
    ...CATEGORIES.map((c) => r.category_scores?.[c.id] ?? ""),
    formatDate(r.created_at), r.demo ? "Evet" : "Hayır",
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n");
  download(filename, new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
}

// ---------------- PDF ----------------
const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export const PAGE_CSS = `
  .pdf-page{width:794px;height:1123px;padding:48px 52px;box-sizing:border-box;background:#fff;color:#0F1B2D;
    font-family:"Nunito Sans",system-ui,-apple-system,"Segoe UI",Arial,sans-serif;font-size:12px;line-height:1.5;position:relative;overflow:hidden}
  .pdf-page *{box-sizing:border-box}
  .pdf-head{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #2F5D53;padding-bottom:14px;margin-bottom:20px}
  .pdf-brand{font-size:24px;font-weight:800;letter-spacing:.04em;color:#2F5D53}
  .pdf-brand small{display:block;font-size:10px;font-weight:600;letter-spacing:.14em;color:#3E8A6E;margin-top:2px}
  .pdf-meta{font-size:10.5px;color:#5B6B82;text-align:right}
  .pdf-h2{font-size:12px;font-weight:800;letter-spacing:.1em;color:#2F5D53;margin:22px 0 10px;text-transform:uppercase}
  .pdf-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
  .pdf-kv{border:1px solid #E3E9F1;border-radius:10px;padding:10px 12px}
  .pdf-kv b{display:block;font-size:20px;color:#2F5D53}
  .pdf-kv span{font-size:9.5px;letter-spacing:.08em;color:#5B6B82;text-transform:uppercase;font-weight:600}
  .pdf-bar{display:grid;grid-template-columns:150px 1fr 44px;align-items:center;gap:10px;margin:7px 0}
  .pdf-track{height:9px;border-radius:5px;background:#EDF1F6;overflow:hidden}
  .pdf-fill{height:100%;border-radius:5px;background:#4F7F72}
  .pdf-list{margin:0;padding:0;list-style:none}
  .pdf-list li{padding:7px 0;border-bottom:1px solid #EEF2F6;display:grid;grid-template-columns:18px 1fr auto;gap:8px}
  .pdf-ok{color:#3E8A6E;font-weight:800}.pdf-no{color:#D64545;font-weight:800}
  .pdf-tag{font-size:9.5px;color:#5B6B82}
  .pdf-note{background:#F5F8FC;border-radius:10px;padding:12px 14px;margin-bottom:8px}
  .pdf-foot{position:absolute;bottom:26px;left:52px;right:52px;font-size:9.5px;color:#94A3B8;display:flex;justify-content:space-between;border-top:1px solid #EEF2F6;padding-top:8px}
`;

export function reportPages(result, scenario, badges) {
  const fb = buildFeedback(result, scenario);
  const grade = gradeOf(result.score);
  const head = `
    <div class="pdf-head">
      <div class="pdf-brand">HATA ODASI<small>HASTA GÜVENLİĞİ SİMÜLASYONU · PERFORMANS RAPORU</small></div>
      <div class="pdf-meta">Oyuncu: <b>${esc(result.player_name)}</b> (${esc(result.unit || "-")})<br>
        Tarih: ${esc(formatDate(result.created_at))}<br>Senaryo: ${esc(scenario.name)}</div>
    </div>`;
  const foot = (n) => `<div class="pdf-foot"><span>Hata Odası · Kalite ve Eğitim Birimi</span><span>Sayfa ${n} / 2</span></div>`;
  const cats = CATEGORIES.filter((c) => result.category_scores[c.id] !== undefined).map((c) => `
    <div class="pdf-bar"><span>${esc(c.name)}</span><div class="pdf-track"><div class="pdf-fill" style="width:${result.category_scores[c.id]}%"></div></div><b>%${result.category_scores[c.id]}</b></div>`).join("");
  const item = (e, ok) => `<li><span class="${ok ? "pdf-ok" : "pdf-no"}">${ok ? "✓" : "✕"}</span>
    <div><b>${esc(e.title)}</b>${e.critical ? ' <span class="pdf-no" style="font-size:9px">KRİTİK</span>' : ""}<br><span class="pdf-tag">${esc(categoryById(e.category)?.name)} · ${esc(e.description)}</span></div>
    <span class="pdf-tag">${pointsFor(e, scenario.errors)} puan</span></li>`;
  const found = scenario.errors.filter((e) => result.found_errors.includes(e.id));
  const missed = scenario.errors.filter((e) => result.missed_errors.includes(e.id));

  const page1 = `<div class="pdf-page">${head}
    <div class="pdf-grid">
      <div class="pdf-kv"><span>Toplam puan</span><b>${result.score} <small style="font-size:11px;color:#5B6B82">/ 1000</small></b></div>
      <div class="pdf-kv"><span>Tespit edilen</span><b>${result.found_errors.length} / ${scenario.errors.length}</b></div>
      <div class="pdf-kv"><span>Süre</span><b>${formatDuration(result.duration)}</b></div>
      <div class="pdf-kv"><span>Sonuç</span><b style="font-size:14px;color:${grade.tone === "success" ? "#3E8A6E" : "#C46A12"}">${grade.label}</b></div>
      <div class="pdf-kv"><span>Yanlış tıklama</span><b>${result.wrong_clicks}</b></div>
      <div class="pdf-kv"><span>İpucu</span><b>${result.hints_used}</b></div>
      <div class="pdf-kv"><span>Süre bonusu</span><b>+${result.time_bonus || 0}</b></div>
      <div class="pdf-kv"><span>Rozet</span><b>${badges.length}</b></div>
    </div>
    <div class="pdf-h2">Kategori performansı</div>${cats}
    <div class="pdf-h2">Eğitim değerlendirmesi</div>
    <div class="pdf-note">${esc(fb.summary)}</div>
    ${fb.strengths.slice(0, 3).map((s) => `<div class="pdf-note" style="background:#E9F8F1">✓ ${esc(s)}</div>`).join("")}
    ${fb.improvements.slice(0, 3).map((s) => `<div class="pdf-note" style="background:#FFF4E6">→ ${esc(s)}</div>`).join("")}
    ${badges.length ? `<div class="pdf-h2">Kazanılan rozetler</div><div>${badges.map((b) => `<span style="display:inline-block;border:1px solid #E3E9F1;border-radius:20px;padding:4px 12px;margin:0 6px 6px 0;font-weight:600">${esc(b.title)}</span>`).join("")}</div>` : ""}
    ${foot(1)}</div>`;

  const page2 = `<div class="pdf-page">${head}
    <div class="pdf-h2">Bulunan hatalar (${found.length})</div>
    <ul class="pdf-list">${found.map((e) => item(e, true)).join("") || '<li><span></span><span class="pdf-tag">Bulunan hata yok.</span><span></span></li>'}</ul>
    <div class="pdf-h2">Bulunamayan hatalar (${missed.length})</div>
    <ul class="pdf-list">${missed.map((e) => item(e, false)).join("") || '<li><span></span><span class="pdf-tag">Tüm hatalar bulundu.</span><span></span></li>'}</ul>
    ${fb.recommendations.length ? `<div class="pdf-h2">Eğitim önerileri</div>${fb.recommendations.slice(0, 5).map((r) => `<div class="pdf-note"><b>${esc(r.title)}:</b> ${esc(r.text)}</div>`).join("")}` : ""}
    ${foot(2)}</div>`;
  return [page1, page2];
}

/** PDF raporu oluşturup indirir. Kütüphane yüklenemezse yazdırma penceresine düşer. */
export async function downloadResultPdf(result, badges = []) {
  const scenario = scenarioById(result.scenario_id);
  const pages = reportPages(result, scenario, badges);
  try {
    const [{ jsPDF }, { default: html2canvas }] = await Promise.all([
      import("https://esm.sh/jspdf@2.5.2"),
      import("https://esm.sh/html2canvas@1.4.1"),
    ]);
    const host = document.createElement("div");
    host.style.cssText = "position:fixed;left:-10000px;top:0;z-index:-1";
    host.innerHTML = `<style>${PAGE_CSS}</style>${pages.join("")}`;
    document.body.appendChild(host);
    await document.fonts?.ready;
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const nodes = host.querySelectorAll(".pdf-page");
    for (let i = 0; i < nodes.length; i++) {
      const canvas = await html2canvas(nodes[i], { scale: 2, backgroundColor: "#ffffff", logging: false });
      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 595.28, 841.89);
    }
    host.remove();
    const safe = result.player_name.toLocaleLowerCase("tr-TR").replace(/[^a-z0-9çğıöşü]+/gi, "-");
    pdf.save(`hata-odasi-rapor-${safe}-${result.created_at.slice(0, 10)}.pdf`);
    return true;
  } catch (err) {
    console.warn("PDF kütüphanesi kullanılamadı, yazdırma görünümü açılıyor.", err);
    const w = window.open("", "_blank");
    if (!w) return false;
    w.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Hata Odası Raporu</title>
      <style>${PAGE_CSS} body{margin:0} .pdf-page{page-break-after:always} @page{size:A4;margin:0}</style></head>
      <body>${pages.join("")}<script>setTimeout(()=>print(),300)<\/script></body></html>`);
    w.document.close();
    return true;
  }
}
