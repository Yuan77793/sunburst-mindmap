#!/usr/bin/env python3
"""
旭日图思维导图编辑器 - HTTP服务器
用于解决CORS问题，允许ES6模块正常加载
"""

import http.server
import socketserver
import os
import sys
import webbrowser
from urllib.parse import urlparse

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class CORSRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # 添加CORS头
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def log_message(self, format, *args):
        # 自定义日志格式
        print(f"[{self.log_date_time_string()}] {self.address_string()} - {format % args}")

def main():
    os.chdir(DIRECTORY)
    
    print("=" * 60)
    print("旭日图思维导图编辑器 - HTTP服务器")
    print("=" * 60)
    print(f"目录: {DIRECTORY}")
    print(f"端口: {PORT}")
    print()
    print("可用页面:")
    print(f"  http://localhost:{PORT}/index.html - 主应用程序")
    print(f"  http://localhost:{PORT}/start.html - 启动测试页面")
    print()
    print("正在启动服务器...")
    print("按 Ctrl+C 停止服务器")
    print("=" * 60)
    
    # 尝试自动打开浏览器
    try:
        webbrowser.open(f'http://localhost:{PORT}/start.html')
        print("已尝试在浏览器中打开启动页面")
    except:
        print("无法自动打开浏览器，请手动访问上述URL")
    
    try:
        with socketserver.TCPServer(("", PORT), CORSRequestHandler) as httpd:
            print(f"服务器已启动，访问 http://localhost:{PORT}")
            print("正在监听请求...")
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n正在关闭服务器...")
        print("服务器已关闭")
    except Exception as e:
        print(f"服务器启动失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()