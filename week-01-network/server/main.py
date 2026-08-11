"""
Week 1 · Build 2 — FastAPI origin server for the conditional-cache proxy.

Ek chhota "resource" serve karta hai jo ETag aur Cache-Control respect karta hai,
aur agar client ka ETag abhi bhi sahi hai to 304 Not Modified deta hai.

Setup (pehli baar):
    python3 -m venv venv && source venv/bin/activate
    pip install -r requirements.txt

Chalao:
    uvicorn main:app --reload

Resource:      GET  http://localhost:8000/resource
Content badlo: POST http://localhost:8000/resource   body: {"content": "naya text"}
               (isse etag change hoga → proxy ko MISS dikhega)
"""

import hashlib
import time

from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# ---- Build 4 · CORS playground config ----
# Ye list badal ke dekho — uvicorn --reload khud restart kar dega, browser mein dobara
# fetch try karo. README ("Ab toggle karo") mein exact steps hain.
CORS_ALLOWED_ORIGINS = ["http://localhost:5500"]  # client.html isi port pe serve hoga
CORS_ALLOWED_METHODS = ["GET", "PUT"]
CORS_ALLOWED_HEADERS = ["X-Playground", "Content-Type"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ALLOWED_ORIGINS,
    allow_methods=CORS_ALLOWED_METHODS,
    allow_headers=CORS_ALLOWED_HEADERS,
)

# In-memory "resource" — origin ka state. Real server mein ye DB/file hota.
state = {"content": "Hello from the origin server! v1", "updated_at": time.time()}

MAX_AGE_SECONDS = 10  # jaan-boojh kar chhota rakha — taaki fresh → stale transition jaldi dekh sako


def compute_etag(content: str) -> str:
    # Content ka hash = ETag. Content same → hash same → ETag same.
    return hashlib.md5(content.encode()).hexdigest()


@app.get("/resource")
def get_resource(request: Request, response: Response):
    etag = compute_etag(state["content"])
    response.headers["ETag"] = etag
    response.headers["Cache-Control"] = f"max-age={MAX_AGE_SECONDS}"

    # Client ne If-None-Match bheja aur woh abhi ke ETag se match karta hai
    # → content nahi badla → 304, body bhejne ki zarurat nahi.
    if request.headers.get("if-none-match") == etag:
        return Response(status_code=304, headers=dict(response.headers))

    return {"content": state["content"], "etag": etag}


class UpdateBody(BaseModel):
    content: str


@app.post("/resource")
def update_resource(body: UpdateBody):
    """Sirf testing ke liye — content badlo taaki proxy agli baar MISS (200) dekhe."""
    state["content"] = body.content
    state["updated_at"] = time.time()
    return {"ok": True, "content": state["content"], "etag": compute_etag(state["content"])}


# ---- Build 4 · CORS playground endpoints ----
# ⚠️ Ye ek GUIDE hai — khud type/complete karo. Har TODO tumhara kaam hai.

@app.get("/cors/simple")
def cors_simple():
    """
    'Simple request' — GET, koi custom header nahi, isliye browser preflight (OPTIONS)
    bhejta hi nahi, seedha request jaata hai. CORSMiddleware response mein khud
    Access-Control-Allow-Origin add karta hai (agar origin CORS_ALLOWED_ORIGINS mein hai).
    TODO: bas ek dict return karo, jaise {"message": "simple GET worked"}.
    """
    ...  # TODO
    return {"message": "simple GET worked"}


@app.put("/cors/preflight")
def cors_preflight_route(request: Request):
    """
    Custom header (X-Playground) ke saath PUT — 'non-simple' request. Browser is exact
    URL pe pehle khud ek OPTIONS (preflight) bhejta hai — tumhe OPTIONS handle nahi karna,
    CORSMiddleware woh khud karta hai (CORS_ALLOWED_METHODS/HEADERS check karke). Agar
    preflight pass ho gaya, tabhi ye function call hota hai.
    TODO: request.headers se "x-playground" ki value nikaalo (headers lowercase hote hain)
    aur usse echo karo, jaise {"received": <value>}.
    """
    ...  # TODO
    return {"received": request.headers.get("x-playground")}
