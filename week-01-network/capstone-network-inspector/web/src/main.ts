// ⭐ Capstone · Network Inspector — UI
//
// Chalao:  npm install && npm run dev   (Vite :5173 pe uthega)
// Backend: node ../server/inspect-server.js   (:8100)
//
// Note: backend ne `access-control-allow-origin: http://localhost:5173` set kiya hua hai —
// yani Build 4 wala CORS yahan live hai. Vite kisi aur port pe uthe to fetch block ho jaayega
// (aur wahi galti tum jaan-boojh kar ek baar karke dekh sakte ho 🙂).

import { isError, type InspectResponse, type InspectResult, type Stages } from "./types";

const API = "http://localhost:8100/inspect";

// Har stage ka apna rang — waterfall padhne mein aasan ho jaata hai.
const STAGE_COLORS: Record<keyof Stages, string> = {
  dns: "#0ea5e9",
  tcp: "#8b5cf6",
  tls: "#f59e0b",
  ttfb: "#ef4444",
  download: "#22c55e",
};

const STAGE_LABELS: Record<keyof Stages, string> = {
  dns: "DNS lookup",
  tcp: "TCP connect",
  tls: "TLS handshake",
  ttfb: "TTFB (server soch raha)",
  download: "Content download",
};

// DOM refs — `!` isliye kyunki hum jaante hain ye elements index.html mein hain.
const form = document.querySelector<HTMLFormElement>("#form")!;
const urlInput = document.querySelector<HTMLInputElement>("#url")!;
const statusEl = document.querySelector<HTMLDivElement>("#status")!;
const resultEl = document.querySelector<HTMLDivElement>("#result")!;
const waterfallEl = document.querySelector<HTMLElement>("#waterfall")!;
const cacheEl = document.querySelector<HTMLElement>("#cache")!;
const headersEl = document.querySelector<HTMLElement>("#headers")!;

form.addEventListener("submit", (e) => {
  e.preventDefault(); // warna page reload ho jaayega — form ka default behavior
  inspect(urlInput.value.trim());
});

async function inspect(url: string) {
  statusEl.textContent = "⏳ Inspecting…";
  resultEl.hidden = true;

  try {
    // encodeURIComponent zaroori hai — URL ke andar URL ja rahi hai, aur uske `?`, `&`, `=`
    // hamari apni query string ko tod dete agar encode na karte.
    const res = await fetch(`${API}?url=${encodeURIComponent(url)}`);
    const data = (await res.json()) as InspectResponse;

    // `res.ok` check ki zarurat nahi — server error case mein bhi JSON `{error}` bhejta hai,
    // aur type guard usse pakad leta hai. (Yehi guard TS ko bhi narrow karta hai.)
    if (isError(data)) {
      statusEl.textContent = `❌ ${data.error}`;
      return;
    }

    statusEl.textContent = "";
    render(data);
  } catch (err) {
    // Network hi fail (backend band hai / CORS block) — fetch yahin reject hota hai.
    statusEl.textContent = `❌ ${(err as Error).message} — kya backend :8100 pe chal raha hai?`;
  }
}

function render(data: InspectResult) {
  resultEl.hidden = false;
  renderWaterfall(data);
  renderCache(data);
  renderHeaders(data);
}

// --- helpers ----------------------------------------------------------------

const ESCAPES: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

// Jo data hum nahi banate, wo kabhi seedha innerHTML mein na jaaye.
// Yahan headers kisi bhi third-party server se aate hain — ek malicious server
// `X-Evil: <img src=x onerror=...>` bhej de to wo is page pe chal jaata.
function esc(value: string): string {
  return value.replace(/[&<>"']/g, (ch) => ESCAPES[ch]);
}

// Ek key-value row. `value ?? "—"` ki jagah explicit null check —
// warna `maxAge: 0` bhi "—" ban jaata (wahi falsy trap jo backend mein mila tha).
function kvRow(key: string, value: string | number | null): string {
  const shown = value === null || value === "" ? "—" : String(value);
  return `<tr><td>${esc(key)}</td><td>${esc(shown)}</td></tr>`;
}

// --- 1. WATERFALL -----------------------------------------------------------
function renderWaterfall(data: InspectResult) {
  const entries = Object.entries(data.stages) as [keyof Stages, number][];

  // Strings jama karke ek hi baar assign — `innerHTML +=` loop ke andar mat likhna:
  // har baar poora HTML serialize + reparse hota hai (aur purane rows bhi jud jaate hain).
  const rows = entries
    .map(([key, ms]) => {
      const width = data.total > 0 ? (ms / data.total) * 100 : 0;
      const badge = key === data.bottleneck ? `<span class="badge">⚠️ bottleneck</span>` : "";
      return `
        <div class="row">
          <span class="row-label">${STAGE_LABELS[key]}</span>
          <div class="row-track">
            <div class="row-bar" style="width:${width.toFixed(1)}%;background:${STAGE_COLORS[key]}"></div>
          </div>
          <span class="row-ms">${ms} ms</span>
          ${badge}
        </div>`;
    })
    .join("");

  waterfallEl.innerHTML = `<h2>Timing — total ${data.total} ms · ${data.bytes} bytes</h2>${rows}`;
}

// --- 2. CACHE ---------------------------------------------------------------
function renderCache(data: InspectResult) {
  const c = data.cache;
  const details: [string, string | number | null][] = [
    ["Cache-Control", c.cacheControl],
    ["max-age", c.maxAge],
    ["ETag", c.etag],
    ["Last-Modified", c.lastModified],
    ["Age", c.age],
    ["Content-Type", c.contentType],
    ["Content-Encoding", c.contentEncoding],
    ["Server", c.server],
  ];

  cacheEl.innerHTML = `
    <h2>Cache</h2>
    <p class="verdict">${esc(c.verdict)}</p>
    <table>${details.map(([k, v]) => kvRow(k, v)).join("")}</table>`;
}

// --- 3. RAW HEADERS ---------------------------------------------------------
function renderHeaders(data: InspectResult) {
  const rows = Object.entries(data.headers)
    // set-cookie jaise headers array mein aate hain — unhe join kar do.
    .map(([key, value]) => kvRow(key, Array.isArray(value) ? value.join(", ") : value))
    .join("");

  headersEl.innerHTML = `<h2>Response headers (${data.status})</h2><table>${rows}</table>`;
}
