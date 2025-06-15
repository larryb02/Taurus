# integration tests to write
    # 1. login -> check for valid and invalid credentials
# from fastapi import FastAPI
from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)

def test_route():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}