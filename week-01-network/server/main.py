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

# Browser se bhi test kar sako isliye CORS khula rakha hai (Build 4 mein isi cheez ko deep dive karenge).
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
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
