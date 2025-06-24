from ..db.core import DbSession
from .models import SSHConnection, SSHConn
from ..auth.models import UserAccount

# from ..auth.service import get_current_user
from sqlalchemy import select, insert
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
import logging
import pickle
import os

ssh_service_logger = logging.getLogger("web_ssh.ssh.service")


def get_all(user: UserAccount, dbsession: DbSession):
    stmt = select(
        SSHConnection.connection_id,
        SSHConnection.label,
        SSHConnection.hostname,
        SSHConnection.username,
    ).where(
        SSHConnection.user_id == user.user_id
    )  # note need to either pass id in query string on client
    # or get it from session object
    print(stmt)
    try:
        connections = list(dbsession.execute(stmt).all())
        return connections
    except Exception as e:
        ssh_service_logger.error(f"Failed to execute query {e}")


def get_credentials(connection_id, dbsession: DbSession):
    """
    Get credentials to start an ssh connection

    **Note** : This function is intended for sending directly to ssh runner.
    There will be another function for getting a singular ssh connection for crud operations on web client.
    """
    # TODO: stub for getting connection,
    # will be needed to spin up ssh sessions
    stmt = select(
        SSHConnection.hostname, SSHConnection.username, SSHConnection.credentials
    ).where(
        SSHConnection.connection_id == connection_id
    )  # should also make sure that the user requesting these 
       # credentials owns this resource
    try:
        connection = dbsession.execute(stmt).one_or_none()._mapping
        return connection
    except Exception as e:
        pass

def decrypt(ciphertext: bytes):
    with open("secrets.key", "rb") as key_file:
        key = key_file.read(32)
    aesgcm = AESGCM(key)
    nonce = b'\xc1\xec\x94)\xd9\xe3(M\x1b\x1eBM' # hard coded for testing purposes
    # ct = ciphertext[12:]
    plaintext = aesgcm.decrypt(nonce, ciphertext, None)
    return plaintext

def encrypt(buffer: bytes) -> bytes:
    with open("secrets.key", "rb") as key_file:
        key = key_file.read(32)
    aesgcm = AESGCM(key)
    # nonce = os.urandom(12)
    nonce = b'\xc1\xec\x94)\xd9\xe3(M\x1b\x1eBM'
    print(nonce)
    ciphertext = nonce + aesgcm.encrypt(nonce, buffer, None)
    return ciphertext


def create(user_id: int, ssh_connection: SSHConn, dbsession: DbSession):
    try:
        credentials_as_bytes = pickle.dumps(ssh_connection.credentials)
        print(f"Storing creds: {credentials_as_bytes}")
    except Exception as e:
        ssh_service_logger.error(f"Failed to serialize {e}")
    ssh_service_logger.debug(f"Creds as bytes: {credentials_as_bytes}")
    # encrypted_credentials = encrypt(credentials_as_bytes)
    stmt = (
        insert(SSHConnection)
        .values(
            label=ssh_connection.label,
            hostname=ssh_connection.hostname,
            username=ssh_connection.username,
            user_id=user_id,
            credentials=credentials_as_bytes,
        )
        .returning(
            SSHConnection.label,
            SSHConnection.connection_id,
            SSHConnection.hostname,
            SSHConnection.created_at,
        )
    )
    try:
        connection = dbsession.execute(stmt)
        return connection.one_or_none()
    except Exception as e:
        ssh_service_logger.error(f"Failed to insert: {e}")
