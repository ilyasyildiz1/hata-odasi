// Oyun motoru: süre, tespitler, cezalar, ipuçları ve sonucun oluşturulması.
import { useState, useRef, useEffect, useCallback } from "../lib.js";
import { hitItem } from "../utils/geometry.js";
import { computeScore, categoryScores, pointsFor, SCORING } from "../utils/scoring.js";
import { soundService } from "../services/soundService.js";
import { uid } from "../utils/format.js";

/**
 * @param {import('../types/index.js').Scenario} scenario
 * @param {{onFinish:(result:object)=>void, player:object}} opts
 */
export function useGameEngine(scenario, { onFinish, player }) {
  const [foundIds, setFoundIds] = useState([]);
  const [wrongClicks, setWrongClicks] = useState(0);
  const [hints, setHints] = useState([]); // gösterilen ipuçları: {errorId, text}
  const [remaining, setRemaining] = useState(scenario.timeLimit);
  const [status, setStatus] = useState("playing"); // playing | ending | finished
  const [endReason, setEndReason] = useState(null);
  const [events, setEvents] = useState([]); // görsel geri bildirimler

  const startRef = useRef(performance.now());
  const lastWrongRef = useRef(0);
  const warnedRef = useRef(false);
  const stateRef = useRef({});
  stateRef.current = { foundIds, wrongClicks, hints, remaining, status };

  const pushEvent = (ev) => {
    const id = uid("ev");
    setEvents((list) => [...list.slice(-4), { ...ev, id }]);
    setTimeout(() => setEvents((list) => list.filter((e) => e.id !== id)), ev.ttl || 2400);
  };

  const finish = useCallback((reason) => {
    const s = stateRef.current;
    if (s.status !== "playing") return;
    const elapsed = Math.min(scenario.timeLimit, Math.round((performance.now() - startRef.current) / 1000));
    const rem = reason === "timeout" ? 0 : scenario.timeLimit - elapsed;
    const score = computeScore({
      errors: scenario.errors, foundIds: s.foundIds, wrongClicks: s.wrongClicks,
      hintsUsed: s.hints.length, remaining: rem, timeLimit: scenario.timeLimit, final: true,
    });
    const result = {
      id: uid("r"),
      player_id: player.id,
      player_name: player.name,
      unit: player.unit,
      scenario_id: scenario.id,
      score: score.total,
      duration: reason === "timeout" ? scenario.timeLimit : elapsed,
      found_errors: [...s.foundIds],
      missed_errors: scenario.errors.filter((e) => !s.foundIds.includes(e.id)).map((e) => e.id),
      wrong_clicks: s.wrongClicks,
      hints_used: s.hints.length,
      category_scores: categoryScores(scenario.errors, s.foundIds),
      time_bonus: score.bonus,
      end_reason: reason,
      created_at: new Date().toISOString(),
    };
    setStatus("ending");
    setEndReason(reason);
    soundService.play(reason === "timeout" ? "warning" : "complete");
    setTimeout(() => {
      setStatus("finished");
      onFinish(result);
    }, 1800);
  }, [scenario, player, onFinish]);

  // Geri sayım (performance.now tabanlı, sapma yapmaz)
  useEffect(() => {
    if (status !== "playing") return;
    const t = setInterval(() => {
      const rem = Math.max(0, scenario.timeLimit - Math.floor((performance.now() - startRef.current) / 1000));
      setRemaining(rem);
      if (rem <= 60 && !warnedRef.current) {
        warnedRef.current = true;
        soundService.play("warning");
      }
      if (rem === 0) finish("timeout");
    }, 250);
    return () => clearInterval(t);
  }, [status, scenario.timeLimit, finish]);

  // Tüm hatalar bulununca otomatik bitir
  useEffect(() => {
    if (status === "playing" && foundIds.length === scenario.errors.length) finish("complete");
  }, [foundIds, status, scenario.errors.length, finish]);

  /** Oda üzerinde bir noktaya tıklama (viewBox koordinatı). */
  const inspect = useCallback((point) => {
    const s = stateRef.current;
    if (s.status !== "playing") return;
    // Üst üste binen alanlarda önce henüz bulunmamış hata seçilir.
    const error = hitItem(point, scenario.errors.filter((e) => !s.foundIds.includes(e.id)));
    if (!error && hitItem(point, scenario.errors)) {
      pushEvent({ type: "already", point, ttl: 1500 });
      return;
    }
    if (error) {
      setFoundIds((ids) => [...ids, error.id]);
      setHints((h) => h.map((x) => (x.errorId === error.id ? { ...x, resolved: true } : x)));
      soundService.play("correct");
      pushEvent({ type: "found", point, error, points: pointsFor(error, scenario.errors), order: s.foundIds.length + 1, ttl: 2600 });
      return;
    }
    const now = performance.now();
    if (now - lastWrongRef.current < SCORING.wrongClickCooldownMs) return;
    lastWrongRef.current = now;
    const object = hitItem(point, scenario.objects || []);
    setWrongClicks((n) => n + 1);
    soundService.play("wrong");
    pushEvent({ type: "wrong", point, object, points: -SCORING.wrongClick, ttl: 2200 });
  }, [scenario]);

  const canHint = status === "playing" && hints.length < SCORING.maxHints && foundIds.length < scenario.errors.length;
  const usedHintIds = useRef(new Set());
  const requestHint = useCallback(() => {
    const s = stateRef.current;
    if (s.status !== "playing" || s.hints.length >= SCORING.maxHints) return;
    const pool = scenario.errors.filter((e) => !s.foundIds.includes(e.id) && !usedHintIds.current.has(e.id));
    const target = pool[Math.floor(Math.random() * pool.length)] || scenario.errors.find((e) => !s.foundIds.includes(e.id));
    if (!target) return;
    usedHintIds.current.add(target.id);
    setHints((h) => [...h, { errorId: target.id, text: target.hint }]);
    soundService.play("hint");
  }, [scenario]);

  const liveScore = computeScore({
    errors: scenario.errors, foundIds, wrongClicks, hintsUsed: hints.length,
    remaining, timeLimit: scenario.timeLimit,
  }).total;

  return {
    foundIds, wrongClicks, hints, remaining, status, endReason, events, liveScore,
    canHint, inspect, requestHint, finish,
  };
}
