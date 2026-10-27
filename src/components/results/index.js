import { html, useState } from "../../lib.js";
import { Icon, Chip, CatChip, ProgressBar } from "../ui/index.js";
import { CATEGORIES, categoryById } from "../../data/categories.js";
import { pointsFor } from "../../utils/scoring.js";
import { formatDate } from "../../utils/format.js";

export function CategoryBars({ scores }) {
  return html`<div class="catbars">
    ${CATEGORIES.filter((c) => scores[c.id] !== undefined).map((c) => html`<div key=${c.id} class="catbar">
      <div class="catbar-head"><span class="catdot" style=${{ background: c.color }}></span><span>${c.name}</span></div>
      <${ProgressBar} value=${scores[c.id]} tone=${scores[c.id] >= 80 ? "green" : scores[c.id] >= 60 ? "navy" : "orange"} />
    </div>`)}
  </div>`;
}

function ErrorRow({ error, found, scenario }) {
  const [open, setOpen] = useState(false);
  const cat = categoryById(error.category);
  return html`<li class=${`erow ${found ? "erow-found" : "erow-missed"} ${open ? "open" : ""}`}>
    <button class="erow-head" onClick=${() => setOpen(!open)} aria-expanded=${open}>
      <span class="erow-mark"><${Icon} name=${found ? "check" : "x"} size=${15} stroke=${3} /></span>
      <span class="erow-title">${error.title}${error.critical && html` <${Chip} tone="danger">Kritik</${Chip}>`}</span>
      <span class="erow-cat"><${CatChip} id=${error.category} short /></span>
      <span class="erow-pts">${found ? `+${pointsFor(error, scenario.errors)}` : `0 / ${pointsFor(error, scenario.errors)}`}</span>
      <${Icon} name="chevronDown" size=${18} className="erow-chev" />
    </button>
    ${open && html`<div class="erow-body">
      <div><h5>Hata</h5><p>${error.description}</p></div>
      <div><h5>Neden önemli?</h5><p>${error.importance}</p></div>
      <div><h5>Doğru uygulama</h5><p>${error.action}</p></div>
      <div class="erow-foot">${cat?.name} · ${pointsFor(error, scenario.errors)} puan</div>
    </div>`}
  </li>`;
}

export function ErrorList({ scenario, result }) {
  const found = scenario.errors.filter((e) => result.found_errors.includes(e.id));
  const missed = scenario.errors.filter((e) => !result.found_errors.includes(e.id));
  return html`<div class="elist">
    <h4 class="elist-h ok"><${Icon} name="check" size=${16} stroke=${3} /> Bulunan hatalar <span>${found.length}</span></h4>
    <ul>${found.map((e) => html`<${ErrorRow} key=${e.id} error=${e} found=${true} scenario=${scenario} />`)}</ul>
    ${missed.length > 0 && html`
      <h4 class="elist-h no"><${Icon} name="x" size=${16} stroke=${3} /> Bulunamayan hatalar <span>${missed.length}</span></h4>
      <ul>${missed.map((e) => html`<${ErrorRow} key=${e.id} error=${e} found=${false} scenario=${scenario} />`)}</ul>`}
  </div>`;
}

export function BadgeCard({ badge, earned, earnedAt, count, compact }) {
  return html`<div class=${`badge-card tone-${badge.tone} ${earned ? "earned" : "locked"} ${compact ? "compact" : ""}`}>
    <span class="badge-medal"><${Icon} name=${earned ? badge.icon : "lock"} size=${compact ? 20 : 26} /></span>
    <div>
      <div class="badge-title">${badge.title}</div>
      <div class="badge-desc">${badge.description}</div>
      ${!compact && html`<div class="badge-meta">${earned ? `Kazanıldı · ${formatDate(earnedAt, false)}${count > 1 ? ` · ${count} kez` : ""}` : "Henüz kazanılmadı"}</div>`}
    </div>
  </div>`;
}
