// Hata kategorileri ("HATA ODASI" Word belgesindeki 5 başlık).
// Yeni kategori eklemek için bu listeye bir nesne eklemeniz yeterlidir; renk her yerde otomatik kullanılır.
/** @type {import('../types/index.js').Category[]} */
export const CATEGORIES = [
  {
    id: "dusme",
    name: "Düşmelerin Önlenmesi",
    short: "Düşme",
    color: "#B7772E",
    strength: "Yatak güvenliği, çağrı sistemi ve zemin düzeni gibi düşme risklerini başarıyla fark ettiniz.",
    improvement: "Hasta başı kontrolünde yatak kenarlıkları ve frenleri, çağrı zilinin erişimi, terlik ve zemin düzenini sistematik olarak kontrol etmeniz önerilir.",
  },
  {
    id: "ilac",
    name: "İlaç Güvenliği",
    short: "İlaç",
    color: "#7559A8",
    strength: "Evden getirilen ilaçlar, etiketleme ve yüksek riskli ilaçlarla ilgili riskleri doğru tespit ettiniz.",
    improvement: "İlaç mutabakatı, hazırlanan ilaçların anında etiketlenmesi ve yüksek riskli ilaçların kırmızı etiketle kilitli alanda saklanması kurallarını gözden geçirmeniz önerilir.",
  },
  {
    id: "enfeksiyon",
    name: "Enfeksiyon Kontrolü",
    short: "Enfeksiyon",
    color: "#2F8466",
    strength: "Kesici-delici atık, kateter bakımı, damar yolu ve el hijyeni konularındaki dikkatiniz güçlü.",
    improvement: "Kesici-delici kutusu doluluğu, idrar torbasının konumu, damar yolu pansumanı ve el antiseptiği kontrollerini rutin hâline getirmeniz önerilir.",
  },
  {
    id: "kimlik",
    name: "Kimlik Doğrulama",
    short: "Kimlik",
    color: "#3D6E9E",
    strength: "Hasta kimliği ve alerji bilgisini doğrulamaya yönelik farkındalığınız yüksek.",
    improvement: "Her temas öncesinde kimlik bilekliğini hasta bilgileriyle karşılaştırmanız ve alerjisi olan hastada kırmızı alerji bilekliğini kontrol etmeniz önerilir.",
  },
  {
    id: "cihaz",
    name: "Cihaz Güvenliği ve Acil Durum Hazırlığı",
    short: "Cihaz",
    color: "#A9534B",
    strength: "Oksijen tüpü ve oksijen sistemi gibi cihaz kaynaklı riskleri başarıyla tespit ettiniz.",
    improvement: "Basınçlı tüplerin sabitlenmesi ve oksijen nemlendiricisinin su seviyesi/yenilenme zamanı kontrollerini gözden geçirmeniz önerilir.",
  },
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id);
