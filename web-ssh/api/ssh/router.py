from fastapi import APIRouter, HTTPException
import json
from .models import SSHConn

router = APIRouter(prefix="/ssh")


@router.get(
    "/connection"
)  # Make sure passwords aren't getting sent to client side, should be easy once i use a db
def get_all_connections():
    f = open("db.json")
    connections = f.read()
    f.close()
    res = json.loads(connections)
    return {"results": res}


@router.get("/connection/{label}")  # using labels until i have unique ids
def get_connection(label: str):
    f = open("db.json")
    connections = f.read()
    f.close()
    connections = json.loads(connections)
    for conn in connections:
        if conn["label"] == label:
            return {"results": conn}
    raise HTTPException(status_code=404, detail="Connection not found.")


@router.post("/connection")
def create_connection(conn: SSHConn):
    """
    Write Connection to DB
    """

    conn = {
        "label": conn.label,
        "hostname": conn.hostname,
        "username": conn.username,
        "password": conn.password,
    }
    f = open("db.json", "r")
    connections = f.read()
    connList = json.loads(connections)
    print(f"Connections: {connList}, {type(connList)}")
    f.close()
    connList.append(conn)
    data = json.dumps(connList)
    print(f"Data: {connList}\nSerialized: {data}")
    f = open("db.json", "w")
    f.write(data)
    f.close()
    return "Connection Created"
