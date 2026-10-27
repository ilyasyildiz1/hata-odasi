import { html } from "../../lib.js";
import { Icon, Chip, CatChip } from "../ui/index.js";
import { formatDuration } from "../../utils/format.js";
import { pointsFor } from "../../utils/scoring.js";

export function Timer({ remaining, total }) {
  const low = remaining <= 60;
  return html`<div class=${`timer ${low ? "timer-low" : ""}`} role="timer">
    <${Icon} name="clock" size=${20} />
    <span class="timer-value">${formatDuration(remaining)}</span>
    <div class="timer-bar"><div style=${{ width: `${(remaining / total) * 100}%` }}></div></div>
  </div>`;
}

export function Progress({ total, found }) {
  return html`<div class="progress">
    <div class="progress-head"><span>Bulunan hatalar</span><strong>${found} <small>/ ${total}</small></strong></div>
    <div class="progress-track"><div style=${{ width: `${(found / total) * 100}%` }}></div></div>
  </div>`;
}

/** Sahne üstünde kısa süre beliren geri bildirim kartı */
export function FeedbackToast({ event }) {
  if (!event) return null;
  if (event.type === "found") {
    return html`<div key=${event.id} class=${`ftoast ftoast-ok ${event.error.critical ? "ftoast-critical" : ""}`} role="status">
      <span class="ftoast-icon"><${Icon} name="check" size=${20} stroke=${3} /></span>
      <div class="ftoast-body">
        <div class="ftoast-title">${event.error.critical ? "Kritik hata tespit edildi" : "Hata tespit edildi"}</div>
        <div class="ftoast-text">${event.error.found}</div>
      </div>
      <span class="ftoast-pts">+${event.points}</span>
    </div>`;
  }
  if (event.type === "wrong") {
    return html`<div key=${event.id} class="ftoast ftoast-bad" role="status">
      <span class="ftoast-icon"><${Icon} name="x" size=${18} stroke=${3} /></span>
      <div class="ftoast-body">
        <div class="ftoast-title">Burada bir hata bulunmuyor.</div>
        ${event.object && html`<div class="ftoast-text small">${event.object.name}: ${event.object.note}</div>`}
      </div>
      <span class="ftoast-pts">${event.points}</span>
    </div>`;
  }
  return html`<div key=${event.id} class="ftoast ftoast-info" role="status">
    <span class="ftoast-icon"><${Icon} name="info" size=${18} /></span>
    <div class="ftoast-body"><div class="ftoast-title">Bu bölgedeki hatayı zaten buldunuz.</div></div>
  </div>`;
}

export function DetectionLog({ scenario, foundIds }) {
  const list = foundIds.map((id) => scenario.errors.find((e) => e.id === id));
  if (!list.length) return html`<p class="dlog-empty">Henüz tespit yok. Hatalı olduğunu düşündüğünüz noktaya tıklayın.</p>`;
  return html`<ol class="dlog">
    ${list.map((e, i) => html`<li key=${e.id}>
      <span class="dlog-no">${i + 1}</span>
      <div><div class="dlog-title">${e.title}</div>
        <div class="dlog-meta"><${CatChip} id=${e.category} short />${e.critical && html`<${Chip} tone="danger">Kritik</${Chip}>`}</div></div>
      <span class="dlog-pts">+${pointsFor(e, scenario.errors)}</span>
    </li>`)}
  </ol>`;
}

export function HintList({ hints }) {
  if (!hints.length) return null;
  return html`<div class="hints">
    ${hints.map((h, i) => html`<div key=${i} class=${`hint ${h.resolved ? "hint-done" : ""}`}>
      <${Icon} name=${h.resolved ? "check" : "bulb"} size=${15} /><span>${h.text}</span></div>`)}
  </div>`;
}
