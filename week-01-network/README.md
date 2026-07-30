# Week 1 · The Network 🔵

> **Phase 1 · Foundations.** Ek request browser se server tak jaane mein 5 stages se guzarti hai —
> is week hum unhe **khud measure** karenge, cache samjhenge, protocols compare karenge, aur CORS
> live dekhenge. Sab milke → **Network Inspector** capstone.

## Kyun (frontend bridge)

Roz `fetch()` maarte ho par woh "ek request" andar se ye hai:

```
DNS  →  TCP  →  TLS  →  [request]  →  TTFB  →  Content download
naam    connect secure              server soche   data aaye
```

Jab app "slow" ho, in mein se kaun sa stage slow hai — yehi jaan-na junior aur senior frontend dev
ka farq hai. DevTools → Network → kisi request pe hover = yehi breakdown. Is week ke baad woh waterfall
tum "padh" paoge, kyunki khud banaya hoga.

## Builds (order mein)

| # | Folder | Kya banega | Server? |
|---|--------|-----------|---------|
| 1 | [`01-request-timing-logger/`](01-request-timing-logger/) | DNS/TCP/TLS/TTFB alag-alag measure | ❌ (Node only) |
| 2 | [`02-cache-proxy/`](02-cache-proxy/) | ETag / Cache-Control / 304 respect karne wala cache | ✅ FastAPI |
| 3 | [`03-h1-h2-waterfall/`](03-h1-h2-waterfall/) | 30 images H1 vs H2, timing chart | ✅ FastAPI |
| 4 | [`04-cors-playground/`](04-cors-playground/) | preflight live dekho & toggle | ✅ FastAPI |
| ⭐ | [`capstone-network-inspector/`](capstone-network-inspector/) | URL → timing waterfall + headers (React+TS) | reuse |

`server/` folder mein is week ka shared FastAPI mini-server rahega (builds 2–4 ke liye).

## Shipping loop (har build)

1. **SPIKE** — folder ka README padho, bas itna.
2. **BUILD** — khud type karo (copy-paste nahi). Chhota rakho.
3. **SHIP** — `notes.md` bharo, `PROGRESS.md` tick, tracker update, commit `FE Wk01: <build>`.

## Chalo shuru

```bash
cd 01-request-timing-logger
cat README.md
```
