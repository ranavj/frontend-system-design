// ⭐ Capstone · Network Inspector — backend
//
// Kaam: ek URL lo → uski request ko stages mein todo (Build 1) + uske cache/response
// headers ka matlab nikaalo (Build 2) → sab JSON mein React UI ko bhej do.
//
// ⚠️ Ye ek GUIDE hai — khud type/complete karo. Har TODO tumhara kaam hai.
//
// Kyun backend? Browser se doosre origin ka DNS/TCP/TLS timing milta hi nahi —
// cross-origin Resource Timing entries 0 aati hain jab tak server `Timing-Allow-Origin`
// na bheje. Isliye asli measurement Node karega, React sirf dikhayega.
//
// Chalao:
//   node inspect-server.js
// Test:
//   curl "http://localhost:8100/inspect?url=https://example.com"

const http = require("http");
const https = require("https");
const { performance } = require("perf_hooks");

const PORT = 8100;

// React dev server yahin se call karega — Build 4 wala CORS, ab tumhare apne server pe.
const ALLOWED_ORIGIN = "http://localhost:5173"; // Vite ka default port

// Dev mein `true` — taaki apne hi localhost servers (Build 2 ka FastAPI, Build 3 ka image
// server) inspect kar sako. Ye tool kabhi internet pe deploy karo to `false` karna zaroori hai,
// warna koi bhi ise tumhare internal network ko scan karne ke liye use kar lega.
const ALLOW_PRIVATE_HOSTS = true;

// Private/internal address hai ya nahi. (Note: ye hostname pe check hai — ek public naam
// jo private IP pe resolve hota ho, wo phir bhi nikal jaayega. Poora fix DNS resolve ke
// baad IP check karna hai; yahan itna kaafi hai.)
function isPrivateHost(hostname) {
  const h = hostname.toLowerCase().replace(/^\[|\]$/g, ""); // IPv6 ke square brackets hata do
  if (h === "localhost" || h.endsWith(".localhost") || h === "::1") return true;

  const parts = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!parts) return false;

  const [a, b] = [Number(parts[1]), Number(parts[2])];
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||                        // loopback
    (a === 169 && b === 254) ||         // link-local — cloud metadata yahin rehta hai
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

// ---------------------------------------------------------------------------
// 1) TIMING — Build 1 ka dil. Ek URL ki request ko stages mein todo.
// ---------------------------------------------------------------------------
function measure(targetUrl) {
  return new Promise((resolve, reject) => {
    // http vs https — module URL dekh ke choose karo (Build 1 mein ye ternary tha).
    const client = targetUrl.startsWith("https:") ? https : http;

    const marks = {};
    const t = (name) => (marks[name] = performance.now());
    t("start");

    const req = client.get(targetUrl, (res) => {
      t("ttfb");

      let bytes = 0;
      res.on("data", (chunk) => {
        // TODO: har chunk ka size jodo (chunk.length) — download size report karne ke liye.
        bytes += chunk.length;
      });

      res.on("end", () => {
        t("end");

        // TODO: Build 1 wala hisaab — har stage = do consecutive marks ka difference.
        // http mein TLS hota hi nahi, isliye us case ko handle karo (0 ya null).
        const stages = {
          dns: marks.dns - marks.start,       // TODO
          tcp: marks.tcp - marks.dns,       // TODO
          tls: marks.tls ? marks.tls - marks.tcp : 0,       // TODO (agar http hai to 0)
          ttfb: marks.ttfb - (marks.tls ? marks.tls : marks.tcp),      // TODO
          download: marks.end - marks.ttfb,  // TODO
        };
        const total = marks.end - marks.start;

        // TODO: sabse slow stage nikaalo (Build 1 ka bottleneck logic) —
        // Object.entries(stages) pe loop/reduce karke max value wali key.
        const bottleneck = Object.entries(stages).reduce(
          (max, [key, value]) => (value > max.value ? { key, value } : max),
           { key: null, value: -Infinity }
        ).key;

        resolve({
          url: targetUrl,
          status: res.statusCode,
          stages: Object.fromEntries(
            Object.entries(stages).map(([key, value]) => [key, Math.round(value)])
          ),
          total: Math.round(total),
          bottleneck,
          bytes,
          headers: res.headers,
        });
      });
    });

    req.on("error", reject);
    req.on("socket", (socket) => {
      socket.on("lookup", () => t("dns"));       // DNS done
      socket.on("connect", () => t("tcp"));      // TODO: sahi event? (TCP connect done)
      socket.on("secureConnect", () => t("tls")); // TLS done (sirf https)
    });
    req.setTimeout(10000, () => req.destroy(new Error("Timeout after 10s")));
  });
}

