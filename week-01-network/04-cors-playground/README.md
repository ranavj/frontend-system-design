# Build 4 · CORS Playground

> Same-origin vs cross-origin ka farak apni aankhon se dekho — simple request vs preflighted
> request, aur server ka CORS config badal ke "allowed" se "blocked" mein switch karo.

## Goal (kya dikhega)

Do buttons — "Simple GET" aur "PUT with custom header". Client `http://localhost:5500` se
serve hoga, server `http://localhost:8000` pe — **genuinely do alag origins**, isliye har
fetch neeche asal cross-origin request hai.

- **Simple GET** → koi preflight nahi, seedha jaata hai. Response ka CORS header sahi ho
  tabhi JS use padh paata hai.
- **PUT + custom header** → browser pehle khud isi URL pe ek **OPTIONS (preflight)** bhejta
  hai — server "haan, ye method/header/origin allowed hai" bole tabhi asli PUT jaata hai.
- Server ka `CORS_ALLOWED_ORIGINS`/`METHODS`/`HEADERS` (`main.py`) badal ke dono ko **block**
  hote dekho.

## Setup

1. Server chalao (agar chal nahi raha):
   ```bash
   cd ../server && source venv/bin/activate && uvicorn main:app --reload
   ```
2. Client ko ek **alag port** pe serve karo (isi folder se):
   ```bash
   cd 04-cors-playground && python3 -m http.server 5500
   ```
   Phir browser mein `http://localhost:5500/client.html` kholo. (`file://` se mat kholna —
   uska origin `"null"` hota hai, jo is exercise ke liye asli-jaisa nahi hai.)

## Steps (khud type karo — `main.py` aur `client.html` mein TODOs hain)

1. `../server/main.py` — "Build 4 · CORS playground config" section dekho, `CORS_ALLOWED_ORIGINS`
   already `http://localhost:5500` allow karta hai.
2. Same file mein `cors_simple` aur `cors_preflight_route` complete karo ("Build 4 · CORS
   playground endpoints" section, sabse neeche).
3. `client.html` mein `simpleGet()` aur `preflightPut()` complete karo.
4. Dono buttons try karo. `PUT` button pe Network tab mein **do** requests dikhni chahiye —
   pehle `OPTIONS`, phir `PUT`. `GET` button pe sirf ek.

## Ab toggle karo — blocked dekho

1. `main.py` mein `CORS_ALLOWED_ORIGINS` ko `["http://localhost:9999"]` kar do (galat port).
   `uvicorn --reload` khud restart kar dega.
2. Browser mein dobara try karo (page refresh zaroori nahi) — Console mein CORS error dikhna
   chahiye ("has been blocked by CORS policy"). **Ye browser-side (client) enforcement hai** —
   server 403 nahi deta, wo apna kaam kar deta hai, browser JS ko response padhne hi nahi deta.
3. Wapas `["http://localhost:5500"]` kar do, phir `CORS_ALLOWED_HEADERS` se `"X-Playground"`
   hata do — ab sirf **preflight PUT** fail hoga (simple GET chalta rahega, kyunki usme koi
   custom header hai hi nahi).

## Ship

`notes.md` (Week ka, Build 4 section) bharo → `PROGRESS.md` mein Build 4 ✅ → tracker tick → commit.

## Reference
- [MDN — CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)
- [MDN — Preflight requests](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS#preflighted_requests)
- [FastAPI — CORS](https://fastapi.tiangolo.com/tutorial/cors/)
