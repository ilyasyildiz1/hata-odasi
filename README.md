# HATA ODASI — Hasta Güvenliği Simülasyonu

Hemşirelik eğitimi için oyunlaştırılmış bir "hata bulma" simülasyonu. Oyuncu gece kontrolü için hasta odasına girer
ve 7 dakika içinde "HATA ODASI" Word belgesindeki 15 hatayı bulmaya çalışır. Hatalar 5 başlık altındadır:
Düşmelerin Önlenmesi, İlaç Güvenliği, Enfeksiyon Kontrolü, Kimlik Doğrulama ve Cihaz Güvenliği ve Acil Durum Hazırlığı.
Hatalar bilerek küçük ayrıntılar olarak çizilmiştir. Odada hatalı görünebilen ama doğru olan nesneler de vardır.

Akış: **Ana Sayfa (oyuncu adı) → Oyun Talimatları → Oyun → Sonuç ve Performans Raporu**
Diğer ekranlar: **Skorlar** (genel sıralama ve kişinin önceki oyunları) ve **Yönetim** (kalite birimi paneli).

---

## 1. Çalıştırma

Derleme aracı gerekmez. Bilgisayarda yalnızca Python 3 bulunması yeterlidir (macOS'ta kurulu).

- **En kolay yol:** `baslat.command` dosyasına çift tıklayın. Tarayıcı `http://127.0.0.1:5173` adresinde açılır.
- **Terminalden:**
  ```bash
  cd hata-odasi
  python3 sunucu.py        # isteğe bağlı port: python3 sunucu.py 8080
  ```

> `index.html` dosyasını doğrudan çift tıklayarak açmayın. Tarayıcılar ES modüllerini `file://` üzerinden yüklemez.

İlk açılışta tarayıcının internete erişmesi gerekir. React, yazı tipi ve PDF kütüphaneleri
esm.sh / Google Fonts üzerinden yüklenir. Kurum ağı bu adresleri engelliyorsa aşağıdaki "Vite'a geçiş"
bölümüne bakın.

## 2. Dosya yapısı

```
hata-odasi/
├── index.html                  Giriş sayfası + bağımlılık haritası (importmap)
├── sunucu.py                   Önbelleksiz yerel sunucu
├── baslat.command              Çift tıkla başlat (macOS)
├── _eski/                      Önceki sürümler (ilk prototip ve v2-2026-09)
└── src/
    ├── main.js                 React uygulamasını başlatır
    ├── App.js                  Rota tablosu (#/senaryolar, #/oyun/…, #/yonetim …)
    ├── lib.js                  React + htm (JSX yerine html`` şablonları)
    ├── types/index.js          Veri modelleri (JSDoc): Scenario, RoomError, Player, GameResult …
    ├── data/
    │   ├── categories.js       Hata kategorileri + kategoriye özel geri bildirim metinleri
    │   ├── scenarios.js        Senaryo kataloğu (aktif / yakında)
    │   ├── scenarios/hastaOdasi.js   Hasta Odası: 15 hata, hatasız nesneler, hasta bilgisi
    │   ├── badges.js           Rozet tanımları
    │   └── users.js            Demo kullanıcılar ve birim listesi
    ├── utils/
    │   ├── scoring.js          MERKEZİ PUANLAMA (tüm skor kuralları burada)
    │   ├── feedback.js         Performansa göre eğitimsel geri bildirim üretimi
    │   ├── analytics.js        Yönetici paneli istatistikleri
    │   ├── achievements.js     Rozet hesaplama
    │   ├── geometry.js         Tıklama noktası → hata alanı eşleştirme
    │   ├── format.js / random.js
    ├── services/
    │   ├── storage.js          Kalıcı depolama katmanı (şimdilik localStorage)
    │   ├── resultService.js    Oyun sonuçları (kaydet / listele / demo)
    │   ├── userService.js      Kullanıcılar ve aktif oyuncu
    │   ├── soundService.js     Ses altyapısı (varsayılan kapalı)
    │   ├── exportService.js    PDF raporu ve Excel/CSV dışa aktarma
    │   ├── demoSeed.js         Tekrarlanabilir demo sonuçlar
    │   └── store.js            Basit yayın/abone deposu
    ├── hooks/
    │   ├── useGameEngine.js    Oyun motoru: süre, tespit, ceza, ipucu, sonuç
    │   ├── useStore.js         Servisleri React'e bağlar
    │   └── useRoute.js         Hash yönlendirici
    ├── components/
    │   ├── room/RoomStage.js   Etkileşimli oda sahnesi (tıklama, vurgular, işaretler)
    │   ├── room/rooms/         Oda illüstrasyonları (SVG) + kayıt (index.js)
    │   ├── game/               Zamanlayıcı, ilerleme, geri bildirim kartı, tespit günlüğü
    │   ├── results/            Kategori çubukları, hata listesi, rozet kartı
    │   ├── charts/             Bağımlılıksız grafikler (çubuk, sütun, çizgi, skor halkası)
    │   ├── layout/Header.js    Üst menü, logo, ses düğmesi, alt bilgi
    │   └── ui/                 Button, Card, Chip, ProgressBar, Stat, Modal, Icon …
    ├── pages/                  Home, Briefing, Game, Result, Scores, Admin
    └── assets/styles.css       Tasarım sistemi (renkler, tipografi, düzen, animasyon)
```

## 3. Yeni senaryo ekleme

1. `src/data/scenarios/` altında yeni bir veri dosyası oluşturun, örneğin `yogunBakim.js`.
   Dosyada `ERRORS`, `OBJECTS` ve `PATIENT` dışa aktarımları olsun; `hastaOdasi.js` örnek alınabilir.
2. Oda çizimini `src/components/room/rooms/yogunBakimSvg.js` olarak ekleyin. Çizim `viewBox 0 0 1600 900`
   ölçüsünde olmalı ve SVG içeriğini döndüren bir fonksiyon olarak yazılmalı.
3. `src/components/room/rooms/index.js` içindeki `ROOM_REGISTRY` nesnesine `"yogun-bakim": yogunBakimSvg` satırını ekleyin.
4. Senaryo nesnesini (`id, name, timeLimit, roomComponent: "yogun-bakim", patient, errors, objects`)
   `src/data/scenarios.js` içindeki `SCENARIOS` listesine ekleyin. Ana sayfa `DEFAULT_SCENARIO_ID` değerindeki senaryoyu açar.

Talimatlar, oyun, rapor ve yönetici paneli yeni senaryoyu otomatik olarak kullanır.

## 4. Yeni hata ekleme

`src/data/scenarios/hastaOdasi.js` içindeki `ERRORS` dizisine bir nesne ekleyin:

```js
{
  id: "yere-dokulmus-sivi",            // benzersiz
  title: "Zemindeki sıvı",             // rapor/listede görünen kısa ad
  found: "Zeminde kayma riski oluşturan sıvı var.",  // tespit anındaki mesaj
  description: "…",                    // hatanın açıklaması
  category: "dusme",                   // data/categories.js'teki id
  points: 1,                           // ağırlık (kritik için 2)
  critical: false,
  hint: "Zemini kontrol edin.",
  importance: "Neden önemli? …",
  action: "Doğru uygulama …",
  areas: [{ x: 900, y: 780, width: 120, height: 60 }],  // oda koordinatı (1600x900)
}
```

Ardından nesneyi oda çiziminde **hatalı hâliyle** çizin (`hastaOdasiSvg.js`).
Koordinat bulmak için oyunda tarayıcı konsoluna şunu yazıp odaya tıklayabilirsiniz:
`document.querySelector('.room-svg').addEventListener('click', e => { const s = e.currentTarget, p = s.createSVGPoint(); p.x = e.clientX; p.y = e.clientY; console.log(p.matrixTransform(s.getScreenCTM().inverse())); })`

Puanlar ağırlık olarak kullanılır. Toplam ağırlık otomatik olarak **900** puana ölçeklenir; kalan **100** puan
süre bonusudur. Böylece hata eklendiğinde en yüksek skor her zaman 1000 olarak kalır.

**Aynı noktada iki hata:** İki hatanın alanları çakışırsa ilk tıklamada biri, ikinci tıklamada diğeri bulunur
(örnek: kimlik bilekliği ve alerji bilekliği).

**Yeni kategori:** `src/data/categories.js` dosyasına `{ id, name, short, color, strength, improvement }` ekleyin.
Renk her yerde otomatik kullanılır.

**Yeni rozet:** `src/data/badges.js` dosyasına `check(result, { scenario, history })` fonksiyonu olan bir nesne ekleyin.

**Puan kuralları:** `src/utils/scoring.js` içindeki `SCORING` nesnesi yanlış tıklama (−25), ipucu (−30),
en fazla ipucu sayısı (3) ve bonus değerlerini tutar. Başarı eşikleri (`GRADES`) aynı dosyadadır.

## 5. Yeni kullanıcı ekleme

- **Uygulamadan:** Ana sayfadaki oyuncu kutusuna ad soyad ve birim yazılır. Kullanıcı o tarayıcıya kaydedilir.
  "Değiştir" bağlantısıyla başka bir oyuncuya geçilir.
- **Kod ile (herkese görünen hazır kullanıcılar):** `src/data/users.js` içindeki `DEMO_USERS` listesine ekleyin.
  Birim listesi aynı dosyadaki `UNITS` dizisindedir.
- **Demo sonuçlar:** Yönetim Paneli → "Demo verileri kaldır / yükle".

> Şu an veriler **tarayıcıda** (localStorage) tutulur. Aynı bilgisayar ve tarayıcıdaki sonuçlar birlikte görünür.
> Farklı cihazlardan toplu raporlama için ortak bir veritabanına geçiş gerekir (aşağıya bakın).

## 6. Build / yayınlama

Bu sürümde derleme adımı yoktur. `hata-odasi/` klasörünün tamamı olduğu gibi herhangi bir statik
web sunucusuna kopyalanabilir: IIS, Apache, Nginx, kurum intraneti, GitHub Pages veya Netlify.
Sunucunun `.js` dosyalarını `text/javascript` türüyle sunması yeterlidir.

### Vite + TypeScript'e geçiş (Node.js kurulduğunda)

Kod, bu geçiş için hazırlanmıştır:
1. `npm create vite@latest hata-odasi-app -- --template react-ts`
2. `src/` klasörünü kopyalayın; `html\`` şablonlarını JSX'e, `.js` dosyalarını `.tsx/.ts` uzantısına çevirin
   ve `types/index.js` içindeki JSDoc tiplerini `interface` tanımlarına dönüştürün.
3. `npm install jspdf html2canvas` ile PDF kütüphanelerini ekleyin. Böylece CDN bağımlılığı kalmaz ve kapalı ağda da çalışır.
4. `npm run build` komutu `dist/` klasörünü üretir; bu klasör yayınlanır.

### Gerçek veritabanına geçiş

Tüm okuma ve yazma işlemleri `src/services/storage.js` içindeki `createCollection()` üzerinden geçer.
Bu fonksiyonu bir REST API, Firebase veya Supabase istemcisiyle değiştirmek yeterlidir.
Sonuç kaydı alanları: `player_id, player_name, unit, scenario_id, score, duration, found_errors,
missed_errors, wrong_clicks, hints_used, category_scores, time_bonus, created_at`.
