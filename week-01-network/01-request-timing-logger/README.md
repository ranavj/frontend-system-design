# Build 1 · Request Timing Logger

> Ek Node CLI jo kisi URL ki request ko **5 stages mein todke** timing dikhaye.

## Goal (output aisa dikhe)

```bash
node timing.js https://api.github.com
```
```
🔗 https://api.github.com
   DNS lookup      :  24 ms
   TCP connect     :  41 ms
   TLS handshake   :  88 ms
   TTFB            : 210 ms
   Content download:  15 ms
   ────────────────────────
   Total           : 378 ms
   ⚠️  Bottleneck: TTFB (server soch raha tha)
```

## 5 stages (yehi measure karne hain)

| Stage | Kab "khatam" hua | `https` event |
|-------|------------------|---------------|
| DNS lookup | naam → IP mil gaya | `lookup` |
| TCP connect | socket connect ho gaya | `connect` |
| TLS handshake | secure channel ready (sirf https) | `secureConnect` |
| TTFB | response ka pehla byte aaya | `response` |
| Content download | poora body aa gaya | response ka `end` |

**Idea:** har event pe ek timestamp lo (`performance.now()`), phir consecutive timestamps ka
difference = us stage ka time.

## Steps (khud type karo)

1. `timing.js` mein URL ko `process.argv[2]` se lo.
2. `https.get(url)` karo, aur `req.on('socket', socket => ...)` mein socket ke events sun'no:
   `lookup`, `connect`, `secureConnect`.
3. `req.on('response', res => ...)` — yahan TTFB. Phir `res.on('data')` / `res.on('end')` — download.
4. Har event pe `marks[...] = performance.now()` save karo.
5. Ant mein differences nikaal ke print karo. Slowest stage ko highlight karo.

**Stretch:** multiple URLs ek saath compare (table), ya `perf_hooks` ka `PerformanceObserver` version.

## Run
```bash
node timing.js https://example.com
```

## Ship
`notes.md` (Week ka) bharo → `PROGRESS.md` mein Build 1 ✅ → tracker tick → `git commit -m "FE Wk01: request timing logger"`.

## Reference
- [Node `https` events](https://nodejs.org/api/http.html#event-socket)
- [`perf_hooks`](https://nodejs.org/api/perf_hooks.html)
- [HPBN — ch. 1-4](https://hpbn.co/)
