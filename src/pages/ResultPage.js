import { html, useEffect, useState, useMemo } from "../lib.js";
import { Button, Icon, Card, CardHeader, Empty } from "../components/ui/index.js";
import { ScoreRing } from "../components/charts/index.js";
import { CategoryBars, ErrorList, BadgeCard } from "../components/results/index.js";
import { RoomStage } from "../components/room/RoomStage.js";
import { useResults } from "../hooks/useStore.js";
import { scenarioById } from "../data/scenarios.js";
import { gradeOf, computeScore, SCORING } from "../utils/scoring.js";
import { buildFeedback } from "../utils/feedback.js";
import { badgesForResult } from "../utils/achievements.js";
import { formatDuration, formatDate } from "../utils/format.js";
import { downloadResultPdf } from "../services/exportService.js";

function useCountUp(target, ms = 1000) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setV(target); return; }
    let raf; const t0 = performance.now();
    const step = (t) => {
      const k = Math.max(0, Math.min(1, (t - t0) / ms));
      setV(Math.round(target * (1 - Math.pow(1 - k, 3))));
      if (k < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return v;
}

export function ResultPage({ id }) {
  const results = useResults();
  const result = results.find((r) => r.id === id);
  const [pdfBusy, setPdfBusy] = useState(false);
  const scenario = result && scenarioById(result.scenario_id);
  const shown = useCountUp(result?.score || 0);

  const data = useMemo(() => {
    if (!result || !scenario) return null;
    const history = results.filter((r) => r.player_id === result.player_id && r.created_at < result.created_at);
    const badges = badgesForResult(result, history);
    const breakdown = computeScore({
      errors: scenario.errors, foundIds: result.found_errors, wrongClicks: result.wrong_clicks,
      hintsUsed: result.hints_used, remaining: scenario.timeLimit - result.duration, timeLimit: scenario.timeLimit, final: true,
    });
    return { badges, feedback: buildFeedback(result, scenario), breakdown };
  }, [result?.id, results.length]);

  if (!result || !scenario) return html`<div class="container page"><${Empty} icon="file" title="Rapor bulunamadı" text="Bu sonuç silinmiş veya başka bir cihazda kaydedilmiş olabilir." action=${html`<${Button} href="#/skorlar">Skorlar</${Button}>`} /></div>`;

  const grade = gradeOf(result.score);
  const total = scenario.errors.length;
  const { feedback, badges, breakdown } = data;
  const pdf = async () => { setPdfBusy(true); await downloadResultPdf(result, badges); setPdfBusy(false); };

  return html`<div class="container page result">
    <section class="result-head">
      <div class="result-copy">
        <div class="done-mark"><svg viewBox="0 0 52 52"><circle cx="26" cy="26" r="24" /><path d="M15 27l7 7 15-16" /></svg></div>
        <div class="overline">${scenario.name} · ${formatDate(result.created_at)} · ${result.player_name}</div>
        <h1>Oyun tamamlandı</h1>
        <span class=${`grade grade-${grade.tone}`}>${grade.label}</span>
        <p class="muted">${grade.note}</p>
        <div class="big-numbers">
          <div><strong>${result.found_errors.length}<small> / ${total}</small></strong><span>Bulunan hata</span></div>
          <div><strong>${formatDuration(result.duration)}</strong><span>Süre</span></div>
          <div><strong>${result.wrong_clicks}</strong><span>Yanlış tıklama</span></div>
          <div><strong>${result.hints_used}</strong><span>İpucu</span></div>
        </div>
        <div class="actions">
          <${Button} icon="download" onClick=${pdf} disabled=${pdfBusy}>${pdfBusy ? "Hazırlanıyor…" : "PDF raporu indir"}</${Button}>
          <${Button} variant="outline" icon="refresh" href=${`#/talimat/${scenario.id}`}>Tekrar oyna</${Button}>
          <${Button} variant="ghost" icon="trophy" href="#/skorlar">Skorlar</${Button}>
        </div>
      </div>
      <div class="result-ring">
        <${ScoreRing} value=${shown} size=${200} />
        <div class="breakdown">
          <div><span>Tespit</span><b>+${breakdown.detection}</b></div>
          <div><span>Süre bonusu</span><b>+${breakdown.bonus}</b></div>
          <div><span>Cezalar</span><b class="neg">−${result.wrong_clicks * SCORING.wrongClick + result.hints_used * SCORING.hint}</b></div>
        </div>
      </div>
    </section>

    <div class="two-col">
      <${Card}>
        <${CardHeader} icon="target" title="Kategori bazlı analiz" />
        <${CategoryBars} scores=${result.category_scores} />
      </${Card}>
      <${Card} className="feedback">
        <${CardHeader} icon="clipboard" title="Eğitim değerlendirmesi" />
        <p class="fb-summary">${feedback.summary}</p>
        ${feedback.strengths.length > 0 && html`<div class="fb-group fb-good"><h5>Güçlü yönleriniz</h5><ul>${feedback.strengths.map((s) => html`<li key=${s}>${s}</li>`)}</ul></div>`}
        ${feedback.improvements.length > 0 && html`<div class="fb-group fb-grow"><h5>Gelişim alanları</h5><ul>${feedback.improvements.map((s) => html`<li key=${s}>${s}</li>`)}</ul></div>`}
      </${Card}>
    </div>

    <div class="two-col wide-left">
      <${Card}>
        <${CardHeader} icon="search" title="Hangi hatalar bulundu?" subtitle="Doğru uygulamayı görmek için satıra tıklayın" />
        <${ErrorList} scenario=${scenario} result=${result} />
      </${Card}>
      <${Card}>
        <${CardHeader} icon="eye" title="Oda haritası" subtitle="Hataların odadaki yerleri" />
        <${RoomStage} scenario=${scenario} mode="review" foundIds=${result.found_errors} />
        <div class="map-legend"><span><i class="lg-ok"></i> Bulunan</span><span><i class="lg-no"></i> Bulunamayan</span></div>
        ${badges.length > 0 && html`<div class="badge-list">${badges.map((b) => html`<${BadgeCard} key=${b.id} badge=${b} earned=${true} compact />`)}</div>`}
      </${Card}>
    </div>
  </div>`;
}
