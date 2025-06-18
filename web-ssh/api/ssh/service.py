from ..db.core import DbSession
from .models import SSHConnection, SSHConn
from sqlalchemy import select, insert
import logging

ssh_service_logger = logging.getLogger("web_ssh.ssh.service")
ssh_service_logger.propagate = False


def get_all(dbsession: DbSession):
    stmt = select(
        SSHConnection.connection_id,
        SSHConnection.label,
        SSHConnection.hostname,
        SSHConnection.username,
    ).where(
        SSHConnection.user_id == 1
    )  # note need to either pass id in query string on client
    # or get it from session object
    try:
        connections = list(dbsession.execute(stmt).all())
        return connections
    except Exception as e:
        ssh_service_logger.error(f"Failed to execute query {e}")


def create(ssh_connection: SSHConn, dbsession: DbSession):
    
    stmt = (
        insert(SSHConnection)
        .values()
        .returning(
            SSHConnection.connection_id,
            SSHConnection.hostname,
            SSHConnection.created_at,
            SSHConnection.label,
        )
    )
    pass
