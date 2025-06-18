from fastapi import APIRouter, HTTPException
import json
from .models import SSHConn
from ..db.core import DbSession
import logging
from .service import get_all

ssh_logger = logging.getLogger("web_ssh.ssh")
# ssh_logger.propagate = False
ssh_logger.setLevel(logging.DEBUG)

router = APIRouter(prefix="/ssh")


@router.get(
    "/connection"
)  # Make sure passwords aren't getting sent to client side, should be easy once i use a db
def get_all_ssh_connections(session: DbSession):
    """
        Get all ssh connections within 'user_id\'s' namespace
    """
    ssh_logger.info("Getting all connections")
    try:
        connections = get_all(session)
        connections_as_dict = [ dict(conn._mapping) for conn in connections ]
        ssh_logger.debug(f"Connections: {connections_as_dict}")
        # print(f"Connections: {res}")
    except Exception as e:
        raise HTTPException(status_code=400, detail="Could not process request")
    return {"results": connections_as_dict}

# Note: not sure if this route is needed yet
# @router.get("/connection/{label}")  # using labels until i have unique ids
# def get_ssh_connection(label: str):
#     raise HTTPException(status_code=404, detail="Connection not found.")


@router.post("/connection")
def create_connection(conn: SSHConn):
    """
        Create a ssh connection within 'user_id\'s' namespace
    """
    conn = {
        "label": conn.label,
        "hostname": conn.hostname,
        "user": conn.user,
        "password": conn.password,
    }
    
    return {"results": "Created"}
