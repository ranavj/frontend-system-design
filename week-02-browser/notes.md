# Week 2 Notes — The Browser

> Format: har build ke baad 3 line — **kya seekha / kis React kaam se juda / kyun ya bottleneck insight**.

## Build 5 — Event-loop visualizer
- **Kya seekha:** Sync code hamesha turant chalta hai. Microtasks (`Promise.then`, `queueMicrotask`) hamesha `setTimeout` (macrotask) se pehle chalte hain, chahe delay `0` ho. Do microtasks ke beech order = "jo pehle REGISTER hua" (FIFO) — `Promise.then` ko `queueMicrotask` se pehle likha to wahi pehle chala.
- **React/JS se juda:** `api-health-monitor` project banate waqt Promise/generator (`yield`)/`async`-`await` ka poora internal mechanism (executor sync hota hai, `.then()` hamesha deferred, `await` = generator ka auto-driven version) deeply explore kiya tha — yehi samajh is build mein seedha use hui, guess bilkul sahi nikla.
- **Insight:** Guess vs actual — koi farak nahi nikla, poora order pehli baar mein hi sahi predict ho gaya.

## Build 6 — debounce & throttle
- **Kya seekha:** Dono ek hi "wrapper" shape share karte hain — `function outer(fn, timing) { [closure state]; return (...args) => { [state check/update]; fn(...args) } }` — bas closure state alag (`timeoutId` vs `lastCallTime`) aur "kab fn() ko chalne dena hai" ka rule alag. Debounce = "sirf jab calls RUKEIN" (quiet period ka wait), throttle = "chahe calls chalte rahein, ek fixed rate se chalta rahega, kabhi ruk ke wait nahi karta".
- **React/JS se juda:** `...args` (rest+spread) generic wrapper banane ke liye zaroori hai — na jaane wrapped function ke kitne arguments hain, `...args` collect+forward kar deta hai bina jaane. `addEventListener` bhi EventEmitter jaisa hi "registry" hai — ek hi element pe multiple listeners registered ho sakte hain, browser khud sabko sync call karta hai jab real event ho.
- **Insight:** Node mein isolated test karke exact numbers dekhe — 10 rapid debounce calls → 1 fire (sirf akhri), 20 rapid throttle calls (50ms apart) → 5 fires (~200ms interval pe regular).

## Build 7 — Reflow vs repaint meter
- **Kya seekha:** Browser DOM writes ko batch karta hai (fast, next paint frame se pehle ek saath) — par turant koi layout-dependent property PADHNA (`offsetWidth`, `getBoundingClientRect`, wagera) browser ko turant, synchronously us pending write ko apply karke reflow karne pe majboor karta hai ("forced synchronous layout"). Loop mein read+write mix karna (layout thrashing) har iteration pe ye force karta hai — jabki saare reads pehle, saare writes baad mein karne se browser sirf EK BAAR reflow karta hai.
- **React/JS se juda:** Build 1 ka `performance.now()` measurement pattern seedha reuse hua — bas ab network timing ki jagah DOM/layout timing measure ki.
- **Insight:** Real browser mein measure kiya — 500 boxes ke liye interleaved (thrashing) = **212.80ms**, batched = **0.80ms** — **~266x farak**, sirf code ke order badalne se, koi naya optimization/library nahi.

## Build 8 — CRP demo
- **Kya seekha:** Browser HTML ko upar-se-neeche, sequentially parse karta hai. Ek plain `<script src>` (bina `defer`/`async`) parsing ko turant ROK deta hai — jab tak script poori download+execute na ho jaaye, neeche ka poora content (jo user ko dikhna chahiye) invisible rehta hai. `defer`/`async` script ko background mein download karte hain, parsing ko block nahi karte — isliye visible content turant render ho jaata hai, chahe script khud slow ho.
- **React/JS se juda:** Ye bilkul wahi "batching/blocking" wali family ka concept hai jo Build 7 (layout thrashing) mein dekha tha — bas yahan "block" hone wali cheez layout nahi, poori HTML parsing hai.
- **Insight:** Ek jaan-boojh kar 2-second-slow script ke saath real measure kiya — `blocking` mode mein content **2004ms** baad render hua, `defer`/`async` mode mein **0ms** (turant) — same slow script, sirf ek attribute ka farak.
