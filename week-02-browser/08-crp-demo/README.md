# Build 8 · Critical Rendering Path (CRP) Demo

> `render-blocking` vs `async`/`defer` scripts ka **real, measurable** farak — content
> kab dikhta hai, isse decide hota hai.

## Concept

Browser HTML ko **upar se neeche, sequentially parse** karta hai. Jab usko ek
`<script src="...">` (bina `async`/`defer` ke) milta hai jo **`<head>` mein ya body ke
UPAR** hai, to:

1. **Parsing RUK jaati hai**
2. Script poora **download** hota hai
3. Script **execute** hota hai
4. **TABHI** parsing aage badhti hai — matlab neeche ka poora content (jo user ko
   dikhna chahiye) **tab tak invisible rehta hai**

`defer`/`async` attributes isko fix karte hain — script **background mein download**
hoti hai, HTML parsing **turant aage badhti rehti hai**.

| Attribute | Parsing rukti hai? | Kab execute hota hai? |
|---|---|---|
| (kuch nahi — plain `<script src>`) | **Haan** — jab tak download+execute na ho | Turant, jahan likha hai |
| `defer` | **Nahi** | Poora HTML parse hone ke baad (DOMContentLoaded se pehle) |
| `async` | **Nahi** | Jab bhi download poora ho (order guarantee nahi) |

## Goal (kya dikhega)

Ek server, teen modes (`?mode=blocking`, `?mode=defer`, `?mode=async`) — har mode mein
ek **jaan-boojh kar slow (2 second) script** load hoti hai. Page pe ek heading hai jo
apna **"kab render hua"** timestamp khud dikhata hai.

- `blocking` mode mein: heading **~2 second baad** dikhega
- `defer`/`async` mode mein: heading **turant** dikhega, script background mein load hoti rahegi

## Steps (khud likhna hai — `server.js` mein 1 TODO hai)

`renderPage(mode)` function mein — `mode` ke hisaab se sahi `<script>` tag banao:
- `"blocking"` → `<script src="/slow.js"></script>`
- `"defer"` → `<script src="/slow.js" defer></script>`
- `"async"` → `<script src="/slow.js" async></script>`

## Run

```bash
node server.js
```

Phir browser mein teeno try karo:
- http://localhost:8100/?mode=blocking
- http://localhost:8100/?mode=defer
- http://localhost:8100/?mode=async

**DevTools Network tab** mein bhi dekho — "blocking" mode mein `slow.js` ke baad hi HTML
ka baaki hissa "process" hota dikhega.

## Reference
- [web.dev — Critical Rendering Path](https://web.dev/articles/critical-rendering-path)
- [MDN — async vs defer](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script#attr-defer)

## Ship

`notes.md` mein Build 8 ka reflection likho → `PROGRESS.md` mein ✅ → commit.
