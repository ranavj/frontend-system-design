// Build 1 · SSR — server HAR request pe random quote pick karke, poora HTML bhejta hai.
//
// ⚠️ Ye ek GUIDE hai — khud complete karo.
//
// Chalao: npm run ssr
// Phir:   http://localhost:8120 — baar-baar refresh karo, "View Source" bhi karo.

import http from "node:http";

interface Quote {
  text: string;
  author: string;
}

const QUOTES: Quote[] = [
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
];

function renderPage(quote: Quote): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><title>SSR — Quote of the moment</title></head>
<body style="font-family: monospace; padding: 20px;">
  <h2>SSR (Server-Side Rendering)</h2>
  <p>"View Source" karo — quote yahan PEHLE SE hai (server ne bheji thi).</p>
  <div id="quote" style="font-size: 20px;">"${quote.text}" — ${quote.author}</div>
</body>
</html>`;
}

const server = http.createServer((_req: http.IncomingMessage, res: http.ServerResponse) => {
  // TODO:
  //   1. QUOTES mein se RANDOM ek Quote pick karo — HAR request pe naya pick hona
  //      chahiye (isliye ye code YAHAN, request handler ke ANDAR hona chahiye, bahar
  //      nahi — warna server start hote hi sirf ek baar pick hoga).
  //   2. renderPage(quote) call karo, res.writeHead(200, {"content-type": "text/html"}),
  //      res.end(html) se poora HTML bhejo.
  const quote = Math.floor(Math.random() * QUOTES.length);
  res.writeHead(200, {"content-type": "text/html"});
  res.end(renderPage(QUOTES[quote]));
});

server.listen(8120, () => {
  console.log("SSR → http://localhost:8120");
});
