#!/usr/bin/env python3
"""
Servidor HTTP simples para servir o WebGIS
Execute: python server.py
Acesse: http://localhost:8000
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Adicionar headers CORS para permitir requisições
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def log_message(self, format, *args):
        # Personalizar mensagens de log
        print(f"[{self.log_date_time_string()}] {format % args}")

def main():
    # Mudar para o diretório do script
    os.chdir(Path(__file__).parent)
    
    Handler = MyHTTPRequestHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"=" * 60)
        print(f"Servidor HTTP iniciado!")
        print(f"=" * 60)
        print(f"URL: http://localhost:{PORT}")
        print(f"Pressione Ctrl+C para parar o servidor")
        print(f"=" * 60)
        
        # Abrir navegador automaticamente
        try:
            webbrowser.open(f'http://localhost:{PORT}')
        except:
            pass
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\nServidor encerrado pelo usuário.")

if __name__ == "__main__":
    main()

