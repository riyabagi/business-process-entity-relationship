from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.impact import router as impact_router
from routes.assurance import router as assurance_router
from routes.ai import router as ai_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(impact_router)
app.include_router(assurance_router)
app.include_router(ai_router)
