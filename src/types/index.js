/**
 * Uygulama veri modelleri (JSDoc).
 * TypeScript'e geçişte bu dosya doğrudan `types/index.ts` arayüzlerine dönüşür.
 *
 * @typedef {"hasta-guvenligi"|"ilac-guvenligi"|"enfeksiyon"|"calisan-guvenligi"|string} CategoryId
 *
 * @typedef {Object} Category
 * @property {CategoryId} id
 * @property {string} name          Görünen ad
 * @property {string} short         Kısa ad (grafikler için)
 * @property {string} color         Tema rengi
 * @property {string} strength      Güçlü performans geri bildirimi
 * @property {string} improvement   Gelişim önerisi
 *
 * @typedef {Object} RoomError       Odaya yerleştirilmiş bir hata
 * @property {string} id
 * @property {string} title          Kısa başlık (liste/rapor)
 * @property {string} found          Tespit anında gösterilen cümle
 * @property {string} description    Hatanın açıklaması
 * @property {CategoryId} category
 * @property {string} [tag]          Alt başlık (ör. "Düşme riski")
 * @property {number} points         Ağırlık puanı (skor fonksiyonunda 900'e ölçeklenir)
 * @property {boolean} critical
 * @property {string} hint           İpucu metni
 * @property {string} importance     Neden önemli?
 * @property {string} action         Doğru uygulama
 * @property {{x:number,y:number,width:number,height:number}[]} areas  Tıklama alanları (oda viewBox koordinatı)
 *
 * @typedef {Object} RoomObject      Hatasız (doğru) nesne — yanlış tıklamada açıklama gösterir
 * @property {string} id
 * @property {string} name
 * @property {string} note
 * @property {{x:number,y:number,width:number,height:number}[]} areas
 *
 * @typedef {Object} Scenario
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {"Başlangıç"|"Orta"|"İleri"} level
 * @property {number} timeLimit      saniye
 * @property {boolean} active
 * @property {string} icon
 * @property {Object} [patient]
 * @property {RoomError[]} [errors]
 * @property {RoomObject[]} [objects]
 * @property {string} [roomComponent]
 *
 * @typedef {Object} Player
 * @property {string} id
 * @property {string} name
 * @property {string} unit
 * @property {"hemsire"|"yonetici"} role
 * @property {boolean} [demo]
 *
 * @typedef {Object} GameResult      Veritabanına yazılacak kayıt
 * @property {string} id
 * @property {string} player_id
 * @property {string} player_name
 * @property {string} unit
 * @property {string} scenario_id
 * @property {number} score
 * @property {number} duration       saniye
 * @property {string[]} found_errors
 * @property {string[]} missed_errors
 * @property {number} wrong_clicks
 * @property {number} hints_used
 * @property {Object<string,number>} category_scores   yüzde (0-100)
 * @property {number} time_bonus
 * @property {string} created_at     ISO tarih
 * @property {boolean} [demo]
 */
export {};
