import { html, useState, useCallback, useEffect } from "../lib.js";
import { Button, Icon, Modal, Empty } from "../components/ui/index.js";
import { SoundToggle } from "../components/layout/Header.js";
import { RoomStage } from "../components/room/RoomStage.js";
import { Timer, Progress, FeedbackToast, DetectionLog, HintList } from "../components/game/index.js";
import { useGameEngine } from "../hooks/useGameEngine.js";
import { useUsers } from "../hooks/useStore.js";
import { scenarioById } from "../data/scenarios.js";
import { resultService } from "../services/resultService.js";
import { navigate } from "../hooks/useRoute.js";
import { SCORING } from "../utils/scoring.js";

const ZOOMS = [1, 1.5, 2, 2.6];

function Game({ scenario, player }) {
  const [zoom, setZoom] = useState(0);
  const [confirm, setConfirm] = useState(false);
  const onFinish = useCallback((result) => {
    resultService.save(result);
    navigate(`/sonuc/${result.id}`);
  }, []);
  const g = useGameEngine(scenario, { onFinish, player });
  const lastEvent = g.events[g.events.length - 1];

  useEffect(() => {
    const warn = (e) => { if (g.status === "playing") { e.preventDefault(); e.returnValue = ""; } };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [g.status]);

  const hintButton = html`<${Button} variant="soft" size="sm" icon="bulb" onClick=${g.requestHint} disabled=${!g.canHint}>
    ${g.hints.length >= SCORING.maxHints ? "İpucu kalmadı" : `İpucu (−${SCORING.hint})`}</${Button}>`;

  return html`<div class=${`game ${g.remaining <= 60 && g.status === "playing" ? "game-low" : ""}`}>
    <header class="game-bar">
      <div class="game-title"><strong>Hata Odası</strong><span>${scenario.name} · ${player.name}</span></div>
      <${Timer} remaining=${g.remaining} total=${scenario.timeLimit} />
      <div class="game-stats">
        <${Progress} total=${scenario.errors.length} found=${g.foundIds.length} />
        <div class="game-score"><span>Puan</span><strong>${g.liveScore}</strong></div>
      </div>
    </header>

    <div class="game-main">
      <div class="stage">
        <div class="stage-toolbar">
          <span class="muted"><${Icon} name="search" size=${15} /> Odayı inceleyin, hatalı noktaya tıklayın</span>
          <div class="toolbar-right">
            <span class="toolbar-hint">${hintButton}</span>
            <div class="zoom">
              <button class="icon-btn" onClick=${() => setZoom(Math.max(0, zoom - 1))} disabled=${zoom === 0} title="Uzaklaştır"><${Icon} name="zoomOut" size=${17} /></button>
              <span>${Math.round(ZOOMS[zoom] * 100)}%</span>
              <button class="icon-btn" onClick=${() => setZoom(Math.min(ZOOMS.length - 1, zoom + 1))} disabled=${zoom === ZOOMS.length - 1} title="Yakınlaştır"><${Icon} name="zoomIn" size=${17} /></button>
            </div>
          </div>
        </div>
        <div class="stage-frame">
          <${RoomStage} scenario=${scenario} mode="play" foundIds=${g.foundIds} events=${g.events} onInspect=${g.inspect} zoom=${ZOOMS[zoom]} />
          <div class="stage-toast"><${FeedbackToast} event=${lastEvent} /></div>
          ${g.status !== "playing" && html`<div class="stage-end"><div class="stage-end-card">
            <span class=${`end-icon ${g.endReason === "timeout" ? "warn" : "ok"}`}><${Icon} name=${g.endReason === "timeout" ? "clock" : "check"} size=${30} stroke=${2.5} /></span>
            <h2>${g.endReason === "timeout" ? "Süre doldu" : g.endReason === "complete" ? "Tüm hatalar bulundu" : "Kontrol tamamlandı"}</h2>
            <p>Raporunuz hazırlanıyor…</p>
          </div></div>`}
        </div>
      </div>

      <aside class="game-side">
        <section class="side-box">
          <h4>Hasta</h4>
          <strong>${scenario.patient.name}</strong>
          <span class="muted">${scenario.patient.age} yaş · ${scenario.patient.diagnosis}</span>
          <ul class="side-notes">${scenario.patient.notes.map((n) => html`<li key=${n}>${n}</li>`)}</ul>
        </section>
        <section class="side-box">
          <h4>İpucu <small>${g.hints.length} / ${SCORING.maxHints}</small></h4>
          <${HintList} hints=${g.hints} />
          ${hintButton}
        </section>
        <section class="side-box side-log">
          <h4>Bulunanlar <small>${g.foundIds.length} / ${scenario.errors.length}</small></h4>
          <${DetectionLog} scenario=${scenario} foundIds=${g.foundIds} />
        </section>
        <div class="side-actions">
          <${SoundToggle} />
          <span class="muted">Yanlış: <b>${g.wrongClicks}</b></span>
          <${Button} variant="outline" size="sm" onClick=${() => setConfirm(true)} disabled=${g.status !== "playing"}>Kontrolü bitir</${Button}>
        </div>
      </aside>
    </div>

    <${Modal} open=${confirm && g.status === "playing"} title="Kontrolü bitirmek istiyor musunuz?" onClose=${() => setConfirm(false)}
      actions=${html`<${Button} variant="ghost" onClick=${() => setConfirm(false)}>Devam et</${Button}>
        <${Button} onClick=${() => { setConfirm(false); g.finish("manual"); }}>Bitir ve raporu gör</${Button}>`}>
      <p>${scenario.errors.length - g.foundIds.length} hata henüz bulunmadı. Bulunamayan hatalar raporunuzda gösterilecek.</p>
    </${Modal}>
  </div>`;
}

export function GamePage({ id }) {
  const scenario = scenarioById(id);
  const { current } = useUsers();
  useEffect(() => { if (!current) navigate("/"); }, [current]);
  if (!scenario) return html`<div class="container page"><${Empty} icon="lock" title="Senaryo bulunamadı" action=${html`<${Button} href="#/">Ana sayfa</${Button}>`} /></div>`;
  if (!current) return null;
  return html`<${Game} scenario=${scenario} player=${current} />`;
}
