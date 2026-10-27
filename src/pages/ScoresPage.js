import { html, useState, useMemo } from "../lib.js";
import { Card, Avatar, Icon, Empty, Button } from "../components/ui/index.js";
import { useResults, useUsers } from "../hooks/useStore.js";
import { formatDuration, formatDate } from "../utils/format.js";
import { gradeOf } from "../utils/scoring.js";
import { DEFAULT_SCENARIO_ID, scenarioById } from "../data/scenarios.js";

export function ScoresPage() {
  const results = useResults();
  const { current } = useUsers();
  const [tab, setTab] = useState("genel");
  const scenario = scenarioById(DEFAULT_SCENARIO_ID);

  const board = useMemo(() => {
    const best = new Map();
    const games = new Map();
    for (const r of results.filter((x) => x.scenario_id === scenario.id)) {
      games.set(r.player_id, (games.get(r.player_id) || 0) + 1);
      const b = best.get(r.player_id);
      if (!b || r.score > b.score || (r.score === b.score && r.duration < b.duration)) best.set(r.player_id, r);
    }
    return [...best.values()].map((r) => ({ ...r, games: games.get(r.player_id) })).sort((a, b) => b.score - a.score || a.duration - b.duration);
  }, [results]);
  const mine = current ? results.filter((r) => r.player_id === current.id).sort((a, b) => b.created_at.localeCompare(a.created_at)) : [];

  return html`<div class="container page">
    <div><div class="overline">Skor tablosu</div><h1 class="page-title">Skorlar</h1>
      <p class="muted">Her oyuncunun en yüksek skoru sıralamaya girer. Eşitlikte süresi kısa olan öne geçer.</p></div>

    <div class="tabs">
      <button class=${tab === "genel" ? "on" : ""} onClick=${() => setTab("genel")}>Genel sıralama</button>
      <button class=${tab === "benim" ? "on" : ""} onClick=${() => setTab("benim")}>Benim oyunlarım${mine.length ? ` (${mine.length})` : ""}</button>
    </div>

    ${tab === "genel" ? html`<${Card} className="table-card"><div class="table-scroll"><table class="table">
        <thead><tr><th>#</th><th>Kullanıcı</th><th class="hide-sm">Birim</th><th class="num">Skor</th><th class="num hide-sm">Hata</th><th class="num hide-sm">Süre</th><th class="num hide-sm">Oyun</th></tr></thead>
        <tbody>${board.map((r, i) => html`<tr key=${r.player_id} class=${current && r.player_id === current.id ? "me" : ""}>
          <td><span class=${`rank r${i + 1}`}>${i + 1}</span></td>
          <td><div class="cell-user"><${Avatar} name=${r.player_name} size=${28} /><span>${r.player_name}</span></div></td>
          <td class="hide-sm muted">${r.unit}</td>
          <td class="num"><b>${r.score}</b></td>
          <td class="num hide-sm">${r.found_errors.length}/${scenario.errors.length}</td>
          <td class="num hide-sm">${formatDuration(r.duration)}</td>
          <td class="num hide-sm">${r.games}</td>
        </tr>`)}</tbody></table></div></${Card}>`
    : mine.length === 0
      ? html`<${Empty} icon="trophy" title="Henüz oyununuz yok" text="İlk oyununuzu tamamladığınızda sonuçlarınız ve raporlarınız burada listelenir." action=${html`<${Button} href="#/">Ana sayfa</${Button}>`} />`
      : html`<${Card} className="table-card"><div class="report-list">
          ${mine.map((r) => {
            const g = gradeOf(r.score);
            return html`<a key=${r.id} class="report-row" href=${`#/sonuc/${r.id}`}>
              <span class=${`report-score ${g.tone}`}>${r.score}</span>
              <div class="report-main"><strong>${formatDate(r.created_at)}</strong><span>${r.found_errors.length}/${r.found_errors.length + r.missed_errors.length} hata · ${formatDuration(r.duration)} · ${r.wrong_clicks} yanlış</span></div>
              <span class=${`grade-pill ${g.tone}`}>${g.label}</span>
              <${Icon} name="arrowRight" size=${16} />
            </a>`;
          })}
        </div></${Card}>`}
  </div>`;
}
