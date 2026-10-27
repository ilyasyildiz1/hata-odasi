import { BADGES } from "../data/badges.js";
import { scenarioById } from "../data/scenarios.js";

/** Bir sonuçla kazanılan rozetler. */
export function badgesForResult(result, history = []) {
  const scenario = scenarioById(result.scenario_id);
  if (!scenario?.errors) return [];
  return BADGES.filter((b) => {
    try { return b.check(result, { scenario, history }); } catch { return false; }
  });
}

/** Oyuncunun tüm geçmişine göre rozet durumu: { badge, earnedAt|null, count } */
export function playerBadges(results) {
  const sorted = [...results].sort((a, b) => a.created_at.localeCompare(b.created_at));
  return BADGES.map((badge) => {
    const hits = sorted.filter((r, i) => badgesForResult(r, sorted.slice(0, i)).some((b) => b.id === badge.id));
    return { badge, earnedAt: hits[0]?.created_at || null, count: hits.length };
  });
}
