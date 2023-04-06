const http = require('http');
const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'index.html');

const server = http.createServer((req, res) => {
    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(500);
            res.end(`Error loading file: ${err}`);
        } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
        }
    });
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
