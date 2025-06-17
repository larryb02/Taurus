from ..db.core import DbSession
from .models import SSHConnection
from sqlalchemy import select
import logging

logger = logging.getLogger("uvicorn.error")


def get_connections(dbsession: DbSession):
    stmt = select(
        SSHConnection.connection_id,
        SSHConnection.label,
        SSHConnection.hostname,
        SSHConnection.username,
    ).where(SSHConnection.user_id == 1)
    try:
        connections = dbsession.execute(stmt).fetchall()
        return connections
    except Exception as e:
        logger.error(f"Failed to execute query {e}")
