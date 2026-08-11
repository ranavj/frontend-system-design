# ⭐ Capstone · Network Inspector (React + TS)

> Koi bhi URL daalo → uska **timing waterfall** (DNS/TCP/TLS/TTFB/download) + **cache & headers
> breakdown** dikhe. Week 1 ke chaaron builds yahan ek jagah aate hain.

## Kya combine ho raha hai

| Build | Kya yahan aa raha hai |
|---|---|
| 1 · Timing logger | stages ka measurement + bottleneck detection |
| 2 · Cache proxy | `Cache-Control`/`ETag` parse karke cache verdict |
| 3 · H1 vs H2 | waterfall/bar UI ka idea |
| 4 · CORS | React (`:5173`) → API (`:8100`) — apna hi CORS handle karna |

## Architecture — aur "kyun A over B"

```
React + TS (:5173)  ──fetch──>  Node inspector API (:8100)  ──request──>  koi bhi URL
     UI, waterfall                timing + headers parse
```

**Timing browser mein kyun nahi nikaal sakte?** Kyunki cross-origin resources ke liye Resource
Timing API saare detailed fields **0 kar deti hai** (privacy) — jab tak target server
`Timing-Allow-Origin` header na bheje, jo tumhare control mein nahi hai. Isliye asli measurement
**server-side** hoga (Node ko koi CORS/privacy rok nahi lagti — Build 4 wala insight, ulta side se).

## Steps

### 1. Backend (guided starter ready hai)

`server/inspect-server.js` mein TODOs complete karo:
- `measure()` — Build 1 ka stage hisaab + bottleneck
- `analyzeCache()` — Build 2 ka `max-age` parse + validator check + verdict
- `/inspect` — URL validation (missing / non-http)

Chalao aur test karo:

```bash
node server/inspect-server.js
```

```bash
curl "http://localhost:8100/inspect?url=https://example.com"
```

### 2. Frontend — Vite + vanilla TS (React nahi)

**Kyun React nahi:** UI hai ek input, ek button, 5 bars aur do tables — na complex state, na
re-render problem, na component reuse. React yahan sirf setup ka shor badhata, seekhne ko kuch
naya nahi deta. React aage genuinely earn karta hai: Week 4 (virtualized list), Week 6
(mini React Query), Week 8 (state architecture) — jahan UI complexity khud subject hai.

**TS phir bhi kyun:** API response ka shape (`stages`/`cache`/`headers`) type ho jaaye to UI
likhte waqt autocomplete milta hai aur typo compile pe hi pakde jaate hain. `src/types.ts`
API ka contract hai — backend badle to yahan badlo, TS bata dega UI mein kahan asar pada.

```bash
cd web && npm install && npm run dev
```

### 3. UI banao — `src/main.ts` ke TODOs

- `inspect()` — fetch + error handling (`isError` type guard use karo)
- `renderWaterfall()` — 5 bars, width = stage/total ka %, bottleneck pe badge
- `renderCache()` — verdict bada, neeche Cache-Control/ETag/Age/max-age
- `renderHeaders()` — raw headers table

CSS already likha hua hai (`style.css`) — classes `.row`, `.row-bar`, `.verdict`, `.badge` ready hain.

**Error states zaroor try karo:** backend band karke, galat URL daal ke, aur Vite ko kisi aur port
pe chala ke (tab CORS block hoga — Build 4 live).

## Ship

`notes.md` mein capstone ka reflection → `PROGRESS.md` mein ⭐ ✅ → tracker tick → commit.

## Stretch (agar time ho)

- **Redirect chain** — 301/302 follow karke har hop ka timing dikhao
- **Compare mode** — do URL side-by-side
- **`Timing-Allow-Origin` demo** — apne hi server pe ye header laga ke dikhao ki ab browser ki
  Resource Timing entry mein asli numbers aa gaye (pehle 0 the)

## Reference
- [Resource Timing — cross-origin restrictions (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API/Resource_timing#coping_with_cross-origin_resources)
- [`Timing-Allow-Origin` (MDN)](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Headers/Timing-Allow-Origin)
- [HPBN — Primer on Latency and Bandwidth](https://hpbn.co/primer-on-latency-and-bandwidth/)
