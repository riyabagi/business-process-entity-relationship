from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import impact

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(impact.router, prefix="/api")

@app.get("/")
def root():
    return {"status": "API running"}
