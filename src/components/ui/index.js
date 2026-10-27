import { html } from "../../lib.js";
import { Icon } from "./Icon.js";
import { initials } from "../../utils/format.js";
import { categoryById } from "../../data/categories.js";

export { Icon };

export function Button({ variant = "primary", size = "md", icon, iconRight, href, onClick, disabled, children, className = "", type = "button", title }) {
  const cls = `btn btn-${variant} btn-${size} ${className}`;
  const inner = html`${icon && html`<${Icon} name=${icon} size=${size === "lg" ? 20 : 18} />`}<span>${children}</span>${iconRight && html`<${Icon} name=${iconRight} size=${size === "lg" ? 20 : 18} />`}`;
  if (href) return html`<a class=${cls} href=${href} title=${title}>${inner}</a>`;
  return html`<button type=${type} class=${cls} onClick=${onClick} disabled=${disabled} title=${title}>${inner}</button>`;
}

export const Card = ({ className = "", children, as = "section" }) =>
  html`<${as} class=${`card ${className}`}>${children}</${as}>`;

export const CardHeader = ({ title, subtitle, icon, actions }) => html`
  <header class="card-header">
    ${icon && html`<span class="card-icon"><${Icon} name=${icon} size=${18} /></span>`}
    <div class="card-heading"><h3>${title}</h3>${subtitle && html`<p>${subtitle}</p>`}</div>
    ${actions && html`<div class="card-actions">${actions}</div>`}
  </header>`;

export const Chip = ({ tone = "neutral", icon, children }) =>
  html`<span class=${`chip chip-${tone}`}>${icon && html`<${Icon} name=${icon} size=${14} />`}${children}</span>`;

export function ProgressBar({ value, max = 100, tone = "navy", label, showValue = true, suffix = "%" }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return html`<div class="pbar">
    ${label && html`<span class="pbar-label">${label}</span>`}
    <div class="pbar-track" role="progressbar" aria-valuenow=${value} aria-valuemin="0" aria-valuemax=${max}>
      <div class=${`pbar-fill tone-${tone}`} style=${{ width: `${pct}%` }}></div>
    </div>
    ${showValue && html`<span class="pbar-value">${suffix === "%" ? `%${Math.round(value)}` : `${value}${suffix}`}</span>`}
  </div>`;
}

export const Stat = ({ label, value, sub, icon, tone = "navy" }) => html`
  <div class=${`stat tone-${tone}`}>
    <div class="stat-top">${icon && html`<span class="stat-icon"><${Icon} name=${icon} size=${16} /></span>`}<span class="stat-label">${label}</span></div>
    <div class="stat-value">${value}</div>
    ${sub && html`<div class="stat-sub">${sub}</div>`}
  </div>`;

export const Avatar = ({ name, size = 36 }) =>
  html`<span class="avatar" style=${{ width: size, height: size, fontSize: size * 0.38 }}>${initials(name)}</span>`;

export const PageHeader = ({ overline, title, description, actions }) => html`
  <div class="page-header">
    <div>
      ${overline && html`<div class="overline">${overline}</div>`}
      <h1>${title}</h1>
      ${description && html`<p>${description}</p>`}
    </div>
    ${actions && html`<div class="page-actions">${actions}</div>`}
  </div>`;

export const Empty = ({ icon = "info", title, text, action }) => html`
  <div class="empty">
    <span class="empty-icon"><${Icon} name=${icon} size=${26} /></span>
    <h3>${title}</h3>${text && html`<p>${text}</p>`}${action}
  </div>`;

export function Modal({ open, title, children, actions, onClose }) {
  if (!open) return null;
  return html`<div class="modal-backdrop" onClick=${(e) => e.target === e.currentTarget && onClose?.()}>
    <div class="modal" role="dialog" aria-modal="true" aria-label=${title}>
      <h3>${title}</h3>
      <div class="modal-body">${children}</div>
      <div class="modal-actions">${actions}</div>
    </div>
  </div>`;
}

/** Kategori rengini otomatik kullanan etiket. */
export function CatChip({ id, short = false }) {
  const c = categoryById(id);
  if (!c) return null;
  return html`<span class="chip chip-cat" style=${{ color: c.color, background: `${c.color}14`, borderColor: `${c.color}33` }}>${short ? c.short : c.name}</span>`;
}
