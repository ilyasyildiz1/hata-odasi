import { html } from "../../lib.js";

// Çizgi ikon seti (24x24). Yeni ikon için PATHS'e bir girdi ekleyin.
const PATHS = {
  bed: "M3 19V7 M3 15h18v4 M21 15v-2a3 3 0 0 0-3-3h-8v5 M6.5 12.5a1.5 1.5 0 1 0 0-.01",
  pill: "M10.5 20.5l10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7z M8.5 8.5l7 7",
  heart: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z M3 12h4l2-3 3 6 2-3h7",
  siren: "M7 18v-6a5 5 0 0 1 10 0v6 M5 21h14 M12 3v2 M4.2 6.2l1.4 1.4 M19.8 6.2l-1.4 1.4",
  scalpel: "M3 21l8.5-8.5 M11.5 12.5L19 5a2.1 2.1 0 0 1 3 3l-7.5 7.5z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  shieldCheck: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M8.5 12l2.5 2.5 4.5-5",
  trophy: "M8 21h8 M12 17v4 M7 4h10v5a5 5 0 0 1-10 0z M17 5h3v2a3 3 0 0 1-3 3 M7 5H4v2a3 3 0 0 0 3 3",
  bolt: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
  target: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0-10 0 M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0-2 0",
  search: "M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0 M20 20l-4-4",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0",
  flag: "M5 22V4 M5 4h13l-2 4.5 2 4.5H5",
  clock: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 7v5l3 2",
  check: "M5 12.5l4.5 4.5L19 7.5",
  x: "M6 6l12 12 M18 6L6 18",
  bulb: "M9 18h6 M10 21h4 M12 3a6 6 0 0 0-4 10.5c.7.7 1 1.5 1 2.5h6c0-1 .3-1.8 1-2.5A6 6 0 0 0 12 3z",
  volume: "M11 5L6 9H3v6h3l5 4z M15.5 8.5a5 5 0 0 1 0 7 M18.5 5.5a9 9 0 0 1 0 13",
  volumeOff: "M11 5L6 9H3v6h3l5 4z M16 9l5 6 M21 9l-5 6",
  user: "M12 8m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M4 21a8 8 0 0 1 16 0",
  users: "M9 8m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0 M1.5 21a7.5 7.5 0 0 1 15 0 M16 4.2a4 4 0 0 1 0 7.6 M22.5 21a7.5 7.5 0 0 0-4.5-6.9",
  chart: "M4 20V11 M10 20V5 M16 20v-6 M22 20H2",
  trend: "M3 17l6-6 4 4 8-8 M15 7h6v6",
  file: "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M14 3v6h6 M8 13h8 M8 17h5",
  download: "M12 3v12 M7 10l5 5 5-5 M4 21h16",
  arrowRight: "M5 12h14 M13 6l6 6-6 6",
  arrowLeft: "M19 12H5 M11 6l-6 6 6 6",
  lock: "M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4",
  medal: "M12 15m-6 0a6 6 0 1 0 12 0a6 6 0 1 0-12 0 M8.5 10L6 2h4l2 5 2-5h4l-2.5 8",
  play: "M7 4.5l12 7.5-12 7.5z",
  alert: "M12 3l10 18H2z M12 10v5 M12 18v.01",
  zoomIn: "M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0 M20 20l-4-4 M11 8v6 M8 11h6",
  zoomOut: "M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0 M20 20l-4-4 M8 11h6",
  refresh: "M21 12a9 9 0 1 1-3-6.7L21 8 M21 3v5h-5",
  trash: "M3 6h18 M8 6V4h8v2 M6 6l1 15h10l1-15",
  stop: "M6 6h12v12H6z",
  clipboard: "M9 3h6v4H9z M9 5H6a1 1 0 0 0-1 1v15h14V6a1 1 0 0 0-1-1h-3 M9 13l2 2 4-4",
  home: "M3 11l9-8 9 8 M5 9.5V21h14V9.5",
  grid: "M4 4h7v7H4z M13 4h7v7h-7z M4 13h7v7H4z M13 13h7v7h-7z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
  plus: "M12 5v14 M5 12h14",
  info: "M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0 M12 11v6 M12 7.5v.01",
  chevronDown: "M6 9l6 6 6-6",
  building: "M4 21V5l8-3 8 3v16 M9 21v-4h6v4 M8 8h2 M14 8h2 M8 12h2 M14 12h2",
};

export function Icon({ name, size = 20, stroke = 2, className = "", title }) {
  const d = PATHS[name] || PATHS.info;
  return html`<svg class=${`icon ${className}`} width=${size} height=${size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth=${stroke} strokeLinecap="round" strokeLinejoin="round"
    aria-hidden=${title ? undefined : "true"} role=${title ? "img" : undefined}>
    ${title && html`<title>${title}</title>`}
    <path d=${d} />
  </svg>`;
}
