// Senaryo kataloğu. Yeni senaryo: veri dosyasını data/scenarios/ altında oluşturun, oda çizimini
// components/room/rooms/ altına ekleyip ROOM_REGISTRY'ye kaydedin, ardından buraya ekleyin.
import { HASTA_ODASI } from "./scenarios/hastaOdasi.js";

/** @type {import('../types/index.js').Scenario[]} */
export const SCENARIOS = [HASTA_ODASI];

export const DEFAULT_SCENARIO_ID = "hasta-odasi";
export const scenarioById = (id) => SCENARIOS.find((s) => s.id === id);
