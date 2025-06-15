from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# from starlette.middleware.sessions import SessionMiddleware
from starsessions import SessionMiddleware, InMemoryStore, SessionAutoloadMiddleware
from .api import router as api_router

app = FastAPI(
    title="[ssh client] REST API",
    summary="REST API for [name to be determined]",
    version="0.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionAutoloadMiddleware)
app.add_middleware(SessionMiddleware, store=InMemoryStore())

app.include_router(api_router)

@app.get("/")
def hello_world():
    return {"msg": "Hello World"}