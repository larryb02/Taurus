# integration tests to write
# 1. login -> check for valid and invalid credentials
# from fastapi import FastAPI
from fastapi.testclient import TestClient

from api.main import app

headers = {"credentials": "include"}
client = TestClient(app, headers=headers)


def test_get_account_route():
    response = client.get("api/auth/user")
    assert response.status_code == 400
    assert response.json() == {"detail": "No user found"}


def test_login_account_route():
    response = client.post("api/auth/user", data={}, headers=headers)
    assert response.status_code == 400


def test_logoff_account_route():
    response = client.post("api/auth/logoff")
    assert response.status_code == 200
    assert response.json() == {"result": "User has been signed out"}


def test_sign_in_account_route():
    response = client.get("api/auth/login")
    assert response.status_code == 200
    assert response.json() == {"msg": "Hello World"}