// ---------------------------------------------------------------------------
// 2) CACHE ANALYSIS — Build 2 ka dil. Headers ka matlab nikaalo.
// ---------------------------------------------------------------------------
function analyzeCache(headers) {
  const cacheControl = headers["cache-control"] || null;

  // Build 2 wala parseMaxAge. Pehle match nikaalo, phir Number karo —
  // `parseInt(...) || null` mat likhna: `max-age=0` bhi falsy hai aur null ban jaata,
  // jabki 0 ka apna matlab hai ("turant stale maano").
  const match = cacheControl?.match(/max-age=(\d+)/);
  const maxAge = match ? Number(match[1]) : null;

  // Validator = wo cheez jisse conditional GET / 304 possible hota hai.
  const hasValidator = !!headers["etag"] || !!headers["last-modified"];

  // no-store vs no-cache — naam dhokha dete hain:
  //   no-store → store karo hi mat, har baar poora network
  //   no-cache → store karo, par har baar revalidate karo (304 mil sakta hai)
  const noStore = !!cacheControl?.includes("no-store");
  const noCache = !!cacheControl?.includes("no-cache");

  // Order maayne rakhta hai: no-store sab pe bhaari, phir no-cache (kyunki `no-cache, max-age=0`
  // jaise combos mein max-age wali branch galat kahani sunayegi).
  const verdict = noStore
    ? "Cacheable nahi — har baar network (no-store)"
    : noCache
    ? "Store hoga, par har baar revalidate (no-cache → 304 possible)"
    : maxAge > 0
    ? `${maxAge}s tak fresh, phir revalidate`
    : maxAge === 0
    ? "max-age=0 — turant stale, har baar revalidate"
    : hasValidator
    ? "Har baar revalidate (304 possible)"
    : "Koi cache policy nahi — browser heuristic pe";

  return {
    cacheControl,
    etag: headers["etag"] || null,
    lastModified: headers["last-modified"] || null,
    age: headers["age"] || null,
    contentType: headers["content-type"] || null,
    contentEncoding: headers["content-encoding"] || null,
    server: headers["server"] || null,
    maxAge,
    hasValidator,
    verdict,
  };
}

// ---------------------------------------------------------------------------
// 3) HTTP API — React yahan se data lega.
// ---------------------------------------------------------------------------
const server = http.createServer(async (req, res) => {
  const send = (status, body) => {
    res.writeHead(status, {
      "content-type": "application/json",
      "access-control-allow-origin": ALLOWED_ORIGIN,
    });
    res.end(JSON.stringify(body));
  };

  const { pathname, searchParams } = new URL(req.url, `http://localhost:${PORT}`);

  if (pathname !== "/inspect") return send(404, { error: "Not found" });

  const target = searchParams.get("url");

  if (!target) return send(400, { error: "URL parameter is required" });

  // startsWith ki jagah asli parsing: malformed URL yahin 400 de dega (pehle wo measure()
  // mein ja ke throw hota tha → 502, jo galat kahani sunata hai — 502 ka matlab
  // "target server ne gadbad ki", jabki galti client ke input mein thi).
  let parsed;
  try {
    parsed = new URL(target);
  } catch {
    return send(400, { error: "Malformed URL" });
  }

  // .protocol hamesha lowercase normalize hota hai → "HTTP://..." bhi ab sahi se pass hoga.
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return send(400, { error: "Invalid URL — only http/https allowed" });
  }

  // SSRF guard — sirf protocol check kaafi NAHI hai. Ye endpoint "jo URL do, wahan request
  // bhej dunga" karta hai, isliye koi bhi ise internal addresses pe point kar sakta hai:
  //   http://169.254.169.254/  → cloud metadata (AWS credentials!)
  //   http://localhost:8100/inspect?url=... → apna hi server, infinite loop
  if (!ALLOW_PRIVATE_HOSTS && isPrivateHost(parsed.hostname)) {
    return send(403, { error: "Internal/private addresses not allowed" });
  }

  try {
    const timing = await measure(target);
    const cache = analyzeCache(timing.headers);
    send(200, { ...timing, cache });
  } catch (err) {
    send(502, { error: err.message });
  }
});

server.listen(PORT, () => console.log(`🔎 Inspector API → http://localhost:${PORT}/inspect?url=...`));
