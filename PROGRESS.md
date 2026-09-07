# 📈 Progress Tracker — frontend-system-design

> Har build/week ke baad yeh update hoga. Naya session shuru karte waqt **yeh sabse pehle padho**.
> Sync partners: [`rag-mastery/PROGRESS.md`](../rag-mastery/PROGRESS.md) · [`python-foundations/PROGRESS.md`](../python-foundations/PROGRESS.md)
> Live checkbox tracker: [`artifact/roadmap-tracker.html`](artifact/roadmap-tracker.html)

**Status:** 🟢 Wk2 · Build 7 (Reflow vs repaint meter) — DONE ✅ · Build 8 (CRP demo) next

---

## ✅ Completed

- **Setup** — repo scaffold (README, ROADMAP, PROGRESS, artifact tracker), Week 1 folder + Build 1 guide ready
- **Wk1 · Build 1** — Request timing logger ✅ (DNS/TCP/TLS/TTFB/download breakdown + http handling + bottleneck highlight)
- **Wk1 · Build 2** — Conditional-cache proxy ✅ (fresh/stale/miss handling, ETag + If-None-Match, 304 revalidation)
- **Wk1 · Build 3** — H1 vs H2 waterfall ✅ (self-signed cert + dual-mode server, Resource Timing waterfall, measured 782ms vs 163ms — 4.8x)
- **Wk1 · Build 4** — CORS playground ✅ (simple vs preflighted request, live OPTIONS in DevTools, origin toggle → blocked, CORS ≠ server security)
- **Wk1 · Capstone** — skipped, jaan-boojh kar. Instead ek bada standalone project (`/Users/vijayrana/api-health-monitor`) banaya jo Build 1's timing logic ko FastAPI backend + Preact dashboard + SSE tak le gaya — Network Inspector se kaafi zyada advanced, isी concept ko cover karta hai.
- **Wk2 · Build 5** — Event-loop visualizer ✅ (sync/`Promise.then`/`queueMicrotask`/`setTimeout` ka color-coded live order — guess-first-then-verify tareeke se). Concept `api-health-monitor` session ki deep Promise/generator/async-await dive se already solid tha, isliye implementation seedha ban gaya.
- **Wk2 · Build 6** — debounce & throttle ✅ scratch se (closure-based: `timeoutId` for debounce, `lastCallTime` for throttle), live mousemove demo (raw vs debounced vs throttled counters). Dono functions Node mein rapid-fire simulation se independently verified — debounce ne 10 rapid calls ko 1 mein compress kiya, throttle ne 20 calls ko regular-rate 5 mein.
- **Wk2 · Build 7** — Reflow vs repaint meter ✅ (500 boxes, interleaved read/write vs batched read/write). Real browser (local HTTP server) mein live measure kiya — **212.80ms (thrashing) vs 0.80ms (batched) — ~266x farak**, sirf read/write ka order badalne se.

---

## 🔵 Phase 1 — Foundations (Weeks 1–2)

### Week 1 · The Network
| # | Build | Status | Notes |
|---|-------|--------|-------|
| 1 | Request timing logger (DNS/TCP/TLS/TTFB) | ✅ | done — 5-stage breakdown, http handling, bottleneck highlight |
| 2 | Conditional-cache proxy (ETag/304) | ✅ | done — fresh/stale/miss cases, If-None-Match, 304 revalidation |
| 3 | H1 vs H2 waterfall | ✅ | done — self-signed cert, dual-mode server, waterfall via Resource Timing API, 782ms vs 163ms |
| 4 | CORS playground | ✅ | done — simple vs preflight (OPTIONS), origin/method/header toggle, browser-side enforcement |
| ⭐ | Capstone: Network Inspector | ⏭️ | skipped — superseded by `api-health-monitor` project |

### Week 2 · The Browser
| # | Build | Status | Notes |
|---|-------|--------|-------|
| 5 | Event-loop visualizer | ✅ | sync/microtask(Promise.then, queueMicrotask)/macrotask(setTimeout) order verified — guess matched actual exactly |
| 6 | debounce & throttle | ✅ | dono scratch se, live mousemove demo — Node mein rate/timing independently verified |
| 7 | Reflow vs repaint meter | ✅ | layout thrashing (interleaved) vs batched read/write — measured 212.80ms vs 0.80ms, ~266x |
| 8 | CRP demo | ⬜ | |

## 🟣 Phase 2 — Rendering (Weeks 3–4)   `⬜ locked`
## 🟢 Phase 3 — Data (Weeks 5–6)         `⬜ locked`
## 🟠 Phase 4 — Structure (Weeks 7–8)    `⬜ locked`
## 🔴 Phase 5 — Resilience (Weeks 9–10)  `⬜ locked`
## 🔷 Phase 6 — Synthesis (Weeks 11–12)  `⬜ locked`

---

## 🔄 Push checklist (har build/week ship karne pe)

1. **Build folder** — code + working demo
2. **`notes.md`** — kya seekha / kis React kaam se juda / kyun A over B
3. **`PROGRESS.md`** — is table mein status ⬜ → ✅, ek-line note
4. **`artifact/roadmap-tracker.html`** — checkbox tick karke same URL pe redeploy (artifact sync)
5. **Commit** — `FE Wk<NN>: <build>`
