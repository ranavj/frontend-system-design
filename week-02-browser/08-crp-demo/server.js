// Build 8 · CRP demo server
//
// Goal: ek hi HTML template, teen modes (blocking/defer/async) — sirf <script> tag ka
// attribute badalta hai. Ek deliberately SLOW script (/slow.js, 2 second delay) load
// karke dikhana hai ki blocking mode mein content ka dikhna kitna delay hota hai.
//
// ⚠️ Ye ek GUIDE hai — khud type/complete karo. Har TODO tumhara kaam hai.
//
// Chalao: node server.js
// Phir browser mein: http://localhost:8100/?mode=blocking (ya defer, async)

const http = require("http");

const SLOW_JS_DELAY_MS = 2000;

// TODO: mode ke hisaab se sahi <script> tag string banao aur return karo.
//   "blocking" → '<script src="/slow.js"></script>'
//   "defer"    → '<script src="/slow.js" defer></script>'
//   "async"    → '<script src="/slow.js" async></script>'
function buildScriptTag(mode) {
  if (mode === "defer") return '<script src="/slow.js" defer></script>';
  if (mode === "async") return '<script src="/slow.js" async></script>';
  return '<script src="/slow.js"></script>';
}

function renderPage(mode) {
  const scriptTag = buildScriptTag(mode);
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>CRP demo — ${mode}</title>
  <script>window.__navStart = performance.now();</script>
  ${scriptTag}
</head>
<body>
  <h1 id="content">Mode: ${mode} — abhi render nahi hua...</h1>
  <script>
    const t = performance.now() - window.__navStart;
    document.getElementById("content").textContent =
      "Mode: ${mode} — render hua at " + t.toFixed(0) + "ms";
  </script>
</body>
</html>`;
}

const server = http.createServer((req, res) => {
  if (req.url === "/slow.js") {
    // Jaan-boojh kar slow — real duniya mein ye ek bada analytics script,
    // ek slow third-party widget, wagera ho sakta hai.
    setTimeout(() => {
      res.writeHead(200, { "content-type": "application/javascript" });
      res.end("console.log('slow.js aakhir mein load hui');");
    }, SLOW_JS_DELAY_MS);
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const mode = url.searchParams.get("mode") || "blocking";
  res.writeHead(200, { "content-type": "text/html" });
  res.end(renderPage(mode));
});

server.listen(8100, () => {
  console.log("CRP demo → http://localhost:8100/?mode=blocking");
  console.log("           http://localhost:8100/?mode=defer");
  console.log("           http://localhost:8100/?mode=async");
});
