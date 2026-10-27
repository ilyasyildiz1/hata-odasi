import { html, useEffect } from "../lib.js";
import { Button, Icon, Card, Empty } from "../components/ui/index.js";
import { scenarioById } from "../data/scenarios.js";
import { SCORING, pointsFor } from "../utils/scoring.js";
import { useUsers } from "../hooks/useStore.js";
import { navigate } from "../hooks/useRoute.js";
import { formatDuration } from "../utils/format.js";

export function BriefingPage({ id }) {
  const scenario = scenarioById(id);
  const { current } = useUsers();
  useEffect(() => { if (!current) navigate("/"); }, [current]);
  if (!scenario) return html`<div class="container page"><${Empty} icon="lock" title="Senaryo bulunamadı" action=${html`<${Button} href="#/">Ana sayfa</${Button}>`} /></div>`;
  if (!current) return null;
  const p = scenario.patient;
  const normal = pointsFor(scenario.errors.find((e) => !e.critical), scenario.errors);
  const critical = pointsFor(scenario.errors.find((e) => e.critical) || scenario.errors[0], scenario.errors);

  return html`<div class="container page narrow">
    <a class="back-link" href="#/"><${Icon} name="arrowLeft" size=${16} /> Ana sayfa</a>
    <div>
      <div class="overline">Oyun talimatları</div>
      <h1 class="page-title">${scenario.name}</h1>
      <p class="muted">${scenario.description}</p>
    </div>

    <div class="brief-grid">
      <${Card} className="handover">
        <h3>Nöbet devir notu</h3>
        <div class="patient-box">
          <span class="patient-icon"><${Icon} name="bed" size=${22} /></span>
          <div><strong>${p.name}</strong><span>${p.age} yaş · Oda ${p.room}</span></div>
        </div>
        <p class="diag"><b>Tanı:</b> ${p.diagnosis}</p>
        <ul class="notes">${p.notes.map((n) => html`<li key=${n}>${n}</li>`)}</ul>
        <div class="mission">Gece vardiyasını devraldınız. Odada <b>${scenario.errors.length} hata</b> var. Süreniz dolmadan bulabildiğiniz kadarını bulun.</div>
      </${Card}>

      <${Card}>
        <h3>Kurallar</h3>
        <ul class="rules">
          <li>Hatalı olduğunu düşündüğünüz nesneye <b>tıklayın</b>. Bazı hatalar küçük ayrıntılardadır; yakınlaştırmayı kullanın.</li>
          <li>Aynı noktada birden fazla hata olabilir.</li>
          <li>Hatasız bir noktaya tıklamak puan düşürür.</li>
          <li>Takıldığınızda en fazla ${SCORING.maxHints} ipucu alabilirsiniz.</li>
        </ul>
        <table class="score-table"><tbody>
          <tr><td>Doğru tespit</td><td class="pos">+${normal}</td></tr>
          <tr><td>Kritik hata</td><td class="pos">+${critical}</td></tr>
          <tr><td>Yanlış tıklama</td><td class="neg">−${SCORING.wrongClick}</td></tr>
          <tr><td>İpucu</td><td class="neg">−${SCORING.hint}</td></tr>
          <tr><td>Süre bonusu (tümü bulunursa)</td><td>0–${SCORING.timeBonusMax}</td></tr>
        </tbody></table>
        <${Button} size="lg" className="w-full" icon="play" onClick=${() => navigate(`/oyun/${scenario.id}`)}>Oyunu başlat · ${formatDuration(scenario.timeLimit)}</${Button}>
        <p class="fine">Oyuncu: ${current.name}</p>
      </${Card}>
    </div>
  </div>`;
}
