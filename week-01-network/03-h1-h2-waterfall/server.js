// Build 3 · H1 vs H2 Waterfall — dual-mode image server
// Goal: same 30 "images" serve karo dono protocols pe — HTTP/1.1 (plain) aur HTTP/2 (TLS + ALPN).
//
// ⚠️ Ye ek GUIDE hai — khud type/complete karo. Har TODO tumhara kaam hai.
//
// Cert pehle banao (ek baar, isi folder mein — README dekho):
//   openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/CN=localhost"
//
// Chalao:
//   node server.js h1     → plain HTTP/1.1 server, port 8001
//   node server.js h2     → secure HTTP/2 server (TLS), port 8002

const http = require("http");
const http2 = require("http2");
const fs = require("fs");
const path = require("path");

const mode = process.argv[2]; // "h1" ya "h2"
const IMAGE_COUNT = 30;
const ARTIFICIAL_DELAY_MS = 150; // har "image" itni der baad respond karegi — localhost pe bhi waterfall dikhe isliye

// Content asal mein nahi chalta — sirf bytes chahiye timing dekhne ke liye.
const dummyImage = Buffer.alloc(20 * 1024, 0); // 20KB dummy buffer

function handleRequest(req, res) {
  // 1) req.url kuch aisa hoga: "/img/7". Yahan se index (7) nikaalo.
  //    Hint: req.url.match(/^\/img\/(\d+)$/) — match na ho to 404 do (res.writeHead(404); res.end();).
  const match = req.url.match(/^\/img\/(\d+)$/);
  if (!match) {
    res.writeHead(404);
    res.end();
    return;
  }
  // 2) setTimeout(() => { ... }, ARTIFICIAL_DELAY_MS) ke andar:
  //    res.writeHead(200, { "content-type": "image/png" });
  //    res.end(dummyImage);
  setTimeout(() => {
    // CORS: client.html file:// se khulti hai (origin "null"), isliye ye header chahiye
    // taaki browser response block na kare. (Build 4 mein CORS deep-dive karenge.)
    res.writeHead(200, {
      "content-type": "image/png",
      "access-control-allow-origin": "*",
    });
    res.end(dummyImage);
  }, ARTIFICIAL_DELAY_MS);
}

if (mode === "h1") {
  const server = http.createServer(handleRequest);
  server.listen(8001, () => console.log("HTTP/1.1 server → http://localhost:8001"));
} else if (mode === "h2") {
  const options = {
    key: fs.readFileSync(path.join(__dirname, "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert.pem")),
  };

  // 3) TODO: http2.createSecureServer(options, handleRequest) se server banao,
  //    port 8002 pe listen() karo (H1 wale jaisa hi pattern).
  const server = http2.createSecureServer(options, handleRequest);
  server.listen(8002, () => console.log("HTTP/2 server → https://localhost:8002"));
} else {
  console.error("Usage: node server.js <h1|h2>");
  process.exit(1);
}
