# Build 6 · Debounce & Throttle

> Dono khud scratch se likhna hai — koi library nahi. Ek live demo page pe **raw events
> vs debounced calls vs throttled calls** side-by-side dekhna hai.

## Concept — do alag "rate limiting" strategies

- **Debounce:** "jab tak events aana ruken nahi, kuch mat karo. Jab events rukein
  (`delay` ms tak koi naya event na aaye), TABHI ek baar chalao." — search-as-you-type
  ka classic use case (user type karta rahe, API call sirf tab jab wo ruk jaaye).
- **Throttle:** "chahe kितने bhi events aayein, HAR `interval` ms mein zyada se zyada
  ek baar chalao." — scroll/resize/mousemove handlers ka classic use case (kaam to
  karna hai, par har pixel-move pe nahi).

## Goal (kya dikhega)

Ek box jismein mouse move karo — **teeno counters** (raw event count, debounced call
count, throttled call count) live update hote dikhenge. Farak turant visually samajh
aayega: raw sabse tez badhega, throttled thoda-thoda, debounced sirf jab mouse ruke.

## Steps (khud likhna hai — `index.html` mein 2 TODOs hain)

1. `debounce(fn, delay)` — closure + `setTimeout`/`clearTimeout` use karke.
2. `throttle(fn, interval)` — closure + `Date.now()` se "last call kab hui" track karke
   (leading-edge version — pehla call turant, uske baad `interval` ms tak sab ignore).
3. Baaki poora demo-wiring code diya hua hai — chhedne ki zarurat nahi.

## Run

Bas `index.html` browser mein kholo — koi server nahi chahiye.

## Reference
- [patterns.dev — Debounce/Throttle patterns](https://www.patterns.dev/vanilla/debounce/)

## Ship

`notes.md` (Week 2 ka) mein Build 6 ka reflection likho → `PROGRESS.md` mein ✅ → commit.
