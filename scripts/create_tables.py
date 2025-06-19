from api.db.core import Base, engine
from api.ssh.models import SSHConnection
from sqlalchemy.orm import Session


def create_creds(credentials: dict):
    return bytes()


# creds = {"type": "password", "password": "password"}
# Base.metadata.create_all(engine)
with Session(engine) as session:
    session.begin()

    dummy_srv = SSHConnection(
        label="dummy_server",
        hostname="localhost",
        username="dummy",
        credentials=b"Z1+5N0FGwG4Qnr1k1rcNqbf1I5KTpr0R3pAV+f6y19c=",
        user_id=1,
    )
    anotha_srv = SSHConnection(
        label="fake_server",
        hostname="fakesrv@nine-ten.com",
        username="fakeroot",
        credentials=b"Z1+5N0FGwG4Qnr1k1rcNqbf1I5KTpr0R3pAV+f6y19c=",
        user_id=1
    )
    session.add(dummy_srv)
    session.add(anotha_srv)
    session.commit()
    session.close()
