"""Lunervia 로컬 개발 서버.

브라우저 캐시를 끄고 사이트를 서빙합니다. 디자인/스크립트를 수정한 뒤
새로고침만으로 항상 최신 결과를 확인할 수 있습니다.

실행:  python serve_no_cache.py
종료:  Ctrl + C
"""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

HOST = "127.0.0.1"
PORT = 5173


class NoCacheHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        # index.html 은 항상 새 쿼리로 받아 캐시 적중을 방지합니다.
        if self.path == "/index.html":
            self.send_response(302)
            self.send_header("Location", "/index.html?fresh=live")
            self.end_headers()
            return

        super().do_GET()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()


def main():
    try:
        server = ThreadingHTTPServer((HOST, PORT), NoCacheHandler)
    except OSError as error:
        print(f"[Lunervia] 포트 {PORT} 를 열 수 없습니다: {error}")
        print(f"[Lunervia] 이미 서버가 실행 중인지 확인하거나, 잠시 후 다시 시도하세요.")
        raise SystemExit(1)

    print(f"[Lunervia] 로컬 서버 실행 중 → http://{HOST}:{PORT}/")
    print("[Lunervia] 종료하려면 Ctrl + C 를 누르세요.")

    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\n[Lunervia] 서버를 종료합니다.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
