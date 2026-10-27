import { html, useState } from "../lib.js";
import { Button, Icon, Avatar } from "../components/ui/index.js";
import { PlayerForm } from "../components/ui/PlayerForm.js";
import { RoomStage } from "../components/room/RoomStage.js";
import { scenarioById, DEFAULT_SCENARIO_ID } from "../data/scenarios.js";
import { CATEGORIES } from "../data/categories.js";
import { useUsers, useResults } from "../hooks/useStore.js";
import { userService } from "../services/userService.js";
import { formatDuration } from "../utils/format.js";

function PlayerCard({ scenario }) {
  const { current, users } = useUsers();
  const results = useResults();
  const [changing, setChanging] = useState(false);
  const mine = current ? results.filter((r) => r.player_id === current.id) : [];
  const best = mine.length ? Math.max(...mine.map((r) => r.score)) : null;

  if (!current || changing) {
    const known = users.filter((u) => !u.demo);
    return html`<div class="player-card">
      <h3>${changing ? "Oyuncu değiştir" : "Başlamak için adınızı yazın"}</h3>
      <${PlayerForm} submitLabel="Devam et" onDone=${() => setChanging(false)} />
      ${known.length > 0 && html`<div class="known">
        <span>Daha önce oynayanlar:</span>
        ${known.map((u) => html`<button key=${u.id} class="link-btn" onClick=${() => { userService.setCurrent(u.id); setChanging(false); }}>${u.name}</button>`)}
      </div>`}
    </div>`;
  }
  return html`<div class="player-card">
    <div class="player-current">
      <${Avatar} name=${current.name} size=${44} />
      <div><strong>${current.name}</strong><span>${current.unit}${best !== null ? ` · En iyi skor: ${best}` : ""}</span></div>
      <button class="link-btn" onClick=${() => setChanging(true)}>Değiştir</button>
    </div>
    <${Button} size="lg" className="w-full" href=${`#/talimat/${scenario.id}`} iconRight="arrowRight">Oyuna başla</${Button}>
    ${mine.length > 0 && html`<a class="muted-link" href="#/skorlar">Önceki ${mine.length} oyununuzu görün</a>`}
  </div>`;
}

export function HomePage() {
  const scenario = scenarioById(DEFAULT_SCENARIO_ID);
  const counts = Object.fromEntries(CATEGORIES.map((c) => [c.id, scenario.errors.filter((e) => e.category === c.id).length]));
  return html`<div class="container page home">
    <section class="intro">
      <div class="intro-copy">
        <div class="overline">Hasta güvenliği eğitim simülasyonu</div>
        <h1>Hata Odası</h1>
        <p class="lead">Hataları bul. Güvenliği artır.</p>
        <p>Hasta odasına girin, güvenliği tehdit eden durumları dikkatle inceleyin ve süreniz dolmadan bulabildiğiniz kadar hatayı bulun. Hatalar her zaman ilk bakışta görünmez.</p>
        <div class="facts">
          <span><${Icon} name="search" size=${16} /> ${scenario.errors.length} gizli hata</span>
          <span><${Icon} name="clock" size=${16} /> ${formatDuration(scenario.timeLimit)} dakika</span>
          <span><${Icon} name="grid" size=${16} /> ${CATEGORIES.length} güvenlik alanı</span>
        </div>
        <${PlayerCard} scenario=${scenario} />
      </div>
      <div class="intro-visual" aria-hidden="true">
        <${RoomStage} scenario=${scenario} mode="preview" />
        <span class="intro-caption">Oda 312 · Gece kontrolü</span>
      </div>
    </section>

    <section>
      <h2 class="section-title">Neleri kontrol edeceksiniz?</h2>
      <div class="cat-grid">
        ${CATEGORIES.map((c) => html`<div key=${c.id} class="cat-card" style=${{ borderTopColor: c.color }}>
          <strong>${c.name}</strong><span>${counts[c.id]} madde</span>
        </div>`)}
      </div>
    </section>

    <section>
      <h2 class="section-title">Nasıl oynanır?</h2>
      <div class="steps">
        ${[
          ["clipboard", "Hastayı tanıyın", "Nöbet devir notunu okuyun; hasta bilgileri ipucu taşır."],
          ["search", "Odayı inceleyin", "Gerekirse yakınlaştırın. Hatalı olduğunu düşündüğünüz noktaya tıklayın."],
          ["chart", "Raporunuzu alın", "Bulduklarınız ve kaçırdıklarınız için doğru uygulamaları öğrenin."],
        ].map(([icon, t, d], i) => html`<div key=${t} class="step">
          <span class="step-no">${i + 1}</span>
          <div><h4>${t}</h4><p>${d}</p></div>
        </div>`)}
      </div>
    </section>
  </div>`;
}
