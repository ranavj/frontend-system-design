# Build 7 · Reflow vs Repaint Meter — Layout Thrashing

> "Layout thrashing" — asli, measurable numbers ke saath dekhna: **read+write ko mix karna
> ek pattern mein bahut slow hai, unhe alag-alag batch karna bahut fast.**

## Concept — reflow kab "force" hoti hai

Browser DOM writes (jaise `el.style.width = "100px"`) ko **turant apply nahi karta** —
inhe **batch** karta hai, aur agले paint frame se pehле ek saath process karta hai
(fast). **PAR** agar aap turant koi "layout-dependent" property **PADHTE** ho
(`el.offsetWidth`, `el.offsetHeight`, `getBoundingClientRect()`, wagera) — browser ko
**turant, synchronously** us pending write ko apply karके layout recalculate karна
padता hai, taaki wo aapको sahi (updated) value de sake. Isको **"forced synchronous
layout"** kehte hain.

**Layout thrashing** = ye pattern **loop ke andar baar-baar** karna:
```js
box.style.width = ...;      // WRITE
box.offsetWidth;             // READ — turant forces reflow
box.style.width = ...;      // WRITE (agla box)
box.offsetWidth;             // READ — phir forces reflow
// ... 500 baar repeat
```
Har iteration browser ko **poori tarah se dobara layout calculate** karne pe majboor
karta hai — jabki agar saare WRITES ek saath aur saare READS ek saath karte, browser
**sirf ek baар** layout calculate karта.

## Goal (kya dikhega)

500 chhoटे boxes ek grid mein. Do buttons:
- **"Bad: Interleaved" (thrashing)** — har box ke liye read+write mix karके width badalо
- **"Good: Batched"** — pehле saare reads, phir saare writes

Dono ka time (`performance.now()` se, Build 1 jaisा hi) measure hoga aur dikhाया jाएगा
— farak **10x ya usसे zyada** ho sakта hai.

## Steps (khud likhна hai — `index.html` mein 2 TODOs hain)

1. `runBad()` — loop ke andar har box ke liye: width READ karके 1px badhाके WRITE karो,
   **turant** (isी iteration mein).
2. `runGood()` — pehле **saare boxes ke widths ek array mein READ** karo (loop 1),
   phir **saare WRITES** ek alag loop mein karo (loop 2) — koi read-write mix nahi.
3. Dono ka time `performance.now()` se measure karके `#result` mein dikhाओ.

## Run

Bas `index.html` browser mein kholo. **DevTools Performance tab** (Record → button
dabाओ → Stop) mein bhi dekh sakte ho — "Bad" wale run mein **bahut saare chhoटे
"Layout" (purple) blocks** dikhенge, "Good" mein sirf ek-do.

## Reference
- [web.dev — Avoid large, complex layouts and layout thrashing](https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing)

## Ship

`notes.md` mein Build 7 ka reflection likho → `PROGRESS.md` mein ✅ → commit.
