// Build 1 · Request Timing Logger
// Goal: ek URL ki request ko DNS / TCP / TLS / TTFB / download mein todke timing dikhao.
//
// ⚠️ Ye ek GUIDE hai — khud type/complete karo. Har TODO tumhara kaam hai.
// Chalao:  node timing.js https://example.com

const https = require("https");
const { performance } = require("perf_hooks");

// 1) URL command line se lo. (hint: process.argv[2])
const url = /* TODO */ process.argv[2];
if (!url) {
  console.error("Usage: node timing.js <https-url>");
  process.exit(1);
}

// 2) Har event ka timestamp yahan save karenge.
const marks = {};
const t = (name) => (marks[name] = performance.now());

t("start");

const req = https.get(url, (res) => {
  // TTFB: response ka pehla signal yahin milta hai.
  t("ttfb");

  // download: body chunks aate rahenge, phir 'end'.
  res.on("data", () => {
    /* chunks aa rahe hain — abhi kuch karne ki zarurat nahi */
  });
  res.on("end", () => {
    t("end");
    report(); // sab timestamps ready → print karo
  });
});

// 3) Socket ke lifecycle events — yahin DNS/TCP/TLS ka timing milega.
req.on("socket", (socket) => {
  socket.on("lookup", () => t("dns"));       // DNS done
  socket.on("connect", () => t("tcp"));      // TODO: sahi event? (TCP connect done)
  socket.on("secureConnect", () => t("tls")); // TLS done (sirf https)
});

req.on("error", (err) => {
  console.error("Request fail:", err.message);
  process.exit(1);
});

// 4) Differences nikaal ke print karo.
function report() {
  // Har stage = do consecutive marks ka difference.
  // TODO: in 5 values ko marks se calculate karo (ms, round karo).
  const dns = marks.dns - marks.start;
  const tcp = marks.tcp - marks.dns;
  const tls = marks.tls ? marks.tls - marks.tcp : 0;      // agar http (no TLS) ho to handle karo
  const ttfb = marks.ttfb - (marks.tls ? marks.tls : marks.tcp);
  const download = marks.end - marks.ttfb;
  const total = marks.end - marks.start;

  const rows = [
    ["DNS lookup", dns],
    ["TCP connect", tcp],
    ["TLS handshake", tls],
    ["TTFB", ttfb],
    ["Content download", download],
  ];

  console.log(`\n🔗 ${url}`);
  for (const [label, ms] of rows) {
    console.log(`   ${label.padEnd(16)}: ${String(Math.round(ms)).padStart(4)} ms`);
  }
  console.log("   " + "─".repeat(24));
  console.log(`   ${"Total".padEnd(16)}: ${String(Math.round(total)).padStart(4)} ms`);

  // 5) Stretch: sabse slow stage ko highlight karo.
  // rows mein se max ms wala stage dhoondo, phir print karo.
  let slowest = rows[0];                 // maan lo pehla hi sabse slow hai
  for (const row of rows) {              // ab har row ko check karo
    if (row[1] > slowest[1]) {           // row[1] = ms; agar isse bada mila
      slowest = row;                     // to isko naya "slowest" bana do
    }
  }
  console.log(`   ⚠️  Bottleneck: ${slowest[0]} (${Math.round(slowest[1])} ms)`);
  //                               slowest[0] = label,  slowest[1] = ms
}
