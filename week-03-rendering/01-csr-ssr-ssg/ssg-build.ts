// Build 1 · SSG — script jo EK BAAR chalke, random quote pick karke ek static
// ssg-output.html file disk pe likh deta hai.
//
// ⚠️ Ye ek GUIDE hai — khud complete karo.
//
// Chalao: npm run ssg
// Phir:   open ssg-output.html   (baar-baar kholo, quote KABHI nahi badlegi
//         jab tak `npm run ssg` dobara na chalao)

import fs from "node:fs";

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
<head><meta charset="utf-8" /><title>SSG — Quote of the moment</title></head>
<body style="font-family: monospace; padding: 20px;">
  <h2>SSG (Static Site Generation)</h2>
  <p>Ye file "build time" pe generate hui thi — jitni baar bhi kholo, yahi quote milegi.</p>
  <div id="quote" style="font-size: 20px;">"${quote.text}" — ${quote.author}</div>
</body>
</html>`;
}

const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
const html = renderPage(quote);
fs.writeFileSync("ssg-output.html", html);
console.log(`✓ ssg-output.html generated with quote: "${quote.text}"`);
