import { html, useState, useMemo } from "../lib.js";
import { PageHeader, Card, CardHeader, Button, Icon, Chip, Empty } from "../components/ui/index.js";
import { HBarChart, ColumnChart, LineChart } from "../components/charts/index.js";
import { useResults } from "../hooks/useStore.js";
import { summarize } from "../utils/analytics.js";
import { scenarioById, SCENARIOS } from "../data/scenarios.js";
import { formatDuration, formatDate } from "../utils/format.js";
import { exportResultsCsv } from "../services/exportService.js";
import { resultService } from "../services/resultService.js";

const RANGES = [["30", "Son 30 gün"], ["90", "Son 90 gün"], ["all", "Tümü"]];

function Kpi({ label, value, sub, icon, tone = "navy" }) {
  return html`<div class=${`kpi tone-${tone}`}>
    <div class="kpi-top"><span>${label}</span><span class="kpi-icon"><${Icon} name=${icon} size=${16} /></span></div>
    <div class="kpi-value">${value}</div>${sub && html`<div class="kpi-sub">${sub}</div>`}
  </div>`;
}

export function AdminPage() {
  const all = useResults();
  const [range, setRange] = useState("90");
  const [unit, setUnit] = useState("all");
  const [scenarioId, setScenarioId] = useState("hasta-odasi");
  const [demo, setDemo] = useState(true);
  const scenario = scenarioById(scenarioId);

  const units = [...new Set(all.map((r) => r.unit).filter(Boolean))].sort((a, b) => a.localeCompare(b, "tr"));
  const filtered = useMemo(() => {
    const since = range === "all" ? 0 : Date.now() - Number(range) * 86400000;
    return all.filter((r) => r.scenario_id === scenarioId && (demo || !r.demo) && (unit === "all" || r.unit === unit) && new Date(r.created_at).getTime() >= since);
  }, [all, range, unit, scenarioId, demo]);
  const s = useMemo(() => summarize(filtered, scenario), [filtered, scenario]);
  const recent = [...filtered].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return html`<div class="container page admin">
    <${PageHeader} overline="Kalite birimi · Yönetici paneli" title="Eğitim performans panosu"
      description="Simülasyon sonuçlarının kurum geneli analizi. Veriler filtrelere göre anlık hesaplanır."
      actions=${html`<${Button} variant="success" icon="download" onClick=${() => exportResultsCsv(recent)} disabled=${!recent.length}>Excel / CSV indir</${Button}>`} />

    <div class="filters">
      <div class="seg">${RANGES.map(([k, l]) => html`<button key=${k} class=${range === k ? "on" : ""} onClick=${() => setRange(k)}>${l}</button>`)}</div>
      <select class="select" value=${unit} onChange=${(e) => setUnit(e.target.value)}><option value="all">Tüm birimler</option>${units.map((u) => html`<option key=${u}>${u}</option>`)}</select>
      <select class="select" value=${scenarioId} onChange=${(e) => setScenarioId(e.target.value)}>${SCENARIOS.filter((x) => x.active).map((x) => html`<option key=${x.id} value=${x.id}>${x.name}</option>`)}</select>
      <label class="toggle"><input type="checkbox" checked=${demo} onChange=${(e) => setDemo(e.target.checked)} /><span></span>Demo verileri dahil</label>
    </div>

    ${!filtered.length ? html`<${Empty} icon="chart" title="Bu filtrelerle sonuç yok" text="Filtreleri genişletin veya demo verilerini dahil edin." />` : html`
    <div class="kpi-grid">
      <${Kpi} label="Toplam oyuncu" value=${s.playerCount} icon="users" />
      <${Kpi} label="Toplam oyun" value=${s.gameCount} icon="play" />
      <${Kpi} label="Ortalama skor" value=${s.avgScore} sub="/ 1000" icon="trophy" tone="green" />
      <${Kpi} label="Ortalama süre" value=${formatDuration(s.avgDuration)} sub=${`Tam tamamlama: %${s.completionRate}`} icon="clock" />
      <${Kpi} label="En çok kaçırılan" value=${html`<span class="kpi-text">${s.mostMissed?.title}</span>`} sub=${`Tespit oranı %${s.mostMissed?.rate}`} icon="alert" tone="red" />
      <${Kpi} label="En zayıf kategori" value=${html`<span class="kpi-text">${s.weakestCategory?.name}</span>`} sub=${`Başarı %${s.weakestCategory?.rate}`} icon="target" tone="orange" />
    </div>

    <div class="dash-grid">
      <${Card}><${CardHeader} icon="target" title="Kategori başarı oranları" subtitle="Ortalama ağırlıklı tespit oranı" />
        <${HBarChart} data=${s.categoryRates.map((c) => ({ label: c.name, value: c.rate }))} valueLabel="Başarı" /></${Card}>
      <${Card}><${CardHeader} icon="trend" title="Zaman içindeki performans" subtitle="Haftalık ortalama skor" />
        <${LineChart} data=${s.trend} /></${Card}>
      <${Card}><${CardHeader} icon="search" title="Hata tespit oranları" subtitle="Oyuncuların hatayı bulma yüzdesi" />
        <${HBarChart} data=${[...s.errorRates].sort((a, b) => b.rate - a.rate).map((e) => ({ label: e.title, value: e.rate, flag: e.critical ? "Kritik" : null }))} valueLabel="Tespit" /></${Card}>
      <${Card}><${CardHeader} icon="chart" title="Skor dağılımı" subtitle="Oyun sayısı" />
        <${ColumnChart} data=${s.scoreDistribution} valueLabel="Oyun" />
        <div class="dist-note">Ortalama bulunan hata: <b>${s.avgFound.toFixed(1)}</b> / ${scenario.errors.length}</div></${Card}>
      <${Card}><${CardHeader} icon="alert" title="En çok kaçırılan hatalar" subtitle="Kaçırılma oranına göre ilk 5" />
        <ol class="missed-list">${[...s.errorRates].sort((a, b) => a.rate - b.rate).slice(0, 5).map((e, i) => html`<li key=${e.id}>
          <span class="ml-no">${i + 1}</span><div><b>${e.title}</b>${e.critical && html` <${Chip} tone="danger">Kritik</${Chip}>`}</div>
          <span class="ml-rate">%${100 - e.rate}<small>kaçırıldı</small></span></li>`)}</ol></${Card}>
      <${Card}><${CardHeader} icon="building" title="Birim bazlı performans" />
        <table class="table compact"><thead><tr><th>Birim</th><th class="num">Oyuncu</th><th class="num">Oyun</th><th class="num">Ort. skor</th></tr></thead>
          <tbody>${s.unitStats.map((u) => html`<tr key=${u.unit}><td>${u.unit}</td><td class="num">${u.players}</td><td class="num">${u.games}</td><td class="num"><b>${u.avgScore}</b></td></tr>`)}</tbody></table></${Card}>
    </div>

    <${Card} className="table-card">
      <${CardHeader} icon="file" title="Son oyun sonuçları" subtitle=${`${recent.length} kayıt · ilk 25 gösteriliyor`}
        actions=${html`<${Button} size="sm" variant="outline" icon="download" onClick=${() => exportResultsCsv(recent)}>CSV</${Button}>`} />
      <div class="table-scroll"><table class="table">
        <thead><tr><th>Tarih</th><th>Oyuncu</th><th class="hide-sm">Birim</th><th class="num">Skor</th><th class="num">Hata</th><th class="num hide-sm">Yanlış</th><th class="num hide-sm">İpucu</th><th class="num hide-sm">Süre</th><th></th></tr></thead>
        <tbody>${recent.slice(0, 25).map((r) => html`<tr key=${r.id}>
          <td>${formatDate(r.created_at)}</td><td>${r.player_name}${r.demo && html` <span class="demo-tag">demo</span>`}</td><td class="hide-sm muted">${r.unit}</td>
          <td class="num"><b>${r.score}</b></td><td class="num">${r.found_errors.length}/${scenario.errors.length}</td>
          <td class="num hide-sm">${r.wrong_clicks}</td><td class="num hide-sm">${r.hints_used}</td><td class="num hide-sm">${formatDuration(r.duration)}</td>
          <td><a class="link" href=${`#/sonuc/${r.id}`}>Rapor</a></td></tr>`)}</tbody>
      </table></div>
    </${Card}>`}

    <div class="demo-admin">
      <${Icon} name="info" size=${16} />
      <span>Demo veriler, panelin görünümünü göstermek için otomatik oluşturulmuştur.</span>
      ${resultService.hasDemo()
        ? html`<${Button} size="sm" variant="ghost" icon="trash" onClick=${() => confirm("Tüm demo sonuçlar silinsin mi?") && resultService.removeDemo()}>Demo verileri kaldır</${Button}>`
        : html`<${Button} size="sm" variant="ghost" icon="refresh" onClick=${() => resultService.reloadDemo()}>Demo verileri yükle</${Button}>`}
    </div>
  </div>`;
}
