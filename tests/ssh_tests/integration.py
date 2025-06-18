from fastapi.testclient import TestClient
import json
from api.main import app

client = TestClient(app)


def test_get_all_connections():
    response = client.get("api/ssh/connection")
    assert response.status_code == 200
    assert response.json() == json.loads(json.dumps(
        {
            "results": [
                {
                    "connection_id": 1,
                    "label": "dummy_server",
                    "hostname": "localhost",
                    "username": "dummy",
                }
            ]
        }
    )) # yea fix this hacky mess
