export const pad2 = (n) => String(n).padStart(2, "0");

/** 222 -> "03:42" */
export function formatDuration(sec) {
  const s = Math.max(0, Math.round(sec || 0));
  return `${pad2(Math.floor(s / 60))}:${pad2(s % 60)}`;
}

export function formatDate(iso, withTime = true) {
  const d = new Date(iso);
  const opts = { day: "2-digit", month: "2-digit", year: "numeric" };
  if (withTime) Object.assign(opts, { hour: "2-digit", minute: "2-digit" });
  return d.toLocaleString("tr-TR", opts);
}

export const formatNumber = (n) => Math.round(n).toLocaleString("tr-TR");
export const initials = (name = "") =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((p) => p[0].toLocaleUpperCase("tr-TR")).join("");

export const uid = (prefix = "id") => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
