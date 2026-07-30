# Week 1 Notes — The Network

> Format: har build ke baad 3 line — **kya seekha / kis React kaam se juda / kyun ya bottleneck insight**.

## 🗺️ Concept recap — ek request ka safar

![Network journey](diagrams/network-journey.svg)

**6 stages:** DNS (naam→IP) → TCP (3-way handshake, 1 round trip) → TLS (secret code, 1–2 RT) → Request → **TTFB** (server soch raha) → Download.

**Best-note insights (HPBN — Grigorik):**
1. **Latency is king, not bandwidth.** Web pe zyadatar time *chhoti-chhoti cheezein* laane mein jaata hai (round trips), size mein nahi. Fat pipe help nahi karta agar har request ek nayi hello-hello kare.
2. **Har round trip mehnga hai.** TCP = 1 RT, TLS = 1–2 RT — data se *pehle* hi 2–3 trips lag gaye. Isiliye **connection reuse (keep-alive)** aur **HTTP/2 multiplexing** itne bade optimizations hain.
3. **TCP slow start:** connection dheere shuru hota hai (~14KB), phir har RTT pe double. Nayi connection = dheemi shuruaat. (Reuse = warm connection.)
4. **TTFB = server ka soch-time.** DevTools mein "Waiting (TTFB)" — slow = backend problem.

### Deep — round trips, latency, HTTP versions
- **RTT (round trip) = currency.** Distance = physics. Same-city ~1–20ms, cross-continent ~150–300ms. Cold `https` = ~4 RTT (DNS+TCP+TLS 1.2) *data se pehle*. Fix: CDN (paas laao) + reuse (count kam karo).
- **Latency vs bandwidth:** bandwidth = highway lanes (bade file); latency = length/speed (kai chhoti requests). Web = latency-bound.

![HTTP versions & head-of-line blocking](diagrams/http-versions.svg)

- **HTTP/1.1:** kai connections (max ~6/origin) + per-connection queue → head-of-line blocking.
- **HTTP/2:** 1 connection, multiplexed parallel streams (HTTP-level HOL gaya). Par TCP ek stream — 1 packet lost = sab ruka (TCP-level HOL).
- **HTTP/3 (QUIC/UDP):** har stream independent + tez setup → dono level ka HOL gaya.



## Build 1 — Request timing logger
- **Kya seekha:**
- **React/JS se juda:**
- **Insight (kaun sa stage slow, kyun):**

## Build 2 — Conditional-cache proxy
- **Kya seekha:**
- **React/JS se juda:**
- **Insight:**

## Build 3 — H1 vs H2 waterfall
- **Kya seekha:**
- **React/JS se juda:**
- **Insight:**

## Build 4 — CORS playground
- **Kya seekha:**
- **React/JS se juda:**
- **Insight:**

---

## Reference (build karte waqt kholo)
- [High Performance Browser Networking](https://hpbn.co/) — Grigorik (free)
- [Node `perf_hooks`](https://nodejs.org/api/perf_hooks.html)
- [Node `https` events](https://nodejs.org/api/http.html#event-socket) — `lookup`/`connect`/`secureConnect`
- [DevTools Network timing](https://developer.chrome.com/docs/devtools/network/reference#timing-explanation)
