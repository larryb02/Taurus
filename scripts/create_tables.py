from api.db.core import Base, engine
from api.ssh.models import SSHConnection
from sqlalchemy.orm import Session


def create_creds(credentials: dict):
    return bytes()


creds = {"type": "password", "password": "password"}
# Base.metadata.create_all(engine)
with Session(engine) as session:
    session.begin()

    dummy_srv = SSHConnection(
        label='dummy_server',
        hostname='localhost',
        username='dummy',
        credentials=create_creds(creds),
        user_id=1
    )
    session.add(dummy_srv)
    session.commit()
    session.close()
