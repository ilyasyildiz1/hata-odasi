// Kalıcı depolama katmanı.
// Şu an tarayıcının localStorage alanını kullanır. Gerçek veritabanına geçişte yalnızca bu
// dosyadaki `createCollection` fonksiyonunu bir REST/Firebase/Supabase istemcisiyle değiştirmeniz
// yeterlidir; servisler aynı arayüzü (all / insert / update / remove / replaceAll) kullanır.
const PREFIX = "hata-odasi-v3:";

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.warn("Depolama yazılamadı:", e);
  }
}

/** Kayıt listesi (tablo) soyutlaması. */
export function createCollection(name) {
  let cache = read(name, []);
  return {
    all: () => cache,
    insert(item) {
      cache = [...cache, item];
      write(name, cache);
      return item;
    },
    update(id, patch) {
      cache = cache.map((x) => (x.id === id ? { ...x, ...patch } : x));
      write(name, cache);
    },
    remove(predicate) {
      cache = cache.filter((x) => !predicate(x));
      write(name, cache);
    },
    replaceAll(list) {
      cache = list;
      write(name, cache);
    },
  };
}

/** Tekil ayar değeri. */
export const settings = {
  get: (key, fallback) => read(`setting:${key}`, fallback),
  set: (key, value) => write(`setting:${key}`, value),
};
