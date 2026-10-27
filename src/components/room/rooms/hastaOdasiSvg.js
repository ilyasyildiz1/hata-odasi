// Hasta Odası illüstrasyonu (viewBox 0 0 1600 900) — sade, önden görünüş, gece kontrolü.
// Duvar y 0-700, zemin y 700-900. Hatalı nesneler bilerek küçük ve ince ayrıntılarla çizilmiştir.
// Koordinatlar data/scenarios/hastaOdasi.js içindeki alanlarla eşleşir.

const C = {
  wall: "#ECEFEA", wallLow: "#E2E7E1", floor: "#DED7CA", floorLine: "#CFC7B8",
  line: "#A9B3AD", lineDark: "#7E8A84", white: "#FBFCFA", metal: "#B9C2BD", metalDark: "#8C9792",
  skin: "#E7C3A6", skinShade: "#D4AA8B", gown: "#B9D3CF", blanket: "#9DBBB2", blanketDark: "#86A79D",
  wood: "#D9C7A8", ink: "#3F4B46", shadow: "rgba(60,70,64,.13)",
};

function planks() {
  let s = "";
  [742, 792, 852].forEach((y) => (s += `<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`));
  const rows = [[700, 742, 0], [742, 792, 110], [792, 852, 50], [852, 900, 160]];
  rows.forEach(([y1, y2, off]) => {
    for (let x = off; x < 1600; x += 260) s += `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}"/>`;
  });
  return s;
}

