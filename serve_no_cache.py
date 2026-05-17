from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
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


if __name__ == "__main__":
    ThreadingHTTPServer(("127.0.0.1", 5173), NoCacheHandler).serve_forever()
