import { html, useMemo, useRef } from "../../lib.js";
import { ROOM_REGISTRY } from "./rooms/index.js";
import { bounds } from "../../utils/geometry.js";

const VIEW = { w: 1600, h: 900 };

/**
 * Etkileşimli oda sahnesi.
 * mode: "play" (tıklanabilir) | "review" (bulunan/kaçırılan haritası) | "preview" (süs)
 */
export function RoomStage({ scenario, mode = "play", foundIds = [], events = [], onInspect, zoom = 1, className = "" }) {
  const svgRef = useRef(null);
  const markup = useMemo(() => ROOM_REGISTRY[scenario.roomComponent]?.() || "", [scenario.roomComponent]);

  const handleClick = (e) => {
    if (mode !== "play" || !onInspect) return;
    const svg = svgRef.current;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const p = pt.matrixTransform(svg.getScreenCTM().inverse());
    onInspect({ x: Math.round(p.x), y: Math.round(p.y) });
  };

  const errorsById = Object.fromEntries(scenario.errors.map((e) => [e.id, e]));
  const found = foundIds.map((id) => errorsById[id]).filter(Boolean);
  const missed = mode === "review" ? scenario.errors.filter((e) => !foundIds.includes(e.id)) : [];

  return html`<div class=${`room-viewport mode-${mode} ${className}`}>
    <div class="room-canvas" style=${{ width: `${zoom * 100}%` }}>
      <svg ref=${svgRef} viewBox=${`0 0 ${VIEW.w} ${VIEW.h}`} class="room-svg" onClick=${handleClick}
        role=${mode === "play" ? "application" : "img"} aria-label=${`${scenario.name} illüstrasyonu`}>
        <g dangerouslySetInnerHTML=${{ __html: markup }} />

        ${mode === "review" && missed.map((e) => e.areas.map((a, i) => html`
          <rect key=${`m-${e.id}-${i}`} class="area-missed" x=${a.x} y=${a.y} width=${a.width} height=${a.height} rx="10" />`))}

        ${events.filter((ev) => ev.type === "found").map((ev) => ev.error.areas.map((a, i) => html`
          <rect key=${`h-${ev.id}-${i}`} class="area-flash" x=${a.x - 6} y=${a.y - 6} width=${a.width + 12} height=${a.height + 12} rx="12" />`))}

        ${(mode === "play" || mode === "review") && found.map((e, i) => {
          const b = bounds(e.areas);
          return html`<g key=${`pin-${e.id}`} transform=${`translate(${b.cx} ${Math.max(22, b.y - 4)})`}><g class="pin pin-found">
            <circle r="17" /><text y="6" textAnchor="middle">${mode === "review" ? "✓" : foundIds.indexOf(e.id) + 1}</text>
          </g></g>`;
        })}
        ${mode === "review" && missed.map((e) => {
          const b = bounds(e.areas);
          return html`<g key=${`pinm-${e.id}`} transform=${`translate(${b.cx} ${Math.max(22, b.y - 4)})`}><g class="pin pin-missed">
            <circle r="17" /><text y="6" textAnchor="middle">✕</text>
          </g></g>`;
        })}

        ${events.map((ev) => ev.type === "found"
          ? html`<g key=${ev.id} class="burst burst-ok" transform=${`translate(${ev.point.x} ${ev.point.y})`}>
              <circle class="ring" r="26" /><text class="burst-pts" y="-40" textAnchor="middle">+${ev.points}</text></g>`
          : ev.type === "wrong"
            ? html`<g key=${ev.id} class="burst burst-bad" transform=${`translate(${ev.point.x} ${ev.point.y})`}>
                <circle class="ring" r="20" /><path d="M-7 -7 L7 7 M7 -7 L-7 7" /><text class="burst-pts" y="-34" textAnchor="middle">${ev.points}</text></g>`
            : html`<g key=${ev.id} class="burst burst-info" transform=${`translate(${ev.point.x} ${ev.point.y})`}><circle class="ring" r="20" /></g>`)}
      </svg>
    </div>
  </div>`;
}
