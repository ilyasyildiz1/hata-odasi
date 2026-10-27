import { html } from "./lib.js";
import { useRoute } from "./hooks/useRoute.js";
import { Header, Footer } from "./components/layout/Header.js";
import { HomePage } from "./pages/HomePage.js";
import { BriefingPage } from "./pages/BriefingPage.js";
import { GamePage } from "./pages/GamePage.js";
import { ResultPage } from "./pages/ResultPage.js";
import { ScoresPage } from "./pages/ScoresPage.js";
import { AdminPage } from "./pages/AdminPage.js";

// Rota tablosu: #/yol/parametre
const ROUTES = {
  "": HomePage,
  talimat: BriefingPage,
  oyun: GamePage,
  sonuc: ResultPage,
  skorlar: ScoresPage,
  yonetim: AdminPage,
};

export function App() {
  const route = useRoute();
  const Page = ROUTES[route.path] || HomePage;
  const immersive = route.path === "oyun";
  return html`
    ${!immersive && html`<${Header} route=${route} />`}
    <main class=${immersive ? "main immersive" : "main"}>
      <${Page} key=${route.path + route.params.join("/")} id=${route.params[0]} />
    </main>
    ${!immersive && html`<${Footer} />`}
  `;
}