const shadow = (cx, cy, rx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="7" fill="${C.shadow}"/>`;

function railBars(x1, x2, y1, y2) {
  let s = "";
  for (let x = x1 + 22; x < x2 - 10; x += 24) s += `<line x1="${x}" y1="${y1 + 6}" x2="${x}" y2="${y2 - 6}"/>`;
  return s;
}

export function hastaOdasiSvg() {
  return `
<defs>
  <linearGradient id="r-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7F95AE"/><stop offset="1" stop-color="#B9C6D2"/></linearGradient>
  <linearGradient id="r-cyl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#DCE1DE"/><stop offset=".4" stop-color="#FBFCFA"/><stop offset="1" stop-color="#CDD4D0"/></linearGradient>
  <linearGradient id="r-pole" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9FAAA5"/><stop offset=".5" stop-color="#E6EAE8"/><stop offset="1" stop-color="#9FAAA5"/></linearGradient>
</defs>

<!-- ===== Duvar & zemin ===== -->
<rect width="1600" height="700" fill="${C.wall}"/>
<rect y="0" width="1600" height="34" fill="#F4F6F3"/>
<rect x="640" y="8" width="320" height="14" rx="7" fill="#FFFFFF" stroke="#E0E5E1"/>
<rect y="470" width="1600" height="230" fill="${C.wallLow}"/>
<rect y="466" width="1600" height="8" fill="#D6DDD7"/>
<rect y="688" width="1600" height="12" fill="#CDD4CE"/>
<rect y="700" width="1600" height="200" fill="${C.floor}"/>
<g stroke="${C.floorLine}" stroke-width="1.5">${planks()}</g>

<!-- ===== Kapı ===== -->
<rect x="28" y="164" width="190" height="536" rx="4" fill="#CBD3CD"/>
<rect x="42" y="178" width="162" height="522" rx="3" fill="${C.wood}"/>
<rect x="74" y="222" width="98" height="104" rx="4" fill="#E9EEEA" stroke="#C3B497"/>
<rect x="86" y="200" width="74" height="12" rx="3" fill="#F6F2EA"/>
<text x="111" y="210" font-family="Nunito Sans,Arial" font-size="9" font-weight="800" fill="${C.ink}">312</text>
<rect x="176" y="430" width="22" height="9" rx="4" fill="${C.metalDark}"/>
<circle cx="182" cy="434" r="7" fill="${C.metal}"/>

<!-- HATA: girişteki el dezenfektanı boş ve tarihi geçmiş -->
<rect x="222" y="318" width="40" height="102" rx="7" fill="${C.white}" stroke="${C.line}"/>
<rect x="222" y="318" width="40" height="16" rx="7" fill="#C9D4CE"/>
<rect x="231" y="344" width="22" height="40" rx="4" fill="#F1F3F1" stroke="#C7CFCA"/>
<rect x="233" y="380" width="18" height="2" fill="#D9DFDA"/>
<rect x="229" y="392" width="26" height="7" rx="2" fill="#F5F0D8"/>
<text x="230" y="397.5" font-family="Nunito Sans,Arial" font-size="4.6" font-weight="700" fill="#6B624A">SKT 03.2026</text>
<rect x="234" y="405" width="16" height="7" rx="2" fill="#D3DAD5"/>

<!-- ===== HATA: sabitlenmemiş oksijen tüpü ===== -->
${shadow(294, 794, 38)}
<g transform="rotate(2.2 294 794)">
  <rect x="270" y="446" width="48" height="348" rx="22" fill="url(#r-cyl)" stroke="#C3CBC6"/>
  <path d="M270 476 q0 -34 24 -38 q24 4 24 38z" fill="#6FA488"/>
  <rect x="287" y="414" width="14" height="26" rx="3" fill="${C.metalDark}"/>
  <rect x="280" y="404" width="28" height="11" rx="3" fill="#77837D"/>
  <circle cx="312" cy="406" r="10" fill="${C.white}" stroke="#77837D" stroke-width="2.5"/>
  <line x1="312" y1="406" x2="316" y2="401" stroke="#A9534B" stroke-width="1.6"/>
  <rect x="272" y="560" width="44" height="40" fill="${C.white}" opacity=".85"/>
  <text x="283" y="586" font-family="Nunito Sans,Arial" font-size="15" font-weight="800" fill="#4E8A6C">O₂</text>
</g>

<!-- ===== Lavabo bölümü ===== -->
<rect x="336" y="410" width="146" height="78" fill="#F3F5F2"/>
<g stroke="#E1E6E2"><line x1="336" y1="436" x2="482" y2="436"/><line x1="336" y1="462" x2="482" y2="462"/><line x1="384" y1="410" x2="384" y2="488"/><line x1="433" y1="410" x2="433" y2="488"/></g>
<rect x="352" y="436" width="26" height="46" rx="5" fill="${C.white}" stroke="${C.line}"/>
<rect x="357" y="448" width="16" height="26" rx="3" fill="#E7C7D4"/>
<rect x="402" y="402" width="68" height="78" rx="8" fill="${C.white}" stroke="${C.line}"/>
<rect x="414" y="466" width="44" height="5" rx="2" fill="#E2E7E3"/>
<rect x="340" y="560" width="140" height="128" rx="3" fill="#F5F7F4" stroke="#CBD3CD"/>
<line x1="410" y1="568" x2="410" y2="682" stroke="#CBD3CD"/>
<rect x="398" y="590" width="4" height="22" rx="2" fill="${C.metal}"/><rect x="418" y="590" width="4" height="22" rx="2" fill="${C.metal}"/>
<rect x="332" y="548" width="156" height="13" rx="3" fill="#DDE3DE" stroke="#C3CBC6"/>
<path d="M352 548 h66 l-5 8 h-56z" fill="#C7D0CA"/>
<path d="M378 548 v-30 q0 -9 10 -9 h10 q7 0 7 7 v5" stroke="${C.metalDark}" stroke-width="5" fill="none" stroke-linecap="round"/>
<!-- HATA: kesici-delici kutusu dolu, kapak açık -->
<g>
  <path d="M440 484 L 476 474 L 478 480 L 442 490 Z" fill="#E2B33C" stroke="#B98F27"/>
  <path d="M440 488 h44 l-3 60 h-38z" fill="#EAC24A" stroke="#B98F27"/>
  <rect x="440" y="486" width="44" height="6" rx="2" fill="#D7A93A"/>
  <line x1="444" y1="500" x2="480" y2="500" stroke="#B98F27" stroke-width="1" stroke-dasharray="3 2"/>
  <g stroke="#8C9792" stroke-width="1.6" stroke-linecap="round"><line x1="452" y1="490" x2="449" y2="481"/><line x1="463" y1="490" x2="466" y2="480"/><line x1="472" y1="491" x2="470" y2="483"/></g>
  <text x="447" y="526" font-family="Nunito Sans,Arial" font-size="6.5" font-weight="800" fill="#7A5E14">KESİCİ</text>
  <text x="447" y="535" font-family="Nunito Sans,Arial" font-size="6.5" font-weight="800" fill="#7A5E14">DELİCİ</text>
</g>
<!-- evsel atık kutusu -->
${shadow(370, 768, 34)}
<path d="M342 710 h56 l-4 58 h-48z" fill="#A9B3AD" stroke="#8C9792"/>
<rect x="338" y="702" width="64" height="10" rx="4" fill="#5F6964"/>

<!-- ===== Serum askısı, serum (etiketli), pompa ===== -->
${shadow(528, 796, 40)}
<g stroke="${C.metalDark}" stroke-width="4" stroke-linecap="round"><line x1="528" y1="786" x2="496" y2="794"/><line x1="528" y1="786" x2="560" y2="794"/></g>
<g fill="#5F6964"><circle cx="496" cy="796" r="4"/><circle cx="560" cy="796" r="4"/></g>
<rect x="524" y="140" width="7" height="648" rx="3" fill="url(#r-pole)"/>
<path d="M508 150 h40" stroke="${C.metalDark}" stroke-width="4" stroke-linecap="round"/>
<path d="M506 166 q0 -6 7 -6 h30 q7 0 7 6 v74 q0 12 -22 16 q-22 -4 -22 -16z" fill="#F4F8FA" stroke="#B9C9D2" stroke-width="1.5"/>
<path d="M508 196 h40 v44 q0 10 -20 14 q-20 -4 -20 -14z" fill="#DCEBF1"/>
<rect x="514" y="172" width="28" height="22" rx="2" fill="#FFFFFF" stroke="#C9D3CE"/>
<g stroke="#AEB8B3" stroke-width="1.2"><line x1="517" y1="178" x2="538" y2="178"/><line x1="517" y1="183" x2="534" y2="183"/><line x1="517" y1="188" x2="536" y2="188"/></g>
<rect x="525" y="256" width="6" height="10" fill="#E5ECEF" stroke="#B9C9D2"/>
<path d="M528 266 C 528 290, 520 310, 528 330" fill="none" stroke="#C8D6DD" stroke-width="2.5"/>
<rect x="503" y="330" width="54" height="64" rx="7" fill="#F6F8F6" stroke="${C.line}"/>
<rect x="510" y="337" width="40" height="22" rx="3" fill="#3E5651"/>
<text x="514" y="352" font-family="Nunito Sans,Arial" font-size="9.5" font-weight="700" fill="#BFE6D3">80 ml/s</text>
<rect x="510" y="366" width="40" height="8" rx="2" fill="#DCE2DE"/><rect x="510" y="378" width="40" height="9" rx="2" fill="#7FB09A"/>
<path d="M530 394 C 540 470, 640 560, 740 528 S 812 518 834 522" fill="none" stroke="#C8D6DD" stroke-width="2.5"/>

<!-- ===== Monitör ===== -->
<rect x="682" y="172" width="12" height="32" fill="${C.metal}"/>
<rect x="608" y="80" width="164" height="96" rx="9" fill="#46524D"/>
<rect x="616" y="88" width="148" height="76" rx="4" fill="#22302C"/>
<polyline points="622,126 640,126 645,112 650,138 655,120 660,126 690,126 695,112 700,138 705,120 710,126 726,126" fill="none" stroke="#8ED1A9" stroke-width="1.8"/>
<polyline points="622,150 636,146 650,150 664,146 678,150 692,146 706,150 726,148" fill="none" stroke="#9CC9E0" stroke-width="1.4"/>
<g font-family="Nunito Sans,Arial" font-weight="700"><text x="732" y="106" font-size="8" fill="#8ED1A9">HR</text><text x="732" y="122" font-size="14" fill="#8ED1A9">82</text>
<text x="732" y="136" font-size="7" fill="#9CC9E0">SpO₂</text><text x="732" y="152" font-size="13" fill="#9CC9E0">95</text></g>

<!-- ===== Gaz paneli: flowmetre + HATA: nemlendirici ===== -->
<rect x="566" y="204" width="270" height="124" rx="10" fill="#F7F8F6" stroke="#CDD4CE"/>
<rect x="578" y="212" width="246" height="9" rx="4" fill="#F4EEDC"/>
<circle cx="604" cy="236" r="9" fill="${C.white}" stroke="#6FA488" stroke-width="3"/>
<rect x="596" y="244" width="16" height="16" rx="4" fill="#E5F1EA" stroke="#6FA488" stroke-width="1.5"/>
<circle cx="604" cy="252" r="3" fill="#6FA488"/>
<rect x="590" y="262" width="28" height="58" rx="7" fill="#F2F6F7" stroke="#A9BAC1" stroke-width="1.5"/>
<rect x="594" y="262" width="20" height="5" rx="2" fill="#D3DDE1"/>
<g stroke="#9AAAB1" stroke-width="1"><line x1="618" y1="278" x2="622" y2="278"/><line x1="618" y1="300" x2="622" y2="300"/></g>
<text x="623" y="280" font-family="Nunito Sans,Arial" font-size="4.5" fill="#7F8E95">MAX</text>
<text x="623" y="302" font-family="Nunito Sans,Arial" font-size="4.5" fill="#7F8E95">MIN</text>
<rect x="592" y="306" width="24" height="12" rx="5" fill="#DCD8C3" opacity=".9"/>
<line x1="604" y1="268" x2="604" y2="314" stroke="#BCC9CE" stroke-width="1.2"/>
<circle cx="664" cy="236" r="9" fill="${C.white}" stroke="#D2B455" stroke-width="3"/>
<text x="655" y="258" font-family="Nunito Sans,Arial" font-size="8" font-weight="800" fill="#9C8540">VAK</text>
<g><rect x="700" y="226" width="30" height="30" rx="5" fill="${C.white}" stroke="#C9D0CB"/><circle cx="710" cy="241" r="2.5" fill="#7E8A84"/><circle cx="720" cy="241" r="2.5" fill="#7E8A84"/>
<rect x="736" y="226" width="30" height="30" rx="5" fill="${C.white}" stroke="#C9D0CB"/><circle cx="746" cy="241" r="2.5" fill="#7E8A84"/><circle cx="756" cy="241" r="2.5" fill="#7E8A84"/></g>
<rect x="700" y="270" width="66" height="26" rx="5" fill="#EFF2EF" stroke="#C9D0CB"/>
<rect x="786" y="226" width="34" height="34" rx="6" fill="${C.white}" stroke="#C9D0CB"/><circle cx="803" cy="243" r="6" fill="#D9DFDB"/>

<!-- ===== Hasta bilgi kartı ===== -->
<rect x="848" y="178" width="176" height="124" rx="8" fill="${C.white}" stroke="#CDD4CE"/>
<rect x="848" y="178" width="176" height="24" rx="8" fill="#5E7A72"/><rect x="848" y="192" width="176" height="10" fill="#5E7A72"/>
<g font-family="Nunito Sans,Arial">
  <text x="860" y="194" font-size="10.5" font-weight="800" fill="#FFFFFF" letter-spacing=".8">HASTA BİLGİ KARTI</text>
  <text x="860" y="222" font-size="15" font-weight="800" fill="${C.ink}">Ayşe KARA</text>
  <text x="860" y="238" font-size="9.5" fill="#66736D">Oda 312 · Yatak 1 · D.T. 14.02.1951</text>
  <text x="860" y="268" font-size="10" font-weight="700" fill="#8D4A43">Alerji: Penisilin</text>
  <text x="860" y="288" font-size="10" font-weight="700" fill="#8A6A2E">Düşme riski: Yüksek</text>
</g>

<!-- ===== Saat ===== -->
<circle cx="1112" cy="130" r="28" fill="${C.white}" stroke="#7E8A84" stroke-width="3"/>
<g stroke="#56625C" stroke-linecap="round" stroke-width="2.5"><line x1="1112" y1="130" x2="1100" y2="122"/><line x1="1112" y1="130" x2="1112" y2="112"/></g>

<!-- ===== Pencere (gece) ===== -->
<rect x="1180" y="100" width="232" height="290" rx="6" fill="#F6F7F5" stroke="#CDD4CE" stroke-width="2"/>
<rect x="1194" y="114" width="204" height="262" fill="url(#r-sky)"/>
<circle cx="1352" cy="160" r="15" fill="#EEF0E6" opacity=".9"/>
<g fill="#E8ECEF" opacity=".7"><circle cx="1230" cy="150" r="1.6"/><circle cx="1280" cy="132" r="1.3"/><circle cx="1308" cy="190" r="1.4"/><circle cx="1220" cy="220" r="1.2"/></g>
<g fill="#6E8399"><rect x="1200" y="300" width="38" height="76"/><rect x="1244" y="276" width="44" height="100"/><rect x="1296" y="318" width="34" height="58"/><rect x="1336" y="292" width="56" height="84"/></g>
<g fill="#E9DFA8" opacity=".75"><rect x="1252" y="290" width="6" height="6"/><rect x="1270" y="310" width="6" height="6"/><rect x="1348" y="306" width="6" height="6"/><rect x="1210" y="320" width="6" height="6"/></g>
<rect x="1294" y="114" width="5" height="262" fill="#F6F7F5"/>
<path d="M1180 96 h46 q-8 150 0 300 h-46z" fill="#E6DDCB"/><path d="M1412 96 h-46 q8 150 0 300 h46z" fill="#E6DDCB"/>
<rect x="1172" y="390" width="248" height="10" rx="3" fill="#E8EBE7" stroke="#CDD4CE"/>

<!-- HATA: gece lambası kapalı + priz -->
<rect x="1326" y="600" width="40" height="40" rx="10" fill="${C.white}" stroke="${C.line}"/>
<circle cx="1346" cy="620" r="11" fill="#B8BFBB"/>
<circle cx="1342" cy="616" r="3" fill="#CDD3CF"/>
<rect x="1344" y="648" width="28" height="26" rx="4" fill="${C.white}" stroke="${C.line}"/>
<circle cx="1353" cy="661" r="2.2" fill="#7E8A84"/><circle cx="1363" cy="661" r="2.2" fill="#7E8A84"/>

<!-- ===== Komodin + HATA: evden getirilen ilaçlar ===== -->
${shadow(1252, 768, 70)}
<rect x="1190" y="560" width="124" height="206" rx="6" fill="#E4D6BD" stroke="#C3B497"/>
<rect x="1184" y="552" width="136" height="12" rx="4" fill="#D6C5A6" stroke="#C3B497"/>
<line x1="1190" y1="620" x2="1314" y2="620" stroke="#C3B497"/>
<rect x="1236" y="586" width="32" height="5" rx="2" fill="#B8A684"/><rect x="1236" y="680" width="32" height="5" rx="2" fill="#B8A684"/>
<g>
  <rect x="1198" y="514" width="38" height="38" rx="2" fill="#FFFFFF" stroke="#C9D0CB"/>
  <rect x="1198" y="514" width="38" height="8" rx="2" fill="#7FA3C4"/>
  <text x="1200" y="533" font-family="Nunito Sans,Arial" font-size="5.5" font-weight="700" fill="#4E5A55">Metformin</text>
  <text x="1200" y="541" font-family="Nunito Sans,Arial" font-size="5" fill="#66736D">1000 mg</text>
  <rect x="1240" y="524" width="30" height="28" rx="2" fill="#FBF6EC" stroke="#D3C7AE"/>
  <rect x="1240" y="524" width="30" height="6" rx="2" fill="#D49A6A"/>
  <text x="1242" y="540" font-family="Nunito Sans,Arial" font-size="5.3" font-weight="700" fill="#4E5A55">Ramipril</text>
  <rect x="1273" y="530" width="12" height="22" rx="3" fill="#E9B98F" opacity=".9"/>
  <rect x="1272" y="526" width="14" height="6" rx="2" fill="#FFFFFF" stroke="#C9D0CB"/>
</g>
<path d="M1292 526 h16 l-2 26 h-12z" fill="#EAF3F5" stroke="#B9C9D2"/>
<rect x="1294" y="536" width="12" height="15" fill="#D6E7EE"/>

<!-- ===== İlaç arabası + HATA: etiketsiz enjektör, açıkta KCl ===== -->
${shadow(1502, 800, 86)}
<rect x="1424" y="524" width="156" height="248" rx="8" fill="#F2F4F1" stroke="#BAC4BE"/>
<rect x="1418" y="514" width="168" height="14" rx="5" fill="#DCE2DD" stroke="#BAC4BE"/>
<g stroke="#C6CEC8"><line x1="1424" y1="590" x2="1580" y2="590"/><line x1="1424" y1="650" x2="1580" y2="650"/><line x1="1424" y1="712" x2="1580" y2="712"/></g>
<g fill="${C.metal}"><rect x="1484" y="558" width="36" height="5" rx="2"/><rect x="1484" y="618" width="36" height="5" rx="2"/><rect x="1484" y="680" width="36" height="5" rx="2"/><rect x="1484" y="740" width="36" height="5" rx="2"/></g>
<circle cx="1564" cy="560" r="4" fill="#9AA5A0"/><rect x="1563" y="558" width="2" height="5" fill="#6B7671"/>
<g fill="#5F6964"><circle cx="1440" cy="786" r="9"/><circle cx="1564" cy="786" r="9"/></g>
<rect x="1500" y="530" width="74" height="18" rx="3" fill="#E8F0EC" stroke="#BAC4BE"/>
<text x="1505" y="542" font-family="Nunito Sans,Arial" font-size="7" font-weight="700" fill="#5E7A72">Oda 310-316</text>
<!-- böbrek küvet + etiketsiz enjektör -->
<path d="M1432 506 q36 -10 72 0 q-4 10 -36 10 q-32 0 -36 -10z" fill="#C9D2CE" stroke="#A7B2AD"/>
<rect x="1442" y="496" width="44" height="8" rx="2" fill="#F5F9FA" stroke="#A9B6BC"/>
<rect x="1444" y="497.5" width="26" height="5" fill="#E3EEF2"/>
<rect x="1486" y="499" width="12" height="2" fill="#9AA5A0"/><rect x="1436" y="498" width="6" height="4" fill="#7E8A84"/>
<line x1="1426" y1="500" x2="1436" y2="500" stroke="#9AA5A0" stroke-width="1"/>
<!-- KCl kutusu (kırmızı etiket yok) -->
<rect x="1514" y="472" width="58" height="42" rx="2" fill="#FFFFFF" stroke="#C9D0CB"/>
<rect x="1514" y="472" width="58" height="9" rx="2" fill="#B7C5BE"/>
<text x="1518" y="494" font-family="Nunito Sans,Arial" font-size="7.5" font-weight="800" fill="#4E5A55">KCl %15</text>
<text x="1518" y="505" font-family="Nunito Sans,Arial" font-size="5.5" fill="#66736D">10 ml × 10 amp.</text>
<g fill="#EAF2F4" stroke="#B9C9D2"><rect x="1520" y="462" width="6" height="12" rx="2"/><rect x="1530" y="462" width="6" height="12" rx="2"/><rect x="1540" y="462" width="6" height="12" rx="2"/></g>

<!-- ===== HASTA YATAĞI ===== -->
${shadow(860, 796, 320)}
<rect x="598" y="742" width="526" height="16" rx="6" fill="#9AA5A0"/>
<rect x="650" y="590" width="24" height="156" rx="4" fill="url(#r-pole)"/>
<rect x="1048" y="590" width="24" height="156" rx="4" fill="url(#r-pole)"/>
<rect x="612" y="690" width="500" height="9" rx="4" fill="#B8C1BC"/>
<!-- tekerlekler: HATA fren pedalları serbest (yeşil/gezinti konumu) -->
<g>
  <rect x="594" y="756" width="16" height="12" rx="3" fill="#77837D"/><circle cx="602" cy="780" r="14" fill="#4E5853"/><circle cx="602" cy="780" r="5" fill="#A9B3AD"/>
  <rect x="612" y="760" width="22" height="7" rx="2" fill="#7FB09A" transform="rotate(-14 612 763)"/>
  <rect x="1114" y="756" width="16" height="12" rx="3" fill="#77837D"/><circle cx="1122" cy="780" r="14" fill="#4E5853"/><circle cx="1122" cy="780" r="5" fill="#A9B3AD"/>
  <rect x="1094" y="760" width="22" height="7" rx="2" fill="#7FB09A" transform="rotate(14 1116 763)"/>
</g>
<!-- tabla, başlık, ayaklık -->
<rect x="578" y="562" width="568" height="30" rx="6" fill="#DCE2DE" stroke="#B4BEB8"/>
<rect x="554" y="436" width="32" height="176" rx="12" fill="#E5E9E6" stroke="#B4BEB8" stroke-width="2"/>
<rect x="560" y="452" width="20" height="90" rx="7" fill="#9DB3AA"/>
<rect x="1134" y="466" width="30" height="146" rx="12" fill="#E5E9E6" stroke="#B4BEB8" stroke-width="2"/>
<rect x="1140" y="482" width="18" height="64" rx="7" fill="#9DB3AA"/>
<!-- yatak ayak ucu el antiseptiği (dolu, doğru) -->
<rect x="1166" y="478" width="18" height="44" rx="5" fill="#F4F8FA" stroke="#B9C9D2"/>
<rect x="1168" y="490" width="14" height="30" rx="3" fill="#B8D4E6"/>
<rect x="1170" y="472" width="10" height="7" rx="2" fill="#6C8FA8"/>
<!-- şilte -->
<rect x="582" y="518" width="556" height="48" rx="16" fill="#EAF0EC" stroke="#C3CEC8"/>
<!-- yastık ve baş -->
<path d="M596 522 q-10 -34 22 -40 h72 q24 4 20 40z" fill="#FFFFFF" stroke="#D5DCD7" stroke-width="1.5"/>
<circle cx="652" cy="484" r="27" fill="${C.skin}"/>
<path d="M626 480 q2 -27 30 -29 q24 0 28 20 q-14 -8 -32 -4 q-14 4 -26 13z" fill="#CFCFCB"/>
<path d="M642 492 q5 3 10 0" fill="none" stroke="#A47A5E" stroke-width="2" stroke-linecap="round"/>
<path d="M660 488 q4 2 8 0" fill="none" stroke="#A47A5E" stroke-width="2" stroke-linecap="round"/>
<ellipse cx="677" cy="493" rx="4" ry="6" fill="${C.skinShade}"/>
<path d="M672 522 q-4 -24 18 -28 h40 q10 6 6 28z" fill="${C.gown}"/>
<!-- battaniye -->
<path d="M716 500 C 776 482, 858 486, 900 498 C 950 486, 994 478, 1032 488 C 1084 498, 1120 508, 1132 524 L 1136 568 L 714 568 Z" fill="${C.blanket}"/>
<path d="M716 500 C 720 518, 720 548, 714 568 L 740 568 C 744 546, 744 518, 738 496z" fill="#F4F6F3"/>
<path d="M920 512 C 960 520, 1020 514, 1080 506" fill="none" stroke="${C.blanketDark}" stroke-width="2" opacity=".6"/>
<!-- kol: damar yolu pansumanı (HATA) + kimlik bilekliği (HATA) -->
<path d="M730 510 L 792 518" stroke="${C.gown}" stroke-width="20" stroke-linecap="round"/>
<path d="M792 518 L 884 528" stroke="${C.skin}" stroke-width="15" stroke-linecap="round"/>
<ellipse cx="900" cy="530" rx="13" ry="8.5" fill="${C.skin}"/>
<rect x="818" y="512" width="34" height="22" rx="4" fill="#FFFFFF" fill-opacity=".72" stroke="#DCE4E8"/>
<circle cx="832" cy="524" r="3.4" fill="#B97B66" opacity=".55"/><circle cx="838" cy="527" r="2" fill="#B97B66" opacity=".4"/>
<rect x="866" y="517" width="11" height="22" rx="3" fill="#FFFFFF" stroke="#C3CBC6"/>
<rect x="862" y="536" width="32" height="15" rx="2" fill="#FFFFFF" stroke="#C3CBC6"/>
<text x="864.5" y="546" font-family="Nunito Sans,Arial" font-size="6.6" font-weight="800" fill="#4E5A55">M. AYDIN</text>
<!-- kenarlık (baş tarafı kalkık) -->
<g>
  <rect x="610" y="504" width="186" height="54" rx="12" fill="#FFFFFF" fill-opacity=".22" stroke="#9AA5A0" stroke-width="5"/>
  <g stroke="#9AA5A0" stroke-width="3" opacity=".75">${railBars(610, 796, 504, 558)}</g>
</g>
<!-- HATA: ayak tarafı kenarlık indirilmiş -->
<g>
  <rect x="820" y="572" width="292" height="44" rx="12" fill="#FFFFFF" fill-opacity=".18" stroke="#9AA5A0" stroke-width="5"/>
  <g stroke="#9AA5A0" stroke-width="3" opacity=".75">${railBars(820, 1112, 572, 616)}</g>
</g>

<!-- HATA: idrar torbası yerde -->
<path d="M966 568 C 968 640, 956 700, 960 768" fill="none" stroke="#D7CFA8" stroke-width="3"/>
<rect x="954" y="604" width="16" height="5" rx="2" fill="#8C9792"/>
<path d="M928 770 q0 -10 10 -10 h44 q10 0 10 10 v28 q0 8 -8 8 h-48 q-8 0 -8 -8z" fill="#F2EDD2" stroke="#C9BF94"/>
<rect x="934" y="782" width="52" height="18" rx="3" fill="#EAD99A" opacity=".75"/>
<g stroke="#C9BF94" stroke-width="1"><line x1="980" y1="770" x2="986" y2="770"/><line x1="980" y1="778" x2="986" y2="778"/><line x1="980" y1="786" x2="986" y2="786"/></g>

<!-- HATA: çağrı zili yerde -->
<path d="M700 600 C 706 660, 650 700, 676 802" fill="none" stroke="#8C9792" stroke-width="2"/>
<rect x="636" y="802" width="58" height="22" rx="10" fill="#E8ECE9" stroke="#9AA5A0" transform="rotate(-6 665 813)"/>
<circle cx="652" cy="813" r="6" fill="#C98A82" stroke="#A86F67"/>
<rect x="664" y="809" width="18" height="3" rx="1.5" fill="#B4BEB8" transform="rotate(-6 673 810)"/>

<!-- HATA: kaygan tabanlı terlikler -->
<g>
  <path d="M1114 850 q2 -14 22 -16 q20 2 22 12 q-2 8 -22 9 q-20 0 -22 -5z" fill="#E9D6DA" stroke="#CBB3B9"/>
  <path d="M1160 856 q2 -14 22 -16 q20 2 22 12 q-2 8 -22 9 q-20 0 -22 -5z" fill="#E9D6DA" stroke="#CBB3B9"/>
  <path d="M1118 845 q14 -8 26 0" fill="none" stroke="#D8C0C6" stroke-width="3"/>
  <path d="M1164 851 q14 -8 26 0" fill="none" stroke="#D8C0C6" stroke-width="3"/>
</g>

<!-- HATA: zeminde dağınık kablo -->
<g fill="none" stroke="#5C6661" stroke-linecap="round" stroke-width="4">
  <path d="M1358 674 C 1358 700, 1356 720, 1340 760 C 1320 806, 1220 800, 1196 836 C 1176 868, 1290 884, 1360 866 C 1420 850, 1470 876, 1504 846"/>
  <path d="M1260 818 C 1300 806, 1336 830, 1320 852 C 1306 872, 1268 860, 1276 838"/>
</g>
`;
}
