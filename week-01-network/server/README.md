# Week 1 · FastAPI mini-server
Builds 2–4 ke demos ke liye shared server (ETag/304, HTTP/2 images, CORS headers).
Setup jab Build 2 pe pahuncho:
  python3 -m venv venv && source venv/bin/activate
  pip install "fastapi[standard]" uvicorn
  uvicorn main:app --reload
