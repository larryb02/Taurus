from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="API", version="0.0")

@app.get('/')
def hello_world():
    return "Hello World!"