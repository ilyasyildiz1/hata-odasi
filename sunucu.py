"""Hata Odası yerel sunucusu.

Kullanım:  python3 sunucu.py [port] [--ac]
  port  : tercih edilen port (varsayılan 5173). Doluysa sıradaki boş port kullanılır.
  --ac  : sunucu başlayınca tarayıcıda aç.
Dosyaları önbelleksiz sunar; böylece kodda yapılan değişiklikler tarayıcıda hemen görünür.
"""
import errno
import http.server
import os
import sys
import threading
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
args = [a for a in sys.argv[1:] if not a.startswith("--")]
PORT = int(args[0]) if args else 5173
OPEN = "--ac" in sys.argv


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map, ".js": "text/javascript"}

    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

    def log_message(self, fmt, *a):
        pass  # terminali istek kayıtlarıyla doldurma


def create_server(start):
    for port in range(start, start + 20):
        try:
            return http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler), port
        except OSError as e:
            if e.errno != errno.EADDRINUSE:
                raise
            print(f"Port {port} kullanımda, sıradaki deneniyor…")
    sys.exit("Boş port bulunamadı.")


if __name__ == "__main__":
    httpd, port = create_server(PORT)
    url = f"http://127.0.0.1:{port}"
    print(f"Hata Odası çalışıyor: {url}  (durdurmak için Ctrl+C)")
    if OPEN:
        threading.Timer(0.8, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nSunucu durduruldu.")
    finally:
        httpd.server_close()
