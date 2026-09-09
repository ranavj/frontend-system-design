# Bonus · Fiber-style Chunking + List Virtualization + FPS Meter

> Ek chhota project jismein **teeno "big company" concepts** ek saath, khud haath se banake
> mehsoos karna hai — na sirf padhna.

## Kya banega

1. **FPS/frame-time meter** — hamesha chalta rahega, upar dikhega. Isse **RAIL ka 16ms
   budget** live dikhega — jab bhi kuch main thread ko block karega, meter turant "spike"
   dikhayega.
2. **Virtualized list** — 10,000 rows ka data, par DOM mein hamesha sirf **~20 rows**
   (jitni screen par dikhती hain) — bilkul `react-window` jaisa concept.
3. **Do buttons — "Blocking" vs "Chunked"** — same bhaari kaam (10,000 units), par:
   - **Blocking:** ek hi jhatke mein, bina ruke — FPS meter **freeze** ho jayega
   - **Chunked (generator se):** chhote-chhote tukdon mein, beech-beech mein browser ko
     control wapas dete hue — FPS meter **zinda** rahega, chahe total time same ho

## Kyun ye teeno ek saath

- FPS meter = **measurement tool** (RAIL insight ko live dikhane ke liye)
- Virtualized list = **"DOM chhota rakho"** solution (Build 7 ka scale-up)
- Chunked work (generator se) = **React Fiber ka mini-version** (kaam ko "pausable" banana)

## Steps (khud likhna hai — `index.html` mein 2 TODOs hain)

### TODO 1 — Virtualization scroll-math

`updateVisibleRows()` function mein: `scrollTop` se `startIndex` nikalo, sirf utni hi
rows DOM mein banao jitni screen par fit hoti hain (+ 2-3 buffer rows), aur unhe sahi
jagah par `transform: translateY(...)` se position karo.

### TODO 2 — Generator-based chunked work

`chunkedHeavyWork()` — ek generator function jo 10,000 units of "fake work" ko **chhote
batches (jaise 200 units)** mein karta hai, har batch ke baad `yield` karta hai. Ek driver
function (`runChunked`) generator ko `setTimeout(..., 0)` se baar-baar resume karta hai —
taaki har batch ke beech browser ko **saans lene ka mauka** mile (bilkul jaise
`runInsideBatchWindow` example mein dekha tha — bas is baar "beech mein rukna" hi maqsad hai).

## Run

Bas `index.html` browser mein kholo — koi server nahi chahiye. Scroll karke virtualization
dekho, dono buttons dabake FPS meter compare karo.

## Reference
- [Build a virtualized list](https://web.dev/articles/virtualize-long-lists-react-window) (concept language-agnostic hai)
- [RAIL performance model](https://web.dev/articles/rail)
