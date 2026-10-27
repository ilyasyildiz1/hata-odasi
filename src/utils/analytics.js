// Yönetici paneli için toplu istatistikler.
import { CATEGORIES } from "../data/categories.js";

const avg = (a) => (a.length ? a.reduce((s, x) => s + x, 0) / a.length : 0);

export function summarize(results, scenario) {
  const players = new Set(results.map((r) => r.player_id));
  const errors = scenario?.errors || [];
  const errorRates = errors.map((e) => {
    const found = results.filter((r) => r.found_errors.includes(e.id)).length;
    return { id: e.id, title: e.title, category: e.category, critical: e.critical, rate: results.length ? Math.round((found / results.length) * 100) : 0 };
  });
  const categoryRates = CATEGORIES
    .filter((c) => errors.some((e) => e.category === c.id))
    .map((c) => ({ id: c.id, name: c.name, short: c.short, rate: Math.round(avg(results.map((r) => r.category_scores?.[c.id] ?? 0))) }));
  const mostMissed = [...errorRates].sort((a, b) => a.rate - b.rate)[0];
  const weakestCategory = [...categoryRates].sort((a, b) => a.rate - b.rate)[0];

  return {
    playerCount: players.size,
    gameCount: results.length,
    avgScore: Math.round(avg(results.map((r) => r.score))),
    avgDuration: Math.round(avg(results.map((r) => r.duration))),
    avgFound: avg(results.map((r) => r.found_errors.length)),
    completionRate: results.length ? Math.round((results.filter((r) => r.missed_errors.length === 0).length / results.length) * 100) : 0,
    errorRates,
    categoryRates,
    mostMissed,
    weakestCategory,
    scoreDistribution: histogram(results.map((r) => r.score), [0, 200, 400, 500, 600, 700, 800, 900, 1001]),
    trend: weeklyTrend(results),
    unitStats: byUnit(results),
  };
}

function histogram(values, edges) {
  return edges.slice(0, -1).map((lo, i) => {
    const hi = edges[i + 1];
    return { label: `${lo}–${Math.min(hi, 1000)}`, value: values.filter((v) => v >= lo && v < hi).length };
  });
}

function weekStart(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
}

function weeklyTrend(results) {
  const map = new Map();
  for (const r of results) {
    const k = weekStart(r.created_at).toISOString();
    if (!map.has(k)) map.set(k, []);
    map.get(k).push(r.score);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b)).map(([k, v]) => ({
    date: k,
    label: new Date(k).toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }),
    value: Math.round(avg(v)),
    count: v.length,
  }));
}

function byUnit(results) {
  const map = new Map();
  for (const r of results) {
    const u = r.unit || "Belirtilmemiş";
    if (!map.has(u)) map.set(u, []);
    map.get(u).push(r);
  }
  return [...map.entries()].map(([unit, list]) => ({
    unit,
    games: list.length,
    players: new Set(list.map((r) => r.player_id)).size,
    avgScore: Math.round(avg(list.map((r) => r.score))),
  })).sort((a, b) => b.avgScore - a.avgScore);
}
