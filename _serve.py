# -*- coding: utf-8 -*-
"""개발용 정적 서버 — 브라우저가 옛 파일을 캐시해서 생기는 혼란을 막는다."""
import http.server, socketserver, functools, os

class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        super().end_headers()
    def send_head(self):                        # 304 대신 항상 본문을 준다
        self.headers.replace_header('If-Modified-Since', '') if 'If-Modified-Since' in self.headers else None
        if 'If-Modified-Since' in self.headers: del self.headers['If-Modified-Since']
        if 'If-None-Match' in self.headers: del self.headers['If-None-Match']
        return super().send_head()

H.extensions_map.update({'.html': 'text/html; charset=utf-8',
                         '.json': 'application/json; charset=utf-8'})

if __name__ == '__main__':
    Server = socketserver.ThreadingTCPServer      # 브라우저가 연결을 붙들어도 막히지 않게
    Server.allow_reuse_address = True
    Server.daemon_threads = True
    with Server(('127.0.0.1', 8080),
            functools.partial(H, directory=r'd:\ai\claude\money')) as s:
        print('serving http://127.0.0.1:8080/gagebu.html')
        s.serve_forever()
