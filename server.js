// 简单的HTTP服务器，用于运行旭日图思维导图编辑器
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  
  // 解析URL
  const parsedUrl = url.parse(req.url);
  let filePath = path.join(__dirname, parsedUrl.pathname);
  
  // 默认页面
  if (filePath === path.join(__dirname, '/')) {
    filePath = path.join(__dirname, 'index.html');
  }
  
  // 检查文件是否存在
  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // 文件不存在，返回404
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - 文件未找到</h1><p>旭日图思维导图编辑器</p>');
      return;
    }
    
    // 获取文件扩展名
    const extname = path.extname(filePath);
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';
    
    // 读取文件并返回
    fs.readFile(filePath, (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`服务器错误: ${err.code}`);
        return;
      }
      
      // 设置CORS头，允许跨域请求
      res.writeHead(200, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`旭日图思维导图编辑器服务器运行在 http://localhost:${PORT}`);
  console.log(`按 Ctrl+C 停止服务器`);
  console.log('');
  console.log('可用页面:');
  console.log(`  http://localhost:${PORT}/index.html - 主应用程序`);
  console.log(`  http://localhost:${PORT}/start.html - 启动测试页面`);
  console.log('');
  console.log('正在监听请求...');
});

// 优雅关闭
process.on('SIGINT', () => {
  console.log('\n正在关闭服务器...');
  server.close(() => {
    console.log('服务器已关闭');
    process.exit(0);
  });
});