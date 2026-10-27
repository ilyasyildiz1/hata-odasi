// Başarım (rozet) tanımları. Yeni rozet: listeye `check(result, ctx)` fonksiyonu olan bir nesne ekleyin.
// ctx: { scenario, history } — history oyuncunun önceki sonuçlarıdır.
export const BADGES = [
  {
    id: "hata-avcisi", icon: "trophy", title: "Hata Avcısı", tone: "gold",
    description: "Senaryodaki hataların tamamını buldu.",
    check: (r, { scenario }) => r.found_errors.length === scenario.errors.length,
  },
  {
    id: "hizli-goz", icon: "bolt", title: "Hızlı Göz", tone: "blue",
    description: "Tüm hataları 4 dakikadan kısa sürede buldu.",
    check: (r, { scenario }) => r.found_errors.length === scenario.errors.length && r.duration < 240,
  },
  {
    id: "kusursuz", icon: "target", title: "Kusursuz", tone: "green",
    description: "Hiç yanlış tıklama yapmadan en az 5 hata buldu.",
    check: (r) => r.wrong_clicks === 0 && r.found_errors.length >= 5,
  },
  {
    id: "detayci", icon: "search", title: "Detaycı", tone: "purple",
    description: "Tüm kritik hataları buldu.",
    check: (r, { scenario }) => scenario.errors.filter((e) => e.critical).every((e) => r.found_errors.includes(e.id)),
  },
  {
    id: "bagimsiz", icon: "eye", title: "Keskin Gözlem", tone: "teal",
    description: "Hiç ipucu kullanmadan en az 12 hata buldu.",
    check: (r) => r.hints_used === 0 && r.found_errors.length >= 12,
  },
  {
    id: "ilk-adim", icon: "flag", title: "İlk Adım", tone: "slate",
    description: "İlk simülasyonunu tamamladı.",
    check: () => true,
  },
];

export const badgeById = (id) => BADGES.find((b) => b.id === id);
