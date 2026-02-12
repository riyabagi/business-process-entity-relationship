from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.impact_service import get_impact
from routes.impact import router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/impact/{server}")
def impact(server: str):
    data = get_impact(server)
    return {"server": server, "impact": data}
