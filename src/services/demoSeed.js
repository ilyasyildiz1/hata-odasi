// Demo sonuç üreticisi (tohumlu, her seferinde aynı veri).
import { DEMO_USERS } from "../data/users.js";
import { scenarioById } from "../data/scenarios.js";
import { computeScore, categoryScores } from "../utils/scoring.js";
import { seeded } from "../utils/random.js";

export const DEMO_SEED_VERSION = "v3";

// Hataların "bulunma kolaylığı" (demo dağılımı için)
const EASE = {
  "yatak-kenarlik-fren": 0.85, "cagri-zili": 0.78, "terlik": 0.6, "gece-lambasi-kablo": 0.75,
  "evden-ilac": 0.62, "etiketsiz-enjektor": 0.66, "yuksek-riskli-ilac": 0.58, "kesici-delici": 0.82,
  "sonda-torbasi": 0.7, "damar-yolu-pansuman": 0.5, "el-dezenfektani": 0.64, "kimlik-bilekligi": 0.6,
  "alerji-bilekligi": 0.45, "oksijen-tupu": 0.8, "nemlendirici": 0.48,
};

function makeResult(user, scenario, { found, wrong, hints, duration, date, id }) {
  const foundIds = scenario.errors.filter((e) => found.includes(e.id)).map((e) => e.id);
  const remaining = scenario.timeLimit - duration;
  const score = computeScore({ errors: scenario.errors, foundIds, wrongClicks: wrong, hintsUsed: hints, remaining, timeLimit: scenario.timeLimit, final: true });
  return {
    id,
    player_id: user.id,
    player_name: user.name,
    unit: user.unit,
    scenario_id: scenario.id,
    score: score.total,
    duration,
    found_errors: foundIds,
    missed_errors: scenario.errors.filter((e) => !foundIds.includes(e.id)).map((e) => e.id),
    wrong_clicks: wrong,
    hints_used: hints,
    category_scores: categoryScores(scenario.errors, foundIds),
    time_bonus: score.bonus,
    created_at: date.toISOString(),
    demo: true,
  };
}

export function generateDemoResults() {
  const scenario = scenarioById("hasta-odasi");
  const rnd = seeded(20260928);
  const now = Date.now();
  const out = [];
  const all = scenario.errors.map((e) => e.id);
  const day = 86400000;

  // Skor tablosunun üst sıraları
  const top = [
    ["u-ayse", { found: all, wrong: 0, hints: 0, duration: 252 }],
    ["u-mehmet", { found: all, wrong: 1, hints: 0, duration: 294 }],
    ["u-zeynep", { found: all, wrong: 2, hints: 0, duration: 336 }],
  ];
  top.forEach(([uid, cfg], i) => {
    const user = DEMO_USERS.find((u) => u.id === uid);
    out.push(makeResult(user, scenario, { ...cfg, date: new Date(now - (3 + i * 2) * day), id: `demo-top-${i}` }));
  });

  let n = 0;
  DEMO_USERS.forEach((user, ui) => {
    const skill = 0.85 + rnd() * 0.3;
    const games = 2 + Math.floor(rnd() * 6);
    for (let g = 0; g < games; g++) {
      const learn = Math.min(0.15, g * 0.04); // tekrar ettikçe gelişim
      const found = all.filter((id) => rnd() < Math.min(0.98, EASE[id] * (skill + learn) + 0.1));
      const wrong = Math.floor(rnd() * rnd() * 5);
      const hints = rnd() < 0.35 ? 1 + Math.floor(rnd() * 2) : 0;
      const complete = found.length === all.length;
      const duration = complete ? Math.round(260 + rnd() * 150) : scenario.timeLimit;
      const daysAgo = Math.floor(rnd() * 84) + 1;
      const r = makeResult(user, scenario, { found, wrong, hints, duration, date: new Date(now - daysAgo * day - rnd() * day), id: `demo-${ui}-${g}` });
      if (r.score >= 860) continue; // üç lider sonucunu geçmesin
      out.push(r);
      n++;
    }
  });
  return out;
}
