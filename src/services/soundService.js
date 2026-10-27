// Ses altyapısı. Varsayılan olarak kapalıdır; kullanıcı üst menüden açabilir.
// Şimdilik Web Audio ile sentezlenen kısa tonlar kullanılır. Gerçek ses dosyası eklemek için
// SOUNDS içindeki ilgili girdiye `file: "src/assets/sounds/dogru.mp3"` yazmanız yeterlidir.
import { settings } from "./storage.js";
import { createStore } from "./store.js";

const SOUNDS = {
  correct: { notes: [[660, 0, 0.09], [990, 0.09, 0.16]], type: "sine", gain: 0.18 },
  wrong: { notes: [[220, 0, 0.16]], type: "triangle", gain: 0.16 },
  warning: { notes: [[880, 0, 0.08], [880, 0.16, 0.08]], type: "square", gain: 0.05 },
  complete: { notes: [[523, 0, 0.14], [659, 0.13, 0.14], [784, 0.26, 0.14], [1047, 0.39, 0.3]], type: "sine", gain: 0.18 },
  hint: { notes: [[740, 0, 0.12]], type: "sine", gain: 0.1 },
};

export const soundStore = createStore({ enabled: settings.get("sound", false) });

let ctx = null;
const audio = () => (ctx ||= new (window.AudioContext || window.webkitAudioContext)());

export const soundService = {
  isEnabled: () => soundStore.get().enabled,
  toggle() {
    const enabled = !soundStore.get().enabled;
    settings.set("sound", enabled);
    soundStore.set({ enabled });
    if (enabled) this.play("hint");
  },
  /** @param {keyof typeof SOUNDS} name */
  play(name) {
    if (!soundStore.get().enabled) return;
    const def = SOUNDS[name];
    if (!def) return;
    try {
      if (def.file) {
        new Audio(def.file).play();
        return;
      }
      const ac = audio();
      const t0 = ac.currentTime;
      for (const [freq, start, dur] of def.notes) {
        const osc = ac.createOscillator();
        const g = ac.createGain();
        osc.type = def.type;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0, t0 + start);
        g.gain.linearRampToValueAtTime(def.gain, t0 + start + 0.01);
        g.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur);
        osc.connect(g).connect(ac.destination);
        osc.start(t0 + start);
        osc.stop(t0 + start + dur + 0.02);
      }
    } catch {
      /* ses desteklenmiyorsa sessizce geç */
    }
  },
};
