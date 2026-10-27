import { createCollection } from "./storage.js";
import { createStore } from "./store.js";
import { generateDemoResults, DEMO_SEED_VERSION } from "./demoSeed.js";
import { settings } from "./storage.js";

const results = createCollection("results");

// İlk açılışta yönetici paneli ve skor tablosu boş görünmesin diye demo sonuçlar yüklenir.
if (settings.get("demoSeed", null) !== DEMO_SEED_VERSION) {
  results.replaceAll([...results.all().filter((r) => !r.demo), ...generateDemoResults()]);
  settings.set("demoSeed", DEMO_SEED_VERSION);
}

export const resultStore = createStore(results.all());
const refresh = () => resultStore.set(results.all());

export const resultService = {
  list: () => resultStore.get(),
  byId: (id) => resultStore.get().find((r) => r.id === id),
  byPlayer: (playerId) => resultStore.get().filter((r) => r.player_id === playerId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at)),
  /** @param {import('../types/index.js').GameResult} result */
  save(result) {
    results.insert(result);
    refresh();
    return result;
  },
  removeDemo() {
    results.remove((r) => r.demo);
    settings.set("demoSeed", "removed");
    refresh();
  },
  reloadDemo() {
    results.replaceAll([...results.all().filter((r) => !r.demo), ...generateDemoResults()]);
    settings.set("demoSeed", DEMO_SEED_VERSION);
    refresh();
  },
  hasDemo: () => resultStore.get().some((r) => r.demo),
};
