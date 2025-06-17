from fastapi.testclient import TestClient

from api.main import app

client = TestClient(app)

def test_get_all_connections():
    response = client.get('api/ssh/connection')
    assert response.status_code == 200