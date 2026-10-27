import { html } from "../../lib.js";
import { Icon, Avatar } from "../ui/index.js";
import { useUsers, useSound } from "../../hooks/useStore.js";
import { soundService } from "../../services/soundService.js";

const NAV = [
  { path: "", label: "Ana Sayfa", match: ["", "talimat", "sonuc"] },
  { path: "skorlar", label: "Skorlar", match: ["skorlar"] },
  { path: "yonetim", label: "Yönetim", match: ["yonetim"] },
];

export const Logo = () => html`
  <a class="logo" href="#/">
    <svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#3E7A6B"/><path d="M9 16.5l4.5 4.5L23 11.5" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>
    <strong>Hata Odası</strong>
  </a>`;

export function SoundToggle() {
  const { enabled } = useSound();
  return html`<button class="icon-btn" onClick=${() => soundService.toggle()} title=${enabled ? "Sesi kapat" : "Sesi aç"} aria-pressed=${enabled}>
    <${Icon} name=${enabled ? "volume" : "volumeOff"} size=${18} />
  </button>`;
}

export function Header({ route }) {
  const { current } = useUsers();
  return html`<header class="topbar">
    <div class="container topbar-inner">
      <${Logo} />
      <nav class="nav">
        ${NAV.map((n) => html`<a key=${n.path} href=${`#/${n.path}`} class=${n.match.includes(route.path) ? "active" : ""}>${n.label}</a>`)}
      </nav>
      <div class="topbar-right">
        <${SoundToggle} />
        ${current && html`<span class="user-chip"><${Avatar} name=${current.name} size=${28} /><span>${current.name}</span></span>`}
      </div>
    </div>
  </header>`;
}

export const Footer = () => html`<footer class="footer"><div class="container">
  <span>Hata Odası · Kalite ve Eğitim Birimi</span>
  <span>Eğitim amaçlı simülasyondur; kurum prosedürleri esastır.</span>
</div></footer>`;
