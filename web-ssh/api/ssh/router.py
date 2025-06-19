from fastapi import APIRouter, HTTPException, Request
import json
from .models import SSHConn
from ..db.core import DbSession
import logging
from .service import get_all, create
from ..auth.service import get_current_user, get_user_by_id

ssh_logger = logging.getLogger("web_ssh.ssh")
# ssh_logger.propagate = False
ssh_logger.setLevel(logging.DEBUG)

router = APIRouter(prefix="/ssh")


@router.get("/connection")
def get_all_ssh_connections(session: DbSession, request: Request):
    """
    Get all ssh connections within 'user_id\'s' namespace
    """
    user_id = get_current_user(request)
    if not user_id:
        raise HTTPException(
            status_code=400, detail="Failed to process request, no user logged in"
        )
    ssh_logger.info("Getting all connections")
    try:
        user = get_user_by_id(user_id, session)
        connections = get_all(user, session)
        ssh_logger.info(f"Got connections: {connections}")
        if len(connections) == 0:
            ssh_logger.debug("Connections [] is emtpy")
            return {"results": []}
        else:
            connections_as_dict = [dict(conn._mapping) for conn in connections]
            return {"results": connections_as_dict}
        # print(f"Connections: {res}")
    except Exception as e:
        ssh_logger.error(f"Failed to get all connections: {e}")
        raise HTTPException(status_code=400, detail="Could not process request")


# Note: not sure if this route is needed yet
# @router.get("/connection/{label}")  # using labels until i have unique ids
# def get_ssh_connection(label: str):
#     raise HTTPException(status_code=404, detail="Connection not found.")


@router.post("/connection")
def create_connection(conn: SSHConn, session: DbSession, request: Request):
    """
    Create a ssh connection within 'user_id\'s' namespace
    """
    user_id = get_current_user(request)
    if not user_id:
        raise HTTPException(
            status_code=400, detail="Failed to process request, no user logged in"
        )
    try:
        # user = get_user_by_id(user_id, session)
        ssh_logger.debug("Creating connection")
        res = dict(create(user_id, conn, session)._mapping)
        ssh_logger.debug("Session created")
        return {"results": res}
    except Exception as e:
        ssh_logger.error(f"Failed to create user: {e}")
        raise HTTPException(status_code=400, detail="Failed to process request")
