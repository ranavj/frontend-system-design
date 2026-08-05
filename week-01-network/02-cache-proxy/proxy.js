// Build 2 · Conditional-Cache Proxy
// Goal: server ke ek resource ko cache karo — ETag / Cache-Control (max-age) respect karke.
//
// Har baar `node proxy.js` chalane pe teen possibilities hain:
//   1. Cache hai aur abhi tak FRESH hai (max-age ke andar)  → seedha cache se do, request bhejo hi mat.
//   2. Cache hai par STALE ho chuka hai                     → conditional GET bhejo (If-None-Match: <etag>).
//        - server 304 de  → content nahi badla, cache abhi bhi sahi hai, bas timestamp refresh karo.
//        - server 200 de  → content badal gaya, naya data + naya etag save karo.
//   3. Cache hai hi nahi (pehli baar)                        → normal GET, response cache mein save karo.
//
// ⚠️ Ye ek GUIDE hai — khud type/complete karo. Har TODO tumhara kaam hai.
//
// Pehle server chalao (dusri terminal mein):
//   cd ../server && source venv/bin/activate && uvicorn main:app --reload
// Phir yahan:
//   node proxy.js
//
// Try karne ke liye:
//   - `node proxy.js` do baar turant chalao       → 2nd run FRESH hona chahiye (no request log)
//   - 10s (MAX_AGE) ruko, phir chalao              → STALE → 304 aana chahiye (content nahi badla)
//   - curl -X POST localhost:8000/resource -d '{"content":"v2"}' -H "content-type: application/json"
//     phir `node proxy.js` chalao                  → 200 aana chahiye (naya content)

const http = require("http");
const fs = require("fs");
const path = require("path");

const RESOURCE_URL = "http://localhost:8000/resource";
const CACHE_FILE = path.join(__dirname, "cache.json");

// 1) Purana cache disk se load karo (agar file exist karti hai).
function loadCache() {
  // TODO: agar CACHE_FILE exist nahi karti → null return karo.
  // agar karti hai → fs.readFileSync + JSON.parse karke object return karo.
  if(fs.existsSync(CACHE_FILE)) {
    const data = fs.readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } else {
    return null;
  }
}

// 2) Naya cache entry disk pe likho.
function saveCache(entry) {
  // TODO: entry ko JSON.stringify karke CACHE_FILE mein likho (fs.writeFileSync).
  fs.writeFileSync(CACHE_FILE, JSON.stringify(entry), 'utf-8');
}

// 3) "max-age=10" jaise Cache-Control header se sirf number (seconds) nikaalo.
function parseMaxAge(cacheControlHeader) {
  // TODO: regex ya split se "10" nikaalo, Number() se convert karo, *1000 karke ms return karo.
  // agar header hi nahi mila to ek default (jaise 0) return karo.
  if (!cacheControlHeader) return 0;
  const match = cacheControlHeader.match(/max-age=(\d+)/);
  return match ? Number(match[1]) * 1000 : 0;
}

// 4) Ek GET request bho — headers optional (If-None-Match yahin se jaayega).
function request(headers = {}) {
  return new Promise((resolve, reject) => {
    // TODO: http.get(RESOURCE_URL, { headers }, (res) => { ... }) call karo.
    // res.on("data", chunk => ...) se body chunks jodo (array mein push, phir join/Buffer.concat).
    // res.on("end", () => resolve({ status: res.statusCode, headers: res.headers, body: <joined body> }))
    // req.on("error", reject) bhi lagao (http.get return value pe).
    const req = http.get(RESOURCE_URL, { headers }, (res) => {
      let bodyChunks = [];
      res.on("data", (chunk) => {
        bodyChunks.push(chunk);
      });
      res.on("end", () => {
        const body = Buffer.concat(bodyChunks).toString();
        resolve({ status: res.statusCode, headers: res.headers, body });
      });
    });

    req.on("error", (err) => {
      reject(err);
    });
  });
}

async function main() {
  const cache = loadCache();
  const now = Date.now();

  if (cache && now - cache.storedAt < cache.maxAgeMs) {
    // TODO: Case 1 — FRESH. Koi network call nahi, seedha cache.body print karo.
    console.log("Cache content:", cache.body);
    console.log("🟢 Cache HIT (fresh) — no request sent");
    return;
  }

  // Case 2/3: stale ya cache hi nahi — conditional (ya pehli) GET bhejo.
  const headers = cache ? { "If-None-Match": cache.etag } : {};
  const res = await request(headers);

  if (res.status === 304) {
    // Case 2a — 304. cache.body wahi rehta hai, bas storedAt = now karke saveCache karo.
    cache.storedAt = now;
    saveCache(cache);
    console.log("🟡 Cache HIT (revalidated, 304) — server said 'still valid'");
  } else if (res.status === 200) {
    // Case 2b/3 — 200. res.body ko JSON.parse karo ({content, etag} milega).
    const { content, etag } = JSON.parse(res.body);
    const maxAgeMs = parseMaxAge(res.headers["cache-control"]);
    saveCache({ body: content, etag, maxAgeMs, storedAt: now });
    console.log("🔴 Cache MISS (200) — naya data mila");
  } else {
    console.error(`❌ Unexpected status ${res.status} — server error, cache untouched`);
  }
}

main();
