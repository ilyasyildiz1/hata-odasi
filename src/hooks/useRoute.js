// Basit hash yönlendirici: #/sonuc/abc -> { path: "sonuc", params: ["abc"] }
import { useEffect, useState } from "../lib.js";

const parse = () => {
  const [path = "", ...params] = (location.hash.replace(/^#\/?/, "") || "").split("/").map(decodeURIComponent);
  return { path, params };
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const on = () => {
      setRoute(parse());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}

export const navigate = (to) => {
  location.hash = to.startsWith("#") ? to : `#${to}`;
};
