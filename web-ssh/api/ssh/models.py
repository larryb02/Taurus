from pydantic import BaseModel
from ..db.core import Base
from sqlalchemy import ForeignKey, String, TIMESTAMP, LargeBinary
from sqlalchemy.orm import Mapped, mapped_column
from ..auth.models import UserAccount
from datetime import datetime
from typing import Annotated


class Auth(BaseModel):
    auth_type: str
    credentials: str



class SSHConnection(Base):
    __tablename__ = "sshconnection"

    connection_id: Mapped[int] = mapped_column(primary_key=True)
    label: Mapped[str] = mapped_column(String(255))
    hostname: Mapped[str] = mapped_column(String(255))
    username: Mapped[str] = mapped_column(String(255))
    user_id: Mapped[int] = mapped_column(ForeignKey(UserAccount.user_id))
    credentials: Mapped[bytes] = mapped_column(LargeBinary())
    created_at: Mapped[datetime] = mapped_column(TIMESTAMP, default=datetime.now())


class SSHConn(BaseModel):
    label: Annotated[str, "Label for management of ssh connections"]
    hostname: Annotated[str, "Hostname for ssh connection"]
    username: Annotated[str, "Username for ssh connection"]
    credentials: Annotated[
        Auth,
        (
            "ssh credentials, "
            "expected format 'type': <AuthType>, 'credentials': <credentials>",
        ),
    ]
