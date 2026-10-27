// Hafif, bağımlılıksız dashboard grafikleri (tek seri; tooltip'li).
import { html, useState, useRef } from "../../lib.js";

function Tooltip({ tip }) {
  if (!tip) return null;
  return html`<div class="chart-tip" style=${{ left: tip.x, top: tip.y }}>
    <div class="chart-tip-title">${tip.title}</div>
    ${tip.lines.map((l, i) => html`<div key=${i} class="chart-tip-line"><span>${l[0]}</span><b>${l[1]}</b></div>`)}
  </div>`;
}

function useTip() {
  const ref = useRef(null);
  const [tip, setTip] = useState(null);
  const show = (e, title, lines) => {
    const box = ref.current.getBoundingClientRect();
    setTip({ x: e.clientX - box.left, y: e.clientY - box.top, title, lines });
  };
  return { ref, tip, show, hide: () => setTip(null) };
}

/** Yatay çubuk grafik. data: [{label, value, note?, flag?}] */
export function HBarChart({ data, max = 100, format = (v) => `%${v}`, valueLabel = "Oran", tone = "navy" }) {
  const t = useTip();
  return html`<div class="hbar-chart" ref=${t.ref} onMouseLeave=${t.hide}>
    ${data.map((d) => html`<div key=${d.label} class="hbar-row"
        onMouseMove=${(e) => t.show(e, d.label, [[valueLabel, format(d.value)], ...(d.extra || [])])}>
      <div class="hbar-label">${d.label}${d.flag && html`<span class="hbar-flag">${d.flag}</span>`}</div>
      <div class="hbar-track"><div class=${`hbar-fill tone-${d.tone || tone}`} style=${{ width: `${Math.max(1.5, (d.value / max) * 100)}%` }}></div></div>
      <div class="hbar-value">${format(d.value)}</div>
    </div>`)}
    <${Tooltip} tip=${t.tip} />
  </div>`;
}

/** Dikey sütun grafik. */
export function ColumnChart({ data, height = 200, format = (v) => v, valueLabel = "Değer" }) {
  const t = useTip();
  const max = Math.max(1, ...data.map((d) => d.value));
  const nice = Math.ceil(max / 5) * 5;
  return html`<div class="col-chart" ref=${t.ref} onMouseLeave=${t.hide}>
    <div class="col-grid" style=${{ height }}>
      ${[1, 0.5, 0].map((f) => html`<div key=${f} class="col-gridline" style=${{ bottom: `${f * 100}%` }}><span>${Math.round(nice * f)}</span></div>`)}
      <div class="col-bars">
        ${data.map((d) => html`<div key=${d.label} class="col-bar-wrap" onMouseMove=${(e) => t.show(e, d.label, [[valueLabel, format(d.value)]])}>
          <div class="col-bar" style=${{ height: `${(d.value / nice) * 100}%` }}></div>
        </div>`)}
      </div>
    </div>
    <div class="col-labels">${data.map((d) => html`<span key=${d.label}>${d.label}</span>`)}</div>
    <${Tooltip} tip=${t.tip} />
  </div>`;
}

/** Zaman serisi çizgi grafiği (crosshair + tooltip). data: [{label, value, count}] */
export function LineChart({ data, height = 220, min = 0, max = 1000, valueLabel = "Ortalama skor" }) {
  const t = useTip();
  const [hover, setHover] = useState(null);
  if (!data.length) return html`<div class="chart-empty">Veri yok</div>`;
  const W = 640, H = height, P = { l: 40, r: 16, t: 14, b: 26 };
  const lo = Math.max(min, Math.floor((Math.min(...data.map((d) => d.value)) - 60) / 100) * 100);
  const hi = Math.min(max, Math.ceil((Math.max(...data.map((d) => d.value)) + 40) / 100) * 100);
  const x = (i) => P.l + (data.length === 1 ? (W - P.l - P.r) / 2 : (i / (data.length - 1)) * (W - P.l - P.r));
  const y = (v) => P.t + (1 - (v - lo) / Math.max(1, hi - lo)) * (H - P.t - P.b);
  const pts = data.map((d, i) => `${x(i)},${y(d.value)}`).join(" ");
  const ticks = [lo, (lo + hi) / 2, hi];
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    data.forEach((_, i) => { if (Math.abs(x(i) - px) < Math.abs(x(best) - px)) best = i; });
    setHover(best);
    t.show(e, `Hafta: ${data[best].label}`, [[valueLabel, data[best].value], ["Oyun sayısı", data[best].count]]);
  };
  const leave = () => { setHover(null); t.hide(); };
  return html`<div class="line-chart" ref=${t.ref}>
    <svg viewBox=${`0 0 ${W} ${H}`} preserveAspectRatio="none" style=${{ height }} onMouseMove=${onMove} onMouseLeave=${leave}>
      ${ticks.map((v) => html`<g key=${v}><line class="grid" x1=${P.l} x2=${W - P.r} y1=${y(v)} y2=${y(v)} /><text class="axis" x=${P.l - 8} y=${y(v) + 4} textAnchor="end">${Math.round(v)}</text></g>`)}
      <polygon class="area" points=${`${x(0)},${H - P.b} ${pts} ${x(data.length - 1)},${H - P.b}`} />
      <polyline class="line" points=${pts} />
      ${hover !== null && html`<line class="crosshair" x1=${x(hover)} x2=${x(hover)} y1=${P.t} y2=${H - P.b} />`}
      ${data.map((d, i) => html`<circle key=${i} class=${`dot ${hover === i ? "on" : ""}`} cx=${x(i)} cy=${y(d.value)} r=${hover === i ? 5.5 : 3.5} />`)}
      ${data.map((d, i) => (i % Math.ceil(data.length / 8) === 0 || i === data.length - 1) && html`<text key=${`l${i}`} class="axis" x=${x(i)} y=${H - 6} textAnchor="middle">${d.label}</text>`)}
    </svg>
    <${Tooltip} tip=${t.tip} />
  </div>`;
}

/** Halka skor göstergesi. */
export function ScoreRing({ value, max = 1000, size = 190, stroke = 14, label = "PUAN" }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return html`<div class="score-ring" style=${{ width: size, height: size }}>
    <svg width=${size} height=${size} viewBox=${`0 0 ${size} ${size}`}>
      <circle cx=${size / 2} cy=${size / 2} r=${r} class="ring-track" strokeWidth=${stroke} />
      <circle cx=${size / 2} cy=${size / 2} r=${r} class="ring-fill" strokeWidth=${stroke}
        strokeDasharray=${c} strokeDashoffset=${c * (1 - pct)} transform=${`rotate(-90 ${size / 2} ${size / 2})`} />
    </svg>
    <div class="ring-center"><strong>${value}</strong><span>${label}</span><small>/ ${max}</small></div>
  </div>`;
}
