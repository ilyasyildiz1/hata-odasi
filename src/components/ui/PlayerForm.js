import { html, useState } from "../../lib.js";
import { Button } from "./index.js";
import { UNITS } from "../../data/users.js";
import { userService } from "../../services/userService.js";

/** Ad-soyad ve birimle oyuncu oluşturur (aynı isim varsa onu seçer). */
export function PlayerForm({ onDone, submitLabel = "Devam et" }) {
  const [name, setName] = useState("");
  const [unit, setUnit] = useState(UNITS[0]);
  const valid = name.trim().split(/\s+/).length >= 2;
  const submit = (e) => {
    e.preventDefault();
    if (!valid) return;
    userService.create({ name, unit });
    onDone?.();
  };
  return html`<form class="player-form" onSubmit=${submit}>
    <label>Ad Soyad<input value=${name} onInput=${(e) => setName(e.target.value)} placeholder="Örn. Ayşe Yılmaz" autocomplete="name" /></label>
    <label>Birim<select value=${unit} onChange=${(e) => setUnit(e.target.value)}>${UNITS.map((u) => html`<option key=${u}>${u}</option>`)}</select></label>
    <${Button} type="submit" disabled=${!valid} iconRight="arrowRight">${submitLabel}</${Button}>
    ${!valid && name.length > 0 && html`<small class="form-hint">Lütfen ad ve soyadınızı birlikte yazın.</small>`}
  </form>`;
}
